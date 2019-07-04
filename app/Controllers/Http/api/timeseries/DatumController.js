'use strict'

const Device = use('App/Models/Device')
const Database = use('Database')
const Ws = use('Ws')

class DatumController {
  async store ({ request, response, params: { serialNumber } }) {
    const promises = []
    const data = request.post()
    const userId = (await Device.findByOrFail('serial_number', serialNumber)).user_id

    // insert data using key as database with prefix `timeseries`
    Object.keys(data).forEach((key) => {
      const timeseriesData = { ...data[key], serial_number: serialNumber }
      promises.push(Database.insert(timeseriesData).into(`timeseries_${key}`))
    })

    // push alert if some value in fault_info is true except time
    Object.keys(data.fault_info).forEach((key) => {
      const isNotTime = (key !== 'time')
      if (data.fault_info[key] && isNotTime) {
        // send alert to channel alert with channel alert:{user_id}
        const subscriptions = Ws.getChannel('alert:*').topic(`alert:${userId}`)
        // send alert when subscriptions available
        if (subscriptions) {
          subscriptions.broadcast('notify', key)
        }
      }
    })

    const subscriptions = Ws.getChannel('realtime-data:*').topic(`realtime-data:${userId}`)
    if (subscriptions) {
      subscriptions.broadcast('notify', data)
    }

    await Promise.all(promises)
    return response.ok({
      status: 200,
      error: false,
      message: 'Data writed'
    })
  }
}

module.exports = DatumController

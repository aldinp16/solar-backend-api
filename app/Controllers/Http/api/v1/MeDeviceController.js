'use strict'

const Database = use('Database')

class MeDeviceController {
  async index ({ request, response, auth }) {
    const user = auth.current.user
    const devices = (await user
      .devices()
      .fetch()
    ).toJSON()
    return response.ok({
      status: 200,
      error: false,
      data: devices
    })
  }

  async store ({ request, response, auth }) {
    const user = auth.current.user
    await user
      .devices()
      .create(request.only(['name', 'serial_number', 'longitude', 'latitude']))
    return response.ok({
      status: 200,
      error: false,
      message: 'Device added'
    })
  }

  async show ({ request, response, auth, params: { serialNumber } }) {
    const user = auth.current.user
    const device = (await user
      .devices()
      .where({ serial_number: serialNumber })
      .fetch()
    ).toJSON()
    const systemInfo = await Database
      .table('timeseries_system_info')
      .where('serial_number', serialNumber)
      .orderBy('time', 'desc')
      .first()
    return response.ok({
      status: 200,
      error: false,
      data: { ...device[0], ...systemInfo }
    })
  }

  async update ({ request, response, auth, params: { serialNumber } }) {
    const user = auth.current.user
    await user
      .devices()
      .where({ serial_number: serialNumber })
      .update(request.only(['name', 'longitude', 'latitude']))
    return response.ok({
      status: 200,
      error: false,
      message: 'Device updated'
    })
  }

  async delete ({ request, response, auth, params: { serialNumber } }) {
    const user = auth.current.user
    await user
      .devices()
      .where({ serial_number: serialNumber })
      .delete()
    return response.ok({
      status: 200,
      error: false,
      message: 'Device deleted'
    })
  }
}

module.exports = MeDeviceController

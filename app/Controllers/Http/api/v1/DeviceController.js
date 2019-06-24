'use strict'

const Device = use('App/Models/Device')
const User = use('App/Models/User')

class DeviceController {
  async index ({ request, response, params: { username } }) {
    const devices = (await Device
      .query()
      .where({ username })
      .paginate(+request.input('page', 1), 10)
    ).toJSON()
    return response.ok({
      status: 200,
      error: false,
      ...devices
    })
  }

  async store ({ request, response, params: { username } }) {
    const user = await User.findByOrFail('username', username)
    await user
      .devices()
      .create(request.only(['name', 'serial_number', 'longitude', 'latitude']))
    return response.ok({
      status: 200,
      error: false,
      message: 'Device added'
    })
  }

  async show ({ request, response, params: { serialNumber, username } }) {
    const user = await User.findByOrFail('username', username)
    const device = (await user
      .devices()
      .where({ serial_number: serialNumber })
      .fetch()
    ).toJSON()
    return response.ok({
      status: 200,
      error: false,
      data: device[0]
    })
  }

  async update ({ request, response, params: { serialNumber, username } }) {
    const user = await User.findByOrFail('username', username)
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

  async delete ({ request, response, params: { serialNumber, username } }) {
    const user = await User.findByOrFail('username', username)
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

module.exports = DeviceController

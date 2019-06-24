'use strict'

class MeDeviceController {
  async index ({ request, response, auth }) {
    const user = auth.current.user
    const devices = (await user
      .devices()
      .paginate(+request.input('page', 1), 10)
    ).toJSON()
    return response.ok({
      status: 200,
      error: false,
      ...devices
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
    return response.ok({
      status: 200,
      error: false,
      data: device[0]
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

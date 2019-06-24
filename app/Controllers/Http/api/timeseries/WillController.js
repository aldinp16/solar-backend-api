'use strict'

const Device = use('App/Models/Device')

class WillController {
  async updateStatus ({ request, response, params: { serialNumber } }) {
    const status = request.input('status')
    const device = await Device.findByOrFail('serial_number', serialNumber)
    device.status = (status === 'online')
    await device.save()
    return response.send({
      status: 200,
      error: false,
      message: 'Status updated'
    })
  }
}

module.exports = WillController

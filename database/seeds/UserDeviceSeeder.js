'use strict'

/*
|--------------------------------------------------------------------------
| UserDeviceSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const User = use('App/Models/User')
const Device = use('App/Models/Device')

class UserDeviceSeeder {
  async run () {
    const user = new User()
    user.fullname = 'Aldi Nugraha'
    user.username = 'aldinp16'
    user.email = 'aldinugrahap16@gmail.com'
    user.password = 'aldinp16!@#'
    user.phone_number = '087722105682'
    user.is_admin = true
    await user.save()

    const device = new Device()
    device.name = 'ML2420'
    device.serial_number = '178132'
    device.longitude = 38.8951
    device.latitude = -77.0364
    await user.devices().save(device)
  }
}

module.exports = UserDeviceSeeder

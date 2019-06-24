'use strict'

const { test, trait } = use('Test/Suite')('Device List')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('user can read their device list', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const devices = await Factory.model('App/Models/Device').makeMany(5)
  await user.devices().saveMany(devices)

  const response = await client
    .get(`api/v1/me/device`)
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: []
  })
}).timeout(0)

'use strict'

const { test, trait } = use('Test/Suite')('Create')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('user can add their device', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const device = (await Factory.model('App/Models/Device').make()).toJSON()

  const response = await client
    .post(`/api/v1/me/device`)
    .loginVia(user)
    .send(device)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    message: 'Device added'
  })
})

test('user can\'t add deir device because validation error', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .post(`/api/v1/me/device`)
    .loginVia(user)
    .send({ serial_number: 'isValid?' })
    .end()

  response.assertStatus(400)
  response.assertJSONSubset({
    status: 400,
    error: true
  })
})

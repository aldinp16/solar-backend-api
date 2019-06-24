'use strict'

const { test, trait } = use('Test/Suite')('Register')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('user can register a new account', async ({ client }) => {
  const user = (await Factory
    .model('App/Models/User')
    .make()
  ).toJSON()
  const userCustomPassword = 'passwordsecret123'

  const response = await client
    .post('/api/v1/register')
    .send({
      ...user,
      password: userCustomPassword,
      password_confirmation: userCustomPassword
    })
    .end()

  response.assertStatus(200)
  response.assertJSON({
    status: 200,
    error: false,
    message: 'Successfully registered'
  })
}).timeout(0)

test('user can\'t register because validation error', async ({ client }) => {
  const user = (await Factory
    .model('App/Models/User')
    .make()
  ).toJSON()

  const response = await client
    .post('/api/v1/register')
    .send({ ...user, password: 'passwordsecret123' })
    .end()

  response.assertStatus(400)
  response.assertJSONSubset({
    status: 400,
    error: true,
    data: [{ field: 'password', validation: 'confirmed' }]
  })
}).timeout(0)

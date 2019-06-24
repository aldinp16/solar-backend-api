'use strict'

const { test, trait } = use('Test/Suite')('Auth')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('user can login and return token', async ({ client }) => {
  const userPassword = 'secretpassword'
  const user = await Factory.model('App/Models/User').create({ password: userPassword })

  const response = await client
    .post('/api/v1/auth')
    .send({ email: user.email, password: userPassword })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: { type: 'bearer' }
  })
})

test('user can\'t login because validation error', async ({ client }) => {
  const response = await client
    .post('/api/v1/auth')
    .send({ email: 'notvalidemail', password: 'wrongpassword' })
    .end()

  response.assertStatus(400)
  response.assertJSONSubset({
    status: 400,
    error: true,
    data: [{ field: 'email', validation: 'email' }]
  })
})

test('user can\'t login because user not found', async ({ client }) => {
  const response = await client
    .post('/api/v1/auth')
    .send({ email: 'valid@email.com', password: 'wrongpassword' })
    .end()

  response.assertStatus(401)
  response.assertJSONSubset({
    status: 401,
    error: true,
    message: 'invalid email or password'
  })
})

test('user can\'t login because password error', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .post('/api/v1/auth')
    .send({ email: user.email, password: 'wrongpassword' })
    .end()

  response.assertStatus(401)
  response.assertJSONSubset({
    status: 401,
    error: true,
    message: 'invalid email or password'
  })
})

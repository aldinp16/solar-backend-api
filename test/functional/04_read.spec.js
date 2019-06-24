'use strict'

const { test, trait } = use('Test/Suite')('Read')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('user can read their account', async ({ client }) => {
  const user = (await Factory
    .model('App/Models/User')
    .create()
  ).toJSON()

  const response = await client
    .get('/api/v1/me')
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: { username: user.username }
  })
}).timeout(0)

test('user can\'t read other account', async ({ client }) => {
  const users = await Factory.model('App/Models/User').createMany(2)

  const response = await client
    .get(`api/v1/user/${users[0].username}`)
    .loginVia(users[1])
    .end()

  response.assertStatus(403)
  response.assertJSONSubset({
    status: 403,
    error: true,
    message: 'E_UNAUTHORIZED_ACCESS: Access Denied'
  })
})

test('admin can read other user account', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({ is_admin: false })
  const admin = await Factory.model('App/Models/User').create({ is_admin: true })

  const response = await client
    .get(`api/v1/user/${user.username}`)
    .loginVia(admin)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: { username: user.username }
  })
})

test('user can read their device', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const device = await Factory.model('App/Models/Device').make()
  await user.devices().save(device)

  const response = await client
    .get(`api/v1/me/device/${device.serial_number}`)
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: { serial_number: device.serial_number }
  })
})

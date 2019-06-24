'use strict'

const { test, trait } = use('Test/Suite')('Delete')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('user can delete their account', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .delete('/api/v1/me')
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    message: 'Successfully deleted'
  })
}).timeout(0)

test('user can\'t delete other user account', async ({ client }) => {
  const users = await Factory.model('App/Models/User').createMany(2)

  const response = await client
    .delete(`/api/v1/user/${users[0].username}`)
    .loginVia(users[1])
    .end()

  response.assertStatus(403)
  response.assertJSONSubset({
    status: 403,
    error: true,
    message: 'E_UNAUTHORIZED_ACCESS: Access Denied'
  })
}).timeout(0)

test('admin can delete other user account', async ({ client }) => {
  const [ admin, user ] = await Promise.all([
    Factory.model('App/Models/User').create({ is_admin: true }),
    Factory.model('App/Models/User').create({ is_admin: false })
  ])

  const response = await client
    .delete(`/api/v1/user/${user.username}`)
    .loginVia(admin)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    message: 'Successfully deleted'
  })
})

test('user can delete their device', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const device = await Factory.model('App/Models/Device').make()
  await user.devices().save(device)

  const response = await client
    .delete(`api/v1/me/device/${device.serial_number}`)
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    message: 'Device deleted'
  })
})

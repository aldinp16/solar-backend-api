'use strict'

const { test, trait } = use('Test/Suite')('Update')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('user can update their account', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const nameChange = 'namechanged'
  const response = await client
    .put('/api/v1/me')
    .loginVia(user)
    .send({ fullname: nameChange })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: { fullname: nameChange }
  })
}).timeout(0)

test('user can\'t update other user account', async ({ client }) => {
  const users = await Factory.model('App/Models/User').createMany(2)

  const nameChange = 'namechanged'
  const response = await client
    .put(`/api/v1/user/${users[0].username}`)
    .loginVia(users[1])
    .send({ fullname: nameChange })
    .end()

  response.assertStatus(403)
  response.assertJSONSubset({
    status: 403,
    error: true,
    message: 'E_UNAUTHORIZED_ACCESS: Access Denied'
  })
}).timeout(0)

test('admin can update other user account', async ({ client }) => {
  const [ admin, user ] = await Promise.all([
    Factory.model('App/Models/User').create({ is_admin: true }),
    Factory.model('App/Models/User').create({ is_admin: false })
  ])

  const nameChange = 'namechanged'
  const response = await client
    .put(`/api/v1/user/${user.username}`)
    .send({ fullname: nameChange })
    .loginVia(admin)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    data: { fullname: nameChange }
  })
}).timeout(0)

test('user can update their device', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const device = await Factory.model('App/Models/Device').make()
  await user.devices().save(device)

  const response = await client
    .put(`api/v1/me/device/${device.serial_number}`)
    .send({ name: 'namechange' })
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    message: 'Device updated'
  })
})

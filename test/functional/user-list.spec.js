'use strict'

const { test, trait } = use('Test/Suite')('User List')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('admin can get user list', async ({ client }) => {
  const userPromise = Factory.model('App/Models/User').create({ is_admin: true })
  const userListPromise = Factory.model('App/Models/User').createMany(20)
  const [ user ] = await Promise.all([userPromise, userListPromise])

  const response = await client
    .get('/api/v1/user')
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    status: 200,
    error: false,
    page: 1
  })
}).timeout(0)

test('user can\'t get user list', async ({ client }) => {
  const userPromise = Factory.model('App/Models/User').create({ is_admin: false })
  const userListPromise = Factory.model('App/Models/User').createMany(20)
  const [ user ] = await Promise.all([userPromise, userListPromise])

  const response = await client
    .get('/api/v1/user')
    .loginVia(user)
    .end()

  response.assertStatus(403)
  response.assertJSONSubset({
    status: 403,
    error: true,
    message: 'E_UNAUTHORIZED_ACCESS: Access Denied'
  })
}).timeout(0)

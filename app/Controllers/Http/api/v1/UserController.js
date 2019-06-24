'use strict'

const User = use('App/Models/User')

class UserController {
  async index ({ request, response }) {
    const users = (await User
      .query()
      .paginate(+request.input('page', 1), 10)
    ).toJSON()
    return response.ok({
      status: 200,
      error: false,
      ...users
    })
  }

  async store ({ request, response }) {
    await User.create(request.only(['fullname', 'username', 'email', 'password', 'phone_number']))
    return response.ok({
      status: 200,
      error: false,
      message: 'Successfully registered'
    })
  }

  async show ({ request, response, params: { username } }) {
    const user = await User.findByOrFail('username', username)
    return response.ok({
      status: 200,
      error: false,
      data: user
    })
  }

  async update ({ request, response, params: { username } }) {
    const user = await User.findByOrFail('username', username)
    user.merge(request.only(['fullname', 'email', 'phone_number', 'password']))
    await user.save()
    return response.ok({
      status: 200,
      error: false,
      data: user
    })
  }

  async delete ({ request, response, params: { username } }) {
    const user = await User.findByOrFail('username', username)
    await user.delete()
    return response.ok({
      status: 200,
      error: false,
      message: 'Successfully deleted'
    })
  }
}

module.exports = UserController

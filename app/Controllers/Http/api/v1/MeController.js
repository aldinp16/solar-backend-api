'use strict'

class MeController {
  async show ({ request, response, auth }) {
    const user = auth.current.user.toJSON()
    return response.ok({
      status: 200,
      error: false,
      data: user
    })
  }

  async update ({ request, response, auth }) {
    const user = auth.current.user
    user.merge(request.only(['fullname', 'email', 'phone_number', 'password']))
    await user.save()
    return response.ok({
      status: 200,
      error: false,
      data: user
    })
  }

  async delete ({ request, response, auth }) {
    const user = auth.current.user
    await user.delete()
    return response.ok({
      status: 200,
      error: false,
      message: 'Successfully deleted'
    })
  }
}

module.exports = MeController

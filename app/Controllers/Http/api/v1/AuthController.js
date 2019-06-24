'use strict'

class AuthController {
  async login ({ request, response, auth }) {
    const { email, password } = request.post()
    const token = await auth.attempt(email, password)
    return response.ok({
      status: 200,
      error: false,
      data: token
    })
  }
}

module.exports = AuthController

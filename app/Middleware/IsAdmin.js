'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const UnauthorizedAccessException = use('App/Exceptions/UnauthorizedAccessException')

class IsAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, auth }, next) {
    // call next to advance the request
    if (auth.current.user.is_admin) {
      return next()
    }

    throw new UnauthorizedAccessException()
  }
}

module.exports = IsAdmin

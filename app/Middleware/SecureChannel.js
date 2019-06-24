'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class SecureChannel {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async wsHandle ({ request, auth, socket }, next) {
    // call next to advance the request

    const socketTopic = socket.topic.split(':')[1]
    const userId = auth.current.user.id

    if (+socketTopic === userId) {
      return next()
    }

    return socket.close()
  }
}

module.exports = SecureChannel

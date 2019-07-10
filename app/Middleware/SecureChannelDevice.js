'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class SecureChannelDevice {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async wsHandle ({ request, auth, socket }, next) {
    // call next to advance the request

    const socketTopicDevice = socket.topic.split(':')[1]
    try {
      await auth.current.user
        .device()
        .where({ serial_number: socketTopicDevice })
        .fetch()
    } catch (err) {
      return socket.close()
    }

    await next()
  }
}

module.exports = SecureChannelDevice

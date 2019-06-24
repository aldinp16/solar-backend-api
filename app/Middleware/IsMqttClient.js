'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Env = use('Env')
const UnauthorizedAccessException = use('App/Exceptions/UnauthorizedAccessException')

class IsMqttClient {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    // call next to advance the request
    const mqttClientKey = request.header('x-mqtt-client-key')
    if (mqttClientKey === Env.get('MQTT_CLIENT_KEY')) {
      return next()
    }

    throw new UnauthorizedAccessException()
  }
}

module.exports = IsMqttClient

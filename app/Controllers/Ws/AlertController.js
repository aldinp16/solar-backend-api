'use strict'

class AlertController {
  constructor ({ socket, request, auth }) {
    this.socket = socket
    this.request = request
    this.auth = auth
  }
}

module.exports = AlertController

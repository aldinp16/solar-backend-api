'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

const message = 'Access Denied'
const status = 403
const code = 'E_UNAUTHORIZED_ACCESS'

class UnauthorizedAccessException extends LogicalException {
  constructor () {
    super(message, status, code)
  }
}

module.exports = UnauthorizedAccessException

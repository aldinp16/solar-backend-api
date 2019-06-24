'use strict'

class AuthStore {
  get rules () {
    return {
      email: 'required|email',
      password: 'required'
    }
  }

  get sanitizationRules () {
    return {
      email: 'strip_tags|normalize_email'
    }
  }

  get validateAll () {
    return true
  }
}

module.exports = AuthStore

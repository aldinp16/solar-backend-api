'use strict'

class UserUpdate {
  get rules () {
    return {
      fullname: 'max:100',
      email: 'email|unique:users,email',
      password: 'confirmed'
    }
  }

  get sanitizationRules () {
    return {
      fullname: 'strip_tags',
      phone_number: 'strip_tags'
    }
  }

  get validateAll () {
    return true
  }
}

module.exports = UserUpdate

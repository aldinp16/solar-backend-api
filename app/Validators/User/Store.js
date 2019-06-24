'use strict'

class UserStore {
  get rules () {
    return {
      fullname: 'required|max:100',
      username: 'required|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required|confirmed',
      phone_number: 'required'
    }
  }

  get sanitizationRules () {
    return {
      fullname: 'strip_tags',
      username: 'strip_tags',
      email: 'strip_tags|normalize_email',
      phone_number: 'strip_tags'
    }
  }

  get validateAll () {
    return true
  }
}

module.exports = UserStore

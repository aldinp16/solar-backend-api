'use strict'

class DeviceUpdate {
  get rules () {
    return {
      longitude: 'number',
      latitude: 'number'
    }
  }

  get sanitizationRules () {
    return {
      name: 'strip_tags',
      longitude: 'strip_tags',
      latitude: 'strip_tags'
    }
  }

  get validateAll () {
    return true
  }
}

module.exports = DeviceUpdate

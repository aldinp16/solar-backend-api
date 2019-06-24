'use strict'

class DeviceStore {
  get rules () {
    return {
      name: 'required',
      serial_number: 'required',
      longitude: 'required|number',
      latitude: 'required|number'
    }
  }

  get sanitizationRules () {
    return {
      name: 'strip_tags',
      serial_number: 'strip_tags',
      longitude: 'strip_tags',
      latitude: 'strip_tags'
    }
  }

  get validateAll () {
    return true
  }
}

module.exports = DeviceStore

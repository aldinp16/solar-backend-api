'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class TimeseriesSystemInfoSchema extends Schema {
  up () {
    this.create('timeseries_system_info', (table) => {
      // tag timestamp
      table.timestamp('time').defaultTo(this.fn.now())

      // tag field
      table.string('serial_number')

      // tag value
      table.integer('max_voltage_supported')
      table.integer('rated_charging_current')
      table.integer('rated_discharging_current')
      table.string('product_type')
      table.string('product_model')
      table.string('software_version')
      table.string('hardware_version')
      table.integer('device_address')
    })

    this.schedule(async (trx) => {
      await Database
        .raw(`SELECT create_hypertable('timeseries_system_info', 'time')`)
        .transacting(trx)
    })
  }

  down () {
    this.drop('timeseries_system_info')
  }
}

module.exports = TimeseriesSystemInfoSchema

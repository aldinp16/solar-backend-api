'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class TimeseriesControlDynamicInfoSchema extends Schema {
  up () {
    this.create('timeseries_control_dynamic_info', (table) => {
      // tag timestamp
      table.timestamp('time').defaultTo(this.fn.now())

      // tag field
      table.string('serial_number')

      // tag value
      table.integer('battery_capacity_SOC')
      table.float('battery_voltage')
      table.float('charging_current_to_battery')
      table.integer('controller_temp')
      table.integer('battery_temp')
      table.float('load_DC_voltage')
      table.float('load_DC_current')
      table.float('load_DC_power')
    })

    this.schedule(async (trx) => {
      await Database
        .raw(`SELECT create_hypertable('timeseries_control_dynamic_info', 'time')`)
        .transacting(trx)
    })
  }

  down () {
    this.drop('timeseries_control_dynamic_info')
  }
}

module.exports = TimeseriesControlDynamicInfoSchema

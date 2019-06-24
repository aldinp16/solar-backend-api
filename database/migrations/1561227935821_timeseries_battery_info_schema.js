'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class TimeseriesBatteryInfoSchema extends Schema {
  up () {
    this.create('timeseries_battery_info', (table) => {
      // tag timestamp
      table.timestamp('time').defaultTo(this.fn.now())

      // tag field
      table.string('serial_number')

      // tag value
      table.integer('load_command')
      table.float('battery_min_volt_current_day')
      table.float('battery_max_volt_current_day')
      table.float('max_charging_current_current_day')
      table.float('max_discharging_current_current_day')
      table.integer('max_charging_power_current_day')
      table.integer('max_discharging_power_current_day')
      table.integer('charging_amp_hrs_current_day')
      table.integer('discharging_amp_hrs_current_day')
      table.integer('power_generation_current_day')
      table.integer('power_consumption_the_day')
    })

    this.schedule(async (trx) => {
      await Database
        .raw(`SELECT create_hypertable('timeseries_battery_info', 'time')`)
        .transacting(trx)
    })
  }

  down () {
    this.drop('timeseries_battery_info')
  }
}

module.exports = TimeseriesBatteryInfoSchema

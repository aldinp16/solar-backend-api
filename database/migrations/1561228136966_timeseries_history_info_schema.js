'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class TimeseriesHistoryInfoSchema extends Schema {
  up () {
    this.create('timeseries_history_info', (table) => {
      // tag timestamp
      table.timestamp('time').defaultTo(this.fn.now())

      // tag field
      table.string('serial_number')

      // tag value
      table.integer('total_number_operating_days')
      table.integer('total_number_battery_over_discharge')
      table.integer('total_number_battery_full_discharge')
      table.integer('total_charging_amp_hrs_battery')
      table.integer('total_sischarging_amp_hrs_battery')
      table.integer('cumulative_power_generation')
      table.integer('cumulative_power_consumption')
    })

    this.schedule(async (trx) => {
      await Database
        .raw(`SELECT create_hypertable('timeseries_history_info', 'time')`)
        .transacting(trx)
    })
  }

  down () {
    this.drop('timeseries_history_info')
  }
}

module.exports = TimeseriesHistoryInfoSchema

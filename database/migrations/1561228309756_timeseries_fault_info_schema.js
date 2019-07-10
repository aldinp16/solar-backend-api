'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class TimeseriesFaultInfoSchema extends Schema {
  up () {
    this.create('timeseries_fault_info', (table) => {
      // tag timestamp
      table.timestamp('time').defaultTo(this.fn.now())

      // tag field
      table.string('serial_number')

      // tag value
      table.boolean('charge_MOS_short_circuit')
      table.boolean('anti_reverse_MOS_short')
      table.boolean('solarpanel_reversely_connected')
      table.boolean('solarpanel_working_point_over_voltage')
      table.boolean('solarpanel_counter_current')
      table.boolean('photovoltaic_input_side_over_voltage')
      table.boolean('photovoltaic_input_side_short_circuit')
      table.boolean('photovoltaic_input_over_power')
      table.boolean('ambient_temperature_too_high')
      table.boolean('controller_temperature_too_high')
      table.boolean('load_overpower_or_load_over_current')
      table.boolean('load_short_circuit')
      table.boolean('battery_over_discharge')
      table.boolean('battery_over_voltage')
      table.boolean('battery_under_voltage_warning')
    })

    this.schedule(async (trx) => {
      await Database
        .raw(`SELECT create_hypertable('timeseries_fault_info', 'time')`)
        .transacting(trx)
    })
  }

  down () {
    this.drop('timeseries_fault_info')
  }
}

module.exports = TimeseriesFaultInfoSchema

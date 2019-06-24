'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class TimeseriesSolarPanelInfoSchema extends Schema {
  up () {
    this.create('timeseries_solar_panel_info', (table) => {
      // tag timestamp
      table.timestamp('time').defaultTo(this.fn.now())

      // tag field
      table.string('serial_number')

      // tag value
      table.float('solar_panel_voltage')
      table.float('solar_panel_current_to_controller')
      table.float('charging_power')
    })

    this.schedule(async (trx) => {
      await Database
        .raw(`SELECT create_hypertable('timeseries_solar_panel_info', 'time')`)
        .transacting(trx)
    })
  }

  down () {
    this.drop('timeseries_solar_panel_info')
  }
}

module.exports = TimeseriesSolarPanelInfoSchema

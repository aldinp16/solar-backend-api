'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class TimeseriesLoadInfoSchema extends Schema {
  up () {
    this.create('timeseries_load_info', (table) => {
      // tag timestamp
      table.timestamp('time').defaultTo(this.fn.now())

      // tag field
      table.string('serial_number')

      // tag value
      table.boolean('load_status')
      table.integer('brightness')
      table.string('charging_state')
    })

    this.schedule(async (trx) => {
      await Database
        .raw(`SELECT create_hypertable('timeseries_load_info', 'time')`)
        .transacting(trx)
    })
  }

  down () {
    this.drop('timeseries_load_info')
  }
}

module.exports = TimeseriesLoadInfoSchema

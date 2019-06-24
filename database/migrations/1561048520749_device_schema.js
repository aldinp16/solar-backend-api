'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DeviceSchema extends Schema {
  up () {
    this.create('devices', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.string('name', 100)
      table.string('serial_number').notNullable().unique()
      table.boolean('status').defaultTo(false)
      table.decimal('longitude')
      table.decimal('latitude')
      table.timestamps()
    })
  }

  down () {
    this.drop('devices')
  }
}

module.exports = DeviceSchema

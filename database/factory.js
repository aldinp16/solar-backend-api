'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/User', (faker, i, data) => {
  return {
    fullname: faker.name({ nationality: 'it' }),
    username: faker.username(),
    email: faker.email({ domain: 'example.com' }),
    password: data.password || faker.string({ length: 16 }),
    phone_number: faker.phone(),
    is_admin: data.is_admin || false
  }
})

Factory.blueprint('App/Models/Device', (faker, i, data) => {
  return {
    name: faker.word(),
    serial_number: faker.guid(),
    longitude: faker.longitude(),
    latitude: faker.latitude(),
    status: faker.bool()
  }
})

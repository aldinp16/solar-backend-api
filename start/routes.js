'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// No authentication, only guest
Route.group(() => {
  Route.post('auth', 'AuthController.login').validator('Auth/Store')
  Route.post('register', 'UserController.store').validator('User/Store')
}).namespace('api/v1').prefix('api/v1').middleware(['guest'])

// Need authentication
Route.group(() => {
  Route.get('/', 'MeController.show')
  Route.put('/', 'MeController.update').validator('User/Update')
  Route.delete('/', 'MeController.delete')

  Route.get('device', 'MeDeviceController.index')
  Route.post('device', 'MeDeviceController.store').validator('Device/Store')
  Route.get('device/:serialNumber', 'MeDeviceController.show')
  Route.put('device/:serialNumber', 'MeDeviceController.update').validator('Device/Update')
  Route.delete('device/:serialNumber', 'MeDeviceController.delete')

  Route.get('device/:serialNumber/historicalData', 'HistoricalDatumController.index')
  Route.get('device/:serialNumber/dashboard', 'DeviceDashboardController.index')
}).namespace('api/v1').prefix('api/v1/me').middleware(['auth'])

// Only is_admin true can access
Route.group(() => {
  Route.get('/', 'UserController.index')
  Route.get(':username', 'UserController.show')
  Route.put(':username', 'UserController.update').validator('User/Update')
  Route.delete(':username', 'UserController.delete')

  Route.get('device', 'DeviceController.index')
  Route.post('device', 'DeviceController.store').validator('Device/Store')
  Route.get('device/:serialNumber', 'DeviceController.show')
  Route.put('device/:serialNumber', 'DeviceController.update').validator('Device/Update')
  Route.delete('device/:serialNumber', 'DeviceController.delete')
}).namespace('api/v1').prefix('api/v1/user').middleware(['auth', 'isAdmin'])

Route.group(() => {
  Route.put(':serialNumber/status', 'WillController.updateStatus')
  Route.post(':serialNumber/data', 'DatumController.store')
}).namespace('api/timeseries').prefix('api/timeseries').middleware(['isMqttClient'])

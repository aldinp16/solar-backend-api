'use strict'

const Database = use('Database')

class DeviceDashboardController {

  $getLastInfo (tableName, serialNumber) {
    return Database
      .table(tableName)
      .where('serial_number', serialNumber)
      .orderBy('time', 'desc')
      .first()
  }


  async index ({ request, response, auth, params: { serialNumber } }) {
    const user = auth.current.user
    await user
      .devices()
      .where({ serial_number: serialNumber})
      .fetch()
 
    const tableList = [
      'timeseries_system_info',
      'timeseries_control_dynamic_info',
      'timeseries_solar_panel_info',
      'timeseries_battery_info',
      'timeseries_history_info',
      'timeseries_load_info'
    ]

    const data = await Promise.all(tableList.map((table) => this.$getLastInfo(table, serialNumber)))
    const groupedData = {}
    tableList.forEach((table, i) => {
      const groupName = table.split('_').slice(1).join('_')
      groupedData[`${groupName}`] = data[i]
    })

    return response.ok({
      status: 200,
      error: false,
      data: groupedData
    })
  }

}

module.exports = DeviceDashboardController

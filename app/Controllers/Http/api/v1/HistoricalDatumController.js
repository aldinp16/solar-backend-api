'use strict'

const Database = use('Database')

class HistoricalDatumController {
  async index ({ request, response, auth, params: { serialNumber } }) {
    const user = auth.current.user
    await user
      .devices()
      .where({ serial_number: serialNumber })
      .fetch()

    const batteryInfoQuery = `
SELECT
  time_bucket('1 day', time) AS day,
  last(battery_min_volt_current_day, time) as battery_min_volt_current_day,
  last(battery_max_volt_current_day, time) as battery_max_volt_current_day,
  last(max_charging_current_current_day, time) as max_charging_current_current_day,
  last(max_discharging_current_current_day, time) as max_discharging_current_current_day,
  last(max_charging_power_current_day, time) as max_charging_power_current_day,
  last(max_discharging_power_current_day, time) as max_discharging_power_current_day,
  last(charging_amp_hrs_current_day, time) as charging_amp_hrs_current_day,
  last(discharging_amp_hrs_current_day, time) as discharging_amp_hrs_current_day,
  last(power_generation_current_day, time) as power_generation_current_day,
  last(power_consumption_the_day, time) as power_consumption_the_day
FROM
  timeseries_battery_info
WHERE
  serial_number = ?
    AND
  time >= ?
    AND 
  time <= ?
GROUP BY
  day
ORDER BY
  day
ASC;
`
    const historyInfoQuery = `
SELECT 
  time_bucket('1 day', time) AS day,
  last(total_number_operating_days, time) as total_number_operating_days,
  last(total_number_battery_over_discharge, time) as total_number_battery_over_discharge,
  last(total_number_battery_full_discharge, time) as total_number_battery_full_discharge,
  last(total_charging_amp_hrs_battery, time) as total_charging_amp_hrs_battery,
  last(total_discharging_amp_hrs_battery, time) as total_sischarging_amp_hrs_battery,
  last(cumulative_power_generation, time) as cumulative_power_generation,
  last(cumulative_power_consumption, time) as cumulative_power_consumption
FROM
  timeseries_history_info
WHERE
  serial_number = ?
    AND
  time >= ?
    AND 
  time <= ?
GROUP BY
  day
ORDER BY
  day
ASC;
`
    const data = await Promise.all([ batteryInfoQuery, historyInfoQuery ].map((query) => {
      return Database.raw(query, [ serialNumber, request.input('timeStart'), request.input('timeEnd') ])
    }))

    return response.ok({
      status: 200,
      error: false,
      data: { batteryInfo: data[0].rows, historyInfo: data[1].rows }
    })
  }

  async show ({ request, response, auth, params: { serialNumber } }) {
    // const user = auth.current.user
    // await user
    //   .devices()
    //   .where({ serial_number: serialNumber })
    //   .fetch()

    const tableList = [
      'timeseries_system_info',
      'timeseries_control_dynamic_info',
      'timeseries_solar_panel_info',
      'timeseries_battery_info',
      'timeseries_history_info',
      'timeseries_load_info'
    ]

    const data = await Promise.all(tableList.map((table) => {
      return Database.raw(`
        SELECT * FROM ${table} WHERE CAST(time as DATE) = ? AND serial_number = ? ORDER BY time ASC;
      `, [ request.input('date'), serialNumber ])
    }))
    const groupedData = {}
    tableList.forEach((table, i) => {
      const groupName = table.split('_').slice(1).join('_')
      groupedData[`${groupName}`] = data[i].rows
    })

    return response.ok({
      status: 200,
      error: false,
      data: groupedData
    })
  }
}

module.exports = HistoricalDatumController

'use strict'

const Database = use('Database')

class HistoricalDatumController {
  async batteryInfo ({ request, response, auth, params: { serialNumber } }) {
    const user = auth.current.user
    await user
      .devices()
      .where({ serial_number: serialNumber })
      .fetch()

    const query = `
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
  day;
`
    const batteryInfo = await Database.raw(query, [ serialNumber, request.input('timeStart'), request.input('timeEnd') ])
    return response.ok({
      status: 200,
      error: false,
      data: batteryInfo.rows
    })
  }

  async historyInfo ({ request, response, auth, params: { serialNumber } }) {
    const user = auth.current.user
    await user
      .devices()
      .where({ serial_number: serialNumber })
      .fetch()
    const query = `
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
  day;
`
    const historyInfo = await Database.raw(query, [ serialNumber, request.input('timeStart'), request.input('timeEnd') ])
    return response.ok({
      status: 200,
      error: false,
      data: historyInfo.rows
    })
  }
}

module.exports = HistoricalDatumController

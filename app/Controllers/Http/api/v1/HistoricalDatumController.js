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
    const user = auth.current.user
    await user
      .devices()
      .where({ serial_number: serialNumber })
      .fetch()

    const controlDynamicInfoQuery = `
SELECT
  time_bucket('30 minutes', time) AS thirty_min,
  last("battery_capacity_SOC", time) AS battery_capacity_SOC,
  last("battery_voltage", time) AS battery_voltage,
  last("charging_current_to_battery", time) AS charging_current_to_battery,
  last("controller_temp", time) AS controller_temp,
  last("battery_temp", time) AS battery_temp,
  last("load_DC_voltage", time) AS load_DC_voltage,
  last("load_DC_current", time) AS load_DC_current,
  last("load_DC_power", time) AS load_DC_power
FROM 
  timeseries_control_dynamic_info
WHERE
    CAST(time as DATE) = ?
  AND
    serial_number = ?
GROUP BY
  thirty_min
ORDER BY
  thirty_min
ASC;
    `

    const solarPanelInfoQuery = `
SELECT
  time_bucket('30 minutes', time) AS thirty_min,
  last("solar_panel_voltage", time) AS solar_panel_voltage,
  last("solar_panel_current_to_controller", time) AS solar_panel_current_to_controller,
  last("charging_power", time) AS charging_power
FROM
  timeseries_solar_panel_info
WHERE
    CAST(time as DATE) = ?
  AND
    serial_number = ?
GROUP BY
  thirty_min
ORDER BY
  thirty_min
ASC;
    `

    const [ controlDynamicInfo, solarPanelInfo ] = await Promise.all([ controlDynamicInfoQuery, solarPanelInfoQuery ].map((query) => {
      return Database.raw(query, [ request.input('date'), serialNumber ])
    }))

    return response.ok({
      status: 200,
      error: false,
      data: { controlDynamicInfo: controlDynamicInfo.rows, solarPanelInfo: solarPanelInfo.rows }
    })
  }
}

module.exports = HistoricalDatumController

# Changelog
All notable changes to this project will be documented in this file.

## [1.0.0] - 2019-07-17
### Changed
- no change, jus up to 1.0.0 stable

## [0.4.3] - 2019-07-12
### Changed
- fix some typo and added return statement

## [0.4.2] - 2019-07-12
### Changed
- fixtypo in channel websocket

## [0.4.1] - 2019-07-10
### Added
- add more attribute in fault_info
- add more info in alert payload

### Changed
- change detail history data to interval 30 minutes
- change alert topic from user id to serial_number

## [0.4.0] - 2019-07-09
### Added
- add order by time desc in historical data
- add historical data detail

## [0.3.3] - 2019-07-07
### Added
- add system_info data in device info endpoint

## [0.3.2] - 2019-07-06
### Changed
- refactor JSON response (merge historical info endpoint)

## [0.3.1] - 2019-07-06
### Changed
- refactor JSON response

## [0.3.0] - 2019-07-06
### Added
- `InvalidJwtToken` exception
- device dashboard

### Changed
- refactor devicelist json format
- fix batteryInfo and historyInfo typo controller

## [0.2.1] - 2019-07-05
### Added
- fix timestamp value check
- fix dis > sis in schema and data handler

## [0.2.0] - 2019-07-04
### Added
- add historical data endpoint

### Changed
- fix serial_number empty when write point timeseries

### Removed
- remove pagination in user device list

## [0.1.1] - 2019-07-02
### Added
- add user info in jwt payload #1

### Removed
- log in DatumController

## [0.1.0] - 2019-06-24
### Added
- user management
- device management
- admin role
- `api/timeseries for` write data from mqtt client
- real time data over websocket
- alert notification over websocket

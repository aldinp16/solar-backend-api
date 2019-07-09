# Changelog
All notable changes to this project will be documented in this file.

## [0.4.0] - 2019-07-09
### Added
- add order by time desc in historical data
- add historical data detail

## [0.3.3] - 2019-07-07
### Added
- add system_info data in device info endpoint

## [0.3.2] - 2019-07-06
### Changed
- Refactor JSON response (merge historical info endpoint)

## [0.3.1] - 2019-07-06
### Changed
- Refactor JSON response

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

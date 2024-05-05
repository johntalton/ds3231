# DS3231

Real Time Clock I²C driver library.

[![npm Version](http://img.shields.io/npm/v/@johntalton/ds3231.svg)](https://www.npmjs.com/package/@johntalton/ds3231)
![GitHub package.json version](https://img.shields.io/github/package-json/v/johntalton/ds3231)
![CI](https://github.com/johntalton/ds3231/workflows/CI/badge.svg)
![GitHub](https://img.shields.io/github/license/johntalton/ds3231)
[![Downloads Per Month](http://img.shields.io/npm/dm/@johntalton/ds3231.svg)](https://www.npmjs.com/package/@johntalton/ds3231)
![GitHub last commit](https://img.shields.io/github/last-commit/johntalton/ds3231)

# API

### `from`

```javascript
import { DS3231, CENTURY } from '@johntalton/ds3231'

const bus = /* byob */
const aBus = new I2CAddressedBus(bus)
const device = DS3231.from(aBus)

```

### `getTime`

```javascript
const { year, month, date, hours, minutes, seconds } = time

const storedDate = new Date(Date.UTC(
  CENTURY + year,
  month - 1,
  date,
  hours, minutes, seconds))

console.log(storedDate)

```

### `getAlarm1`

### `getAlarm2`

### `getControl`

### `getStatus`

Return object has these flags:
- `oscillatorStoppedFlag`
- `busyFlag`
- `alarm1Flag`
- `alarm2Flag`

as well as a status of the 32kHz output
- `output32kHzEnabled`


### `getAgingOffset`

### `getTemperature`

### `setTime`

Setting the time from an external known source is for useful clock functionality.  The values can be set as desired, but `Date.now()` seem a good choice:

```javascript
const device = /* ... */

const now = new Date(Date.now())

const seconds = now.getUTCSeconds()
const minutes = now.getUTCMinutes()
const hours = now.getUTCHours()
const date = now.getUTCDate()
const month = now.getUTCMonth() + 1
const year = now.getUTCFullYear() - CENTURY

await device.setTime({
  seconds, minutes, hours, date, month, year
})

```

### `setAlarm1`

### `setAlarm2`

### `setControl`

Enable the Alarms, toggle Interrupt / Square Wave output, and set backup battery mode for the oscillator and square wave functionality.

### `setStatus`

Useful for clearing the Oscillator stopped flag, or either of the alarm flags

### `setAgingOffset`





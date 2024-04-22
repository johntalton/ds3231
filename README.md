# DS3231

Real Time Clock I²C driver library.


[![npm Version](http://img.shields.io/npm/v/@johntalton/ds3231.svg)](https://www.npmjs.com/package/@johntalton/ds3231)
![GitHub package.json version](https://img.shields.io/github/package-json/v/johntalton/ds3231)
![CI](https://github.com/johntalton/ds3231/workflows/CI/badge.svg)
![CodeQL](https://github.com/johntalton/ds3231/workflows/CodeQL/badge.svg)
![GitHub](https://img.shields.io/github/license/johntalton/ds3231)
[![Downloads Per Month](http://img.shields.io/npm/dm/@johntalton/ds3231.svg)](https://www.npmjs.com/package/@johntalton/ds3231)
![GitHub last commit](https://img.shields.io/github/last-commit/johntalton/ds3231)
[![Package Quality](https://npm.packagequality.com/shield/%40johntalton%2Fds3231.svg)](https://packagequality.com/#?package=@johntalton/ds3231)


# Example

```javascript
import { DS3231 } from '@johntalton/ds3231'

const bus = /* byob */
const aBus = new I2CAddressedBus(bus)
const device = DS3231.from(aBus)


device.setTime(...)

```





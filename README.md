# DS3231

Real Time Clock I²C driver library.

# Example

```javascript
import { DS3231 } from '@johntalton/ds3231'

const bus = /* byob */
const aBus = new I2CAddressedBus(bus)
const device = DS3231.from(aBus)


device.setTime(...)

```





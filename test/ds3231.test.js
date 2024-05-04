import { describe, it } from 'mocha'
import { expect } from 'chai'

import { DS3231 } from '@johntalton/ds3231'

function bufferBus(byteArray) {
  const buffer = Uint8Array.from(byteArray)

  const self = {
    buffer,
    readI2cBlock: () => {
      return buffer
    },
    writeI2cBlock: (register, buffer) => {
      self.buffer = buffer
    }
  }

  return self
}


describe('DS3231', () => {
	it('getTime', async () => {
		const device = DS3231.from(bufferBus([
      // 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0
    ]))
		const time = await device.getTime()
		expect(time).deep.equal({
      seconds: 0,
      minutes: 0,
      hours: 0,
      pm: false,
      day: 0,
      date: 0,
      month: 0,
      year: 0,

      century: 0,
      twelveHourMode: false
    })
	})

	it('getTime', async () => {
		const bus = bufferBus([ ])
		const device = DS3231.from(bus)
		device.setTime({
      seconds: 37
    })

    expect(bus.buffer).to.be.instanceOf(ArrayBuffer)
    const u8 = new Uint8Array(bus.buffer)
    expect(u8[0]).to.equal(0b0011_0111)

    expect(u8[6]).to.equal(0b0000_0000)
	})
})
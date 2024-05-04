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

  it('getControl', async () => {
    const device = DS3231.from(bufferBus([ 0b1000_0100 ]))
		const control = await device.getControl()
    expect(control).to.deep.equal({
      alarm1Enabled: false,
      alarm2Enabled: false,
      convertTemperatureEnabled: false,
      squareWaveEnabled: false,
      batteryBackupOscillatorEnabled: false,
      batteryBackupSquareWaveEnabled: false,
      squareWaveFrequencyKHz: 1
    })
  })

  it('getStatus', async () => {
    const device = DS3231.from(bufferBus([ 0b1000_0100 ]))
		const status = await device.getStatus()
    expect(status).to.deep.equal({
      oscillatorStoppedFlag: true,
      output32kHzEnabled: false,
      busyFlag: true,
      alarm1Flag: false,
      alarm2Flag: false
    })
  })

  it('getAlarm1', async () => {
    const device = DS3231.from(bufferBus([
      0b1000_0000,
      0b1000_0000,
      0b0000_0100
    ]))
		const alarm1 = await device.getAlarm1()
    expect(alarm1).to.deep.equal({
      a1m1: 1,
      a1m2: 1,
      a1m3: 0,
      a1m4: 0,
      date: 0,
      dayOfMonth: true,
      dayOfWeek: false,
      hours: 4,
      minutes: null,
      pm: false,
      seconds: null,
      twelveHourMode: false
    })
  })

  it('getAlarm2', async () => {
    const device = DS3231.from(bufferBus([
      0b1000_0100,
      0b0000_0001
    ]))
		const alarm2 = await device.getAlarm2()
    expect(alarm2).to.deep.equal({
      a2m2: 1,
      a2m3: 0,
      a2m4: 0,
      date: 0,
      dayOfMonth: true,
      dayOfWeek: false,
      hours: 1,
      minutes: 4,
      pm: false,
      rate: 0,
      twelveHourMode: false
    })
  })

  it('getAgingOffset', async () => {
    const device = DS3231.from(bufferBus([ 0b1000_0100 ]))
		const offset = await device.getAgingOffset()
    expect(offset).to.deep.equal({

    })
  })

  it('getTemperature', async () => {
    const device = DS3231.from(bufferBus([
      0b0010_0101,
      0b1100_0000
    ]))
		const temperature = await device.getTemperature()
    expect(temperature).to.deep.equal({
      temperatureC: 37.75
    })
  })


  // ----------

  it('setTime', async () => {
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

  it('setControl', async () => {
		const bus = bufferBus([ ])
		const device = DS3231.from(bus)
		device.setControl({
      enableAlarm1: true,
      enableAlarm2: false,
      enableOscillatorOnBatteryBackup: false
    })

    const u8 = new Uint8Array(bus.buffer)
    expect(u8[0]).to.equal(0b1000_0101)
  })

  it('setStatus', async () => {
		const bus = bufferBus([ ])
		const device = DS3231.from(bus)
		device.setStatus({
      clearOscillatorStoppedFlag: true,
			enable32kHz: true,
			clearAlarm1Flag: false,
			clearAlarm2Flag: false
    })

    const u8 = new Uint8Array(bus.buffer)
    expect(u8[0]).to.equal(0b0000_1011)
  })

  it('setAlarm1', async () => {
		const bus = bufferBus([ ])
		const device = DS3231.from(bus)
		device.setAlarm1({

    })

    const u8 = new Uint8Array(bus.buffer)
    expect(u8.byteLength).to.equal(4)
    expect(u8[0]).to.equal(0b0000_0000)
    expect(u8[1]).to.equal(0b0000_0000)
    expect(u8[2]).to.equal(0b0000_0000)
    expect(u8[3]).to.equal(0b0000_0000)
  })

  it('setAlarm2', async () => {
		const bus = bufferBus([ ])
		const device = DS3231.from(bus)
		device.setAlarm2({

    })

    const u8 = new Uint8Array(bus.buffer)
    expect(u8.byteLength).to.equal(3)
    expect(u8[0]).to.equal(0b0000_0000)
    expect(u8[1]).to.equal(0b0000_0000)
    expect(u8[2]).to.equal(0b0000_0000)
  })
})

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

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
		assert.deepEqual(time, {
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
    assert.deepEqual(control, {
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
    assert.deepEqual(status, {
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
    assert.deepEqual(alarm1, {
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
      0b0000_0011,
      0b0000_0000
    ]))
		const alarm2 = await device.getAlarm2()
    assert.deepEqual(alarm2, {
      a2m2: 1,
      a2m3: 0,
      a2m4: 0,
      date: 0,
      dayOfMonth: true,
      dayOfWeek: false,
      hours: 3,
      minutes: null,
      pm: false,
      twelveHourMode: false
    })
  })

  it('getAgingOffset', async () => {
    const device = DS3231.from(bufferBus([ 0b1111_1100 ]))
		const offset = await device.getAgingOffset()
    assert.deepEqual(offset, {
      offset: -4
    })
  })

  it('getTemperature', async () => {
    const device = DS3231.from(bufferBus([
      0b0010_0101,
      0b1100_0000
    ]))
		const temperature = await device.getTemperature()
    assert.deepEqual(temperature, {
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

    assert.ok(bus.buffer instanceof ArrayBuffer)
    const u8 = new Uint8Array(bus.buffer)
    assert.equal(u8[0], 0b0011_0111)

    assert.equal(u8[6], 0b0000_0000)
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
    assert.equal(u8[0], 0b1000_0101)
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
    assert.equal(u8[0], 0b0000_1011)
  })

  it('setAlarm1 24 hour one per second', async () => {
		const bus = bufferBus([ ])
		const device = DS3231.from(bus)
		device.setAlarm1({
      seconds: null,
      minutes: null,
      hours: null,
      date: null
    }, false)

    const u8 = new Uint8Array(bus.buffer)
    assert.equal(u8.byteLength, 4)
    assert.equal(u8[0], 0b1000_0000)
    assert.equal(u8[1], 0b1000_0000)
    assert.equal(u8[2], 0b1000_0000)
    assert.equal(u8[3], 0b1000_0000)
  })

  it('setAlarm1 24 hour when second match', async () => {
		const bus = bufferBus([ ])
		const device = DS3231.from(bus)
		device.setAlarm1({
      seconds: 30,
      minutes: null,
      hours: null,
      date: null
    }, false)

    const u8 = new Uint8Array(bus.buffer)
    assert.equal(u8.byteLength, 4)
    assert.equal(u8[0], 0b0011_0000)
    assert.equal(u8[1], 0b1000_0000)
    assert.equal(u8[2], 0b1000_0000)
    assert.equal(u8[3], 0b1000_0000)
  })

  it('setAlarm1 24 hour when date, hours, minutes, and seconds match', async () => {
		const bus = bufferBus([ ])
		const device = DS3231.from(bus)
		device.setAlarm1({
      seconds: 30,
      minutes: 2,
      hours: 1,
      date: 15
    }, false)

    const u8 = new Uint8Array(bus.buffer)
    assert.equal(u8.byteLength, 4)
    assert.equal(u8[0], 0b0011_0000)
    assert.equal(u8[1], 0b0000_0010)
    assert.equal(u8[2], 0b0000_0001)
    assert.equal(u8[3], 0b0001_0101)
  })

  it('setAlarm2', async () => {
		const bus = bufferBus([ ])
		const device = DS3231.from(bus)
		device.setAlarm2({

    })

    const u8 = new Uint8Array(bus.buffer)
    assert.equal(u8.byteLength, 3)
    assert.equal(u8[0], 0b0000_0000)
    assert.equal(u8[1], 0b0000_0000)
    assert.equal(u8[2], 0b0000_0000)
  })

  it('setAgingOffset', async () => {
		const bus = bufferBus([ 42 ])
		const device = DS3231.from(bus)
		device.setAgingOffset({
      offset: 42
    })

    const i8 = new Int8Array(bus.buffer)
    assert.equal(i8.byteLength, 1)
    assert.equal(i8[0], 0b0000_0000)
  })
})

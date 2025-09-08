import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { Converter } from '@johntalton/ds3231'

describe('Converter', () => {
	describe('Temperature', () => {
		it('decodeTemperature', () => {
			const buffer = Uint8Array.from([0x00, 0x01 << 6])
			const result = Converter.decodeTemperature(buffer)
			assert.deepEqual(result, { temperatureC: .25 })
		})

		it('decodeTemperature buffer', () => {
			const buffer = Uint8Array.from([0x0A, 0x00 ])
			const result = Converter.decodeTemperature(buffer.buffer)
			assert.deepEqual(result, { temperatureC: 10 })
		})
	})

	describe('Time', () => {
		it('encodesSeconds', () => {
			const buffer = Converter.encodeSeconds(42)
			const u8 = new Uint8Array(buffer)
			assert.equal(u8[0], 0b0100_0010)
		})

		it('encodesSeconds any', () => {
			const buffer = Converter.encodeSeconds(null)
			const u8 = new Uint8Array(buffer)
			assert.equal(u8[0], 0b1000_0000)
		})

		it('encodesSeconds offset into', () => {
			const buffer = new Uint8Array(3)
			Converter.encodeSeconds(13, buffer.subarray(2, 3))
			assert.equal(buffer[2], 0b0001_0011)
		})

		it('encodesMinutes', () => {
			const buffer = Converter.encodeMinutes(37)
			const u8 = new Uint8Array(buffer)
			assert.equal(u8[0], 0b0011_0111)
		})

		it('encodesMinutes any', () => {
			const buffer = Converter.encodeMinutes(null)
			const u8 = new Uint8Array(buffer)
			assert.equal(u8[0], 0b1000_0000)
		})

		it('encodesMinutes offset into', () => {
			const buffer = new Uint8Array(3)
			Converter.encodeMinutes(13, buffer.subarray(2, 3))
			assert.equal(buffer[2], 0b0001_0011)
		})

		it('encodesHours 12 hour AM', () => {
			const buffer = Converter.encodeHours(9, true)
			const u8 = new Uint8Array(buffer)
			assert.equal(u8[0], 0b0100_1001)
		})

		it('encodesHours 12 hour PM', () => {
			const buffer = Converter.encodeHours(21, true)
			const u8 = new Uint8Array(buffer)
			assert.equal(u8[0], 0b0110_1001)
		})

		it('encodesHours 12 hour any', () => {
			const buffer = Converter.encodeHours(null, true)
			const u8 = new Uint8Array(buffer)
			assert.equal(u8[0], 0b1000_0000)
		})

		it('encodesHours 24 hour', () => {
			const buffer = Converter.encodeHours(37, false)
			const u8 = new Uint8Array(buffer)
			assert.equal(u8[0], 0b0011_0111)
		})

		it('encodesHours 24 hour any', () => {
			const buffer = Converter.encodeHours(null, false)
			const u8 = new Uint8Array(buffer)
			assert.equal(u8[0], 0b1000_0000)
		})

		it('encodesHours 24 hour offset into', () => {
			const buffer = new Uint8Array(3)
			Converter.encodeHours(13, false, buffer.subarray(2, 3))
			assert.equal(buffer[2], 0b0001_0011)
		})

		it('encodeDate', () => {
			const buffer = Converter.encodeDate(37)
			const u8 = new Uint8Array(buffer)
			assert.equal(u8[0], 0b0011_0111)
		})

		it('encodeDate any', () => {
			const buffer = Converter.encodeDate(null)
			const u8 = new Uint8Array(buffer)
			assert.equal(u8[0], 0b1000_0000)
		})

		it('encodeDate offset into', () => {
			const buffer = new Uint8Array(3)
			Converter.encodeDate(29, buffer.subarray(2, 3))
			assert.equal(buffer[2], 0b0010_1001)
		})

		it('encodeMonth', () => {
			const buffer = Converter.encodeMonth(10)
			const u8 = new Uint8Array(buffer)
			assert.equal(u8[0], 0b0001_0000)
		})

		it('encodeMonth offset into', () => {
			const buffer = new Uint8Array(3)
			Converter.encodeMonth(11, buffer.subarray(2, 3))
			assert.equal(buffer[2], 0b0001_0001)
		})

		it('encodeYear', () => {
			const buffer = Converter.encodeYear(69)
			const u8 = new Uint8Array(buffer)
			assert.equal(u8[0], 0b0110_1001)
		})

		it('encodeYear offset into', () => {
			const buffer = new Uint8Array(3)
			Converter.encodeYear(42, buffer.subarray(2, 3))
			assert.equal(buffer[2], 0b0100_0010)
		})

		it('encodeTime', () => {
			const buffer = Converter.encodeTime({
				seconds: 37,
				minutes: 13,
				hours: 22,
				day: 1,
				date: 11,
				month: 10,
				year: 91
			}, false)
			const u8 = new Uint8Array(buffer)
			assert.equal(u8.byteLength, 7)
			assert.equal(u8[0], 0b0011_0111)
			assert.equal(u8[1], 0b0001_0011)
			assert.equal(u8[2], 0b0010_0010)
			assert.equal(u8[3], 0b0000_0001)
			assert.equal(u8[4], 0b0001_0001)
			assert.equal(u8[5], 0b0001_0000)
			assert.equal(u8[6], 0b1001_0001)
		})

		it('encodeTime offset into', () => {
			const into = new Uint8Array(30)
			const buffer = Converter.encodeTime({
				seconds: 37,
				minutes: 13,
				hours: 22,
				day: 1,
				date: 11,
				month: 10,
				year: 91
			}, false, into.subarray(3, 11))

			assert.equal(buffer, into.buffer)
			assert.equal(buffer.byteLength, 30)

			const u8 = new Uint8Array(into.buffer)

			assert.equal(u8[3], 0b0011_0111)
			//
			//
			//
			//
			//
			assert.equal(u8[9], 0b1001_0001)

			// assert.equal(u8[0], 0b0000_0000)
			// assert.equal(u8[1], 0b0000_0000)
		})

		// -----

		it('decodeSeconds', () => {
			const buffer = Uint8Array.from([ 0b0010_0011 ])
			const { seconds } = Converter.decodeSeconds(buffer)
			assert.equal(seconds, 23)
		})

		it('decodeMinutes', () => {
			const buffer = Uint8Array.from([ 0b0010_0011 ])
			const { minutes } = Converter.decodeMinutes(buffer)
			assert.equal(minutes, 23)
		})

		it('decodeHours 12 hour AM', () => {
			const buffer = Uint8Array.from([ 0b0101_0001 ])
			const { twelveHourMode, hours, pm } = Converter.decodeHours(buffer)
			assert.ok(twelveHourMode)
			assert.ok(!pm)
			assert.equal(hours, 11)
		})

		it('decodeHours 12 hour PM', () => {
			const buffer = Uint8Array.from([ 0b0111_0001 ])
			const { twelveHourMode, hours, pm } = Converter.decodeHours(buffer)
			assert.ok(twelveHourMode)
			assert.ok(pm)
			assert.equal(hours, 11)
		})

		it('decodeHours 24 hour', () => {
			const buffer = Uint8Array.from([ 0b0001_0010 ])
			const { twelveHourMode, hours, pm } = Converter.decodeHours(buffer)
			assert.ok(!twelveHourMode)
			assert.ok(!pm)
			assert.equal(hours, 12)
		})

		it('decodeHours 24 hour afternoon', () => {
			const buffer = Uint8Array.from([ 0b0001_0110 ])
			const { twelveHourMode, hours, pm } = Converter.decodeHours(buffer)
			assert.ok(!twelveHourMode)
			assert.ok(pm)
			assert.equal(hours, 16)
		})

		it('decodeDay', () => {
			const buffer = Uint8Array.from([ 0b0000_0011 ])
			const { day } = Converter.decodeDay(buffer)
			assert.equal(day, 3)
		})

		it('decodeDate', () => {
			const buffer = Uint8Array.from([ 0b0010_0011 ])
			const { date } = Converter.decodeDate(buffer)
			assert.equal(date, 23)
		})

		it('decodeMonthCentury', () => {
			const buffer = Uint8Array.from([ 0b0001_0010 ])
			const { month, century } = Converter.decodeMonthCentury(buffer)
			assert.equal(month, 12)
			assert.equal(century, 0)
		})

		it('decodeMonthCentury century flag', () => {
			const buffer = Uint8Array.from([ 0b1001_0010 ])
			const { month, century } = Converter.decodeMonthCentury(buffer)
			assert.equal(month, 12)
			assert.equal(century, 1)
		})

		it('decodeYear', () => {
			const buffer = Uint8Array.from([ 0b1001_0011 ])
			const { year } = Converter.decodeYear(buffer)
			assert.equal(year, 93)
		})

		it('decodesTime', () => {
			const buffer = Uint8Array.from([
				0b0010_0011,
				0b0010_0011,
				0b0001_0010,
				0b0000_0011,
				0b0010_0011,
				0b1001_0010,
				0b1001_0011,
			])
			const {
				seconds, minutes, hours, date, month, year, century
			} = Converter.decodeTime(buffer)


			const dateMilli = Date.UTC(
				2000 + year + (century * 100),
				month - 1,
				date,
				hours, minutes, seconds)

			assert.equal(dateMilli, 7068083003000)
			assert.equal(new Date(dateMilli).toISOString(), '2193-12-23T12:23:23.000Z')
		})
	})

	describe('Alarm 1', () => {

	})

	describe('Alarm 2', () => {

	})

	describe('Control / Status', () => {
		it('decodeControl', () => {
			const buffer = Uint8Array.from([ 0b1001_1110 ])
			const {
				alarm1Enabled,
				alarm2Enabled,
				squareWaveEnabled,
				batteryBackupOscillatorEnabled,
				batteryBackupSquareWaveEnabled,

				squareWaveFrequencyKHz
			} = Converter.decodeControl(buffer)

			assert.ok(!alarm1Enabled)
			assert.ok(alarm2Enabled)
			assert.ok(!squareWaveEnabled)

			assert.equal(squareWaveFrequencyKHz, 8.192)
		})

		it('decodeControl buffer', () => {
			const buffer = Uint8Array.from([ 0b1000_1101 ])
			const {
				alarm1Enabled,
				alarm2Enabled,
				squareWaveEnabled,
				batteryBackupOscillatorEnabled,
				batteryBackupSquareWaveEnabled,

				squareWaveFrequencyKHz
			} = Converter.decodeControl(buffer.buffer)

			assert.ok(alarm1Enabled)
			assert.ok(!alarm2Enabled)
			assert.ok(!squareWaveEnabled)

			assert.equal(squareWaveFrequencyKHz, 1.024)
		})


		it('decodeStatus', () => {
			const buffer = Uint8Array.from([ 0b1000_0110 ])
			const {
				oscillatorStoppedFlag,
				output32kHzEnabled,
				busyFlag,
				alarm1Flag,
				alarm2Flag
			} = Converter.decodeStatus(buffer)

			assert.ok(oscillatorStoppedFlag)
			assert.ok(!output32kHzEnabled)
			assert.ok(busyFlag)
			assert.ok(!alarm1Flag)
			assert.ok(alarm2Flag)
		})

		it('decodeStatus buffer', () => {
			const buffer = Uint8Array.from([ 0b1000_0110 ])
			const {
				oscillatorStoppedFlag,
				output32kHzEnabled,
				busyFlag,
				alarm1Flag,
				alarm2Flag
			} = Converter.decodeStatus(buffer.buffer)

			assert.ok(oscillatorStoppedFlag)
			assert.ok(!output32kHzEnabled)
			assert.ok(busyFlag)
			assert.ok(!alarm1Flag)
			assert.ok(alarm2Flag)
		})


		it('encodeControl', () => {
			const buffer = Converter.encodeControl({
				enableAlarm2: true
			})
			assert.ok(buffer instanceof ArrayBuffer)
			assert.equal(buffer.byteLength, 1)
			const result = new Uint8Array(buffer)
			assert.equal(result[0], 0b0000_0110)
		})

		it('encodeControl other flags', () => {
			const buffer = Converter.encodeControl({
				enableAlarm1: true,
				enableOscillatorOnBatteryBackup: false
			})
			assert.ok(buffer instanceof ArrayBuffer)
			assert.equal(buffer.byteLength, 1)
			const result = new Uint8Array(buffer)
			assert.equal(result[0], 0b1000_0101)
		})

		it('encodeStatus', () => {
			const buffer = Converter.encodeStatus({
				clearOscillatorStoppedFlag: false,
				clearAlarm1Flag: true
			})
			assert.ok(buffer instanceof ArrayBuffer)
			assert.equal(buffer.byteLength, 1)
			const result = new Uint8Array(buffer)
			assert.equal(result[0], 0b1000_0001)
		})

		it('encodeStatus alt flags', () => {
			const buffer = Converter.encodeStatus({
				clearOscillatorStoppedFlag: true,
				clearAlarm1Flag: false,
				clearAlarm2Flag: true,
				enable32kHz: true
			})
			assert.ok(buffer instanceof ArrayBuffer)
			assert.equal(buffer.byteLength, 1)
			const result = new Uint8Array(buffer)
			assert.equal(result[0], 0b0000_1010)
		})
	})
})
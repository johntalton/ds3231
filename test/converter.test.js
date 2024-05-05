import { describe, it } from 'mocha'
import { expect } from 'chai'

import { Converter } from '@johntalton/ds3231'

describe('Converter', () => {
	describe('Temperature', () => {
		it('decodeTemperature', () => {
			const buffer = Uint8Array.from([0x00, 0x01 << 6])
			const result = Converter.decodeTemperature(buffer)
			expect(result).to.deep.equal({ temperatureC: .25 })
		})

		it('decodeTemperature buffer', () => {
			const buffer = Uint8Array.from([0x0A, 0x00 ])
			const result = Converter.decodeTemperature(buffer.buffer)
			expect(result).to.deep.equal({ temperatureC: 10 })
		})
	})

	describe('Time', () => {
		it('encodesSeconds', () => {
			const buffer = Converter.encodeSeconds(42)
			const u8 = new Uint8Array(buffer)
			expect(u8[0]).to.equal(0b0100_0010)
		})

		it('encodesSeconds any', () => {
			const buffer = Converter.encodeSeconds(null)
			const u8 = new Uint8Array(buffer)
			expect(u8[0]).to.equal(0b1000_0000)
		})

		it('encodesSeconds offset into', () => {
			const buffer = new Uint8Array(3)
			Converter.encodeSeconds(13, buffer.subarray(2, 3))
			expect(buffer[2]).to.equal(0b0001_0011)
		})

		it('encodesMinutes', () => {
			const buffer = Converter.encodeMinutes(37)
			const u8 = new Uint8Array(buffer)
			expect(u8[0]).to.equal(0b0011_0111)
		})

		it('encodesMinutes any', () => {
			const buffer = Converter.encodeMinutes(null)
			const u8 = new Uint8Array(buffer)
			expect(u8[0]).to.equal(0b1000_0000)
		})

		it('encodesMinutes offset into', () => {
			const buffer = new Uint8Array(3)
			Converter.encodeMinutes(13, buffer.subarray(2, 3))
			expect(buffer[2]).to.equal(0b0001_0011)
		})

		it('encodesHours 12 hour AM', () => {
			const buffer = Converter.encodeHours(9, true)
			const u8 = new Uint8Array(buffer)
			expect(u8[0]).to.equal(0b0100_1001)
		})

		it('encodesHours 12 hour PM', () => {
			const buffer = Converter.encodeHours(21, true)
			const u8 = new Uint8Array(buffer)
			expect(u8[0]).to.equal(0b0110_1001)
		})

		it('encodesHours 12 hour any', () => {
			const buffer = Converter.encodeHours(null, true)
			const u8 = new Uint8Array(buffer)
			expect(u8[0]).to.equal(0b1000_0000)
		})

		it('encodesHours 24 hour', () => {
			const buffer = Converter.encodeHours(37, false)
			const u8 = new Uint8Array(buffer)
			expect(u8[0]).to.equal(0b0011_0111)
		})

		it('encodesHours 24 hour any', () => {
			const buffer = Converter.encodeHours(null, false)
			const u8 = new Uint8Array(buffer)
			expect(u8[0]).to.equal(0b1000_0000)
		})

		it('encodesHours 24 hour offset into', () => {
			const buffer = new Uint8Array(3)
			Converter.encodeHours(13, false, buffer.subarray(2, 3))
			expect(buffer[2]).to.equal(0b0001_0011)
		})

		it('encodeDate', () => {
			const buffer = Converter.encodeDate(37)
			const u8 = new Uint8Array(buffer)
			expect(u8[0]).to.equal(0b0011_0111)
		})

		it('encodeDate any', () => {
			const buffer = Converter.encodeDate(null)
			const u8 = new Uint8Array(buffer)
			expect(u8[0]).to.equal(0b1000_0000)
		})

		it('encodeDate offset into', () => {
			const buffer = new Uint8Array(3)
			Converter.encodeDate(29, buffer.subarray(2, 3))
			expect(buffer[2]).to.equal(0b0010_1001)
		})

		it('encodeMonth', () => {
			const buffer = Converter.encodeMonth(10)
			const u8 = new Uint8Array(buffer)
			expect(u8[0]).to.equal(0b0001_0000)
		})

		it('encodeMonth offset into', () => {
			const buffer = new Uint8Array(3)
			Converter.encodeMonth(11, buffer.subarray(2, 3))
			expect(buffer[2]).to.equal(0b0001_0001)
		})

		it('encodeYear', () => {
			const buffer = Converter.encodeYear(69)
			const u8 = new Uint8Array(buffer)
			expect(u8[0]).to.equal(0b0110_1001)
		})

		it('encodeYear offset into', () => {
			const buffer = new Uint8Array(3)
			Converter.encodeYear(42, buffer.subarray(2, 3))
			expect(buffer[2]).to.equal(0b0100_0010)
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
			expect(u8.byteLength).to.equal(7)
			expect(u8[0]).to.equal(0b0011_0111)
			expect(u8[1]).to.equal(0b0001_0011)
			expect(u8[2]).to.equal(0b0010_0010)
			expect(u8[3]).to.equal(0b0000_0001)
			expect(u8[4]).to.equal(0b0001_0001)
			expect(u8[5]).to.equal(0b0001_0000)
			expect(u8[6]).to.equal(0b1001_0001)
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

			expect(buffer).to.equal(into.buffer)
			expect(buffer.byteLength).to.equal(30)

			const u8 = new Uint8Array(into.buffer)

			expect(u8[3]).to.equal(0b0011_0111)
			//
			//
			//
			//
			//
			expect(u8[9]).to.equal(0b1001_0001)

			// expect(u8[0]).to.equal(0b0000_0000)
			// expect(u8[1]).to.equal(0b0000_0000)
		})

		// -----

		it('decodeSeconds', () => {
			const buffer = Uint8Array.from([ 0b0010_0011 ])
			const { seconds } = Converter.decodeSeconds(buffer)
			expect(seconds).to.equal(23)
		})

		it('decodeMinutes', () => {
			const buffer = Uint8Array.from([ 0b0010_0011 ])
			const { minutes } = Converter.decodeMinutes(buffer)
			expect(minutes).to.equal(23)
		})

		it('decodeHours 12 hour AM', () => {
			const buffer = Uint8Array.from([ 0b0101_0001 ])
			const { twelveHourMode, hours, pm } = Converter.decodeHours(buffer)
			expect(twelveHourMode).to.be.true
			expect(pm).to.be.false
			expect(hours).to.equal(11)
		})

		it('decodeHours 12 hour PM', () => {
			const buffer = Uint8Array.from([ 0b0111_0001 ])
			const { twelveHourMode, hours, pm } = Converter.decodeHours(buffer)
			expect(twelveHourMode).to.be.true
			expect(pm).to.be.true
			expect(hours).to.equal(11)
		})

		it('decodeHours 24 hour', () => {
			const buffer = Uint8Array.from([ 0b0001_0010 ])
			const { twelveHourMode, hours, pm } = Converter.decodeHours(buffer)
			expect(twelveHourMode).to.be.false
			expect(pm).to.be.false
			expect(hours).to.equal(12)
		})

		it('decodeHours 24 hour afternoon', () => {
			const buffer = Uint8Array.from([ 0b0001_0110 ])
			const { twelveHourMode, hours, pm } = Converter.decodeHours(buffer)
			expect(twelveHourMode).to.be.false
			expect(pm).to.be.true
			expect(hours).to.equal(16)
		})

		it('decodeDay', () => {
			const buffer = Uint8Array.from([ 0b0000_0011 ])
			const { day } = Converter.decodeDay(buffer)
			expect(day).to.equal(3)
		})

		it('decodeDate', () => {
			const buffer = Uint8Array.from([ 0b0010_0011 ])
			const { date } = Converter.decodeDate(buffer)
			expect(date).to.equal(23)
		})

		it('decodeMonthCentury', () => {
			const buffer = Uint8Array.from([ 0b0001_0010 ])
			const { month, century } = Converter.decodeMonthCentury(buffer)
			expect(month).to.equal(12)
			expect(century).to.equal(0)
		})

		it('decodeMonthCentury century flag', () => {
			const buffer = Uint8Array.from([ 0b1001_0010 ])
			const { month, century } = Converter.decodeMonthCentury(buffer)
			expect(month).to.equal(12)
			expect(century).to.equal(1)
		})

		it('decodeYear', () => {
			const buffer = Uint8Array.from([ 0b1001_0011 ])
			const { year } = Converter.decodeYear(buffer)
			expect(year).to.equal(93)
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

			expect(dateMilli).to.equal(7068083003000)
			expect(new Date(dateMilli).toISOString()).to.equal('2193-12-23T12:23:23.000Z')
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

			expect(alarm1Enabled).to.be.false
			expect(alarm2Enabled).to.be.true
			expect(squareWaveEnabled).to.be.false

			expect(squareWaveFrequencyKHz).to.equal(8.192)
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

			expect(alarm1Enabled).to.be.true
			expect(alarm2Enabled).to.be.false
			expect(squareWaveEnabled).to.be.false

			expect(squareWaveFrequencyKHz).to.equal(1.024)
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

			expect(oscillatorStoppedFlag).to.be.true
			expect(output32kHzEnabled).to.be.false
			expect(busyFlag).to.be.true
			expect(alarm1Flag).to.be.false
			expect(alarm2Flag).to.be.true
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

			expect(oscillatorStoppedFlag).to.be.true
			expect(output32kHzEnabled).to.be.false
			expect(busyFlag).to.be.true
			expect(alarm1Flag).to.be.false
			expect(alarm2Flag).to.be.true
		})


		it('encodeControl', () => {
			const buffer = Converter.encodeControl({
				enableAlarm2: true
			})
			expect(buffer).to.be.instanceOf(ArrayBuffer)
			expect(buffer.byteLength).to.equal(1)
			const result = new Uint8Array(buffer)
			expect(result[0]).to.equal(0b0000_0110)
		})

		it('encodeControl other flags', () => {
			const buffer = Converter.encodeControl({
				enableAlarm1: true,
				enableOscillatorOnBatteryBackup: false
			})
			expect(buffer).to.be.instanceOf(ArrayBuffer)
			expect(buffer.byteLength).to.equal(1)
			const result = new Uint8Array(buffer)
			expect(result[0]).to.equal(0b1000_0101)
		})

		it('encodeStatus', () => {
			const buffer = Converter.encodeStatus({
				clearOscillatorStoppedFlag: false,
				clearAlarm1Flag: true
			})
			expect(buffer).to.be.instanceOf(ArrayBuffer)
			expect(buffer.byteLength).to.equal(1)
			const result = new Uint8Array(buffer)
			expect(result[0]).to.equal(0b1000_0001)
		})

		it('encodeStatus alt flags', () => {
			const buffer = Converter.encodeStatus({
				clearOscillatorStoppedFlag: true,
				clearAlarm1Flag: false,
				clearAlarm2Flag: true,
				enable32kHz: true
			})
			expect(buffer).to.be.instanceOf(ArrayBuffer)
			expect(buffer.byteLength).to.equal(1)
			const result = new Uint8Array(buffer)
			expect(result[0]).to.equal(0b0000_1010)
		})
	})
})
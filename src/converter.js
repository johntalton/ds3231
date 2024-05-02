import { BitSmush } from '@johntalton/bitsmush'

import {
	REGISTER_BLOCKS,
	TEMPERATURE_DEGREE_PER_LSB,
	FREQUENCIES_KHZ,
	BIT_SET, BIT_UNSET,
	LENGTH_ONE_BYTE
} from './defs.js'

export const TEN = 10
export const TWELVE = 12
export const TWENTY = 20

export class Converter {
	static decodeTemperature(buffer) {
		const dv = ArrayBuffer.isView(buffer) ?
			new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new DataView(buffer)

		const msb = dv.getInt8(0)
		const lsb = dv.getUint8(1)

		const temperatureC = msb + ((lsb >> 6) * TEMPERATURE_DEGREE_PER_LSB)

		return { temperatureC }
	}

	static decodeSeconds(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const tens = BitSmush.extractBits(u8[0], 6, 3)
		const ones = BitSmush.extractBits(u8[0], 3, 4)

		return { seconds: (tens * TEN) + ones }
	}

	static decodeMinutes(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const tens = BitSmush.extractBits(u8[0], 6, 3)
		const ones = BitSmush.extractBits(u8[0], 3, 4)

		return { minutes: (tens * TEN) + ones }
	}

	static decodeHours(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const twelveTwentyFour = BitSmush.extractBits(u8[0], 6, 1)
		const twelveHourMode = twelveTwentyFour === BIT_SET
		const amPmTwenty = BitSmush.extractBits(u8[0], 5, 1)
		const pmTwenty = amPmTwenty === BIT_SET

		const twenty = (!twelveHourMode && pmTwenty) ? TWENTY : 0
		const tens = BitSmush.extractBits(u8[0], 4, 1)
		const ones = BitSmush.extractBits(u8[0], 3, 4)

		return {
			twelveHourMode,
			hours: twenty + (tens * TEN) + ones,
			pm: pmTwenty
		}
	}

	static decodeDay(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const day = BitSmush.extractBits(u8[0], 2, 3)

		return {
			day
		}
	}

	static decodeDate(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const tens = BitSmush.extractBits(u8[0], 5, 2)
		const ones = BitSmush.extractBits(u8[0], 3, 4)

		return {
			date: (tens * TEN) + ones
		}
	}

	static decodeMonthCentury(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const century = BitSmush.extractBits(u8[0], 7, 1)
		const tens = BitSmush.extractBits(u8[0], 4, 1)
		const ones = BitSmush.extractBits(u8[0], 3, 4)

		return {
			month: (tens * TEN) + ones,
			century
		}
	}

	static decodeYear(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const tens = BitSmush.extractBits(u8[0], 7, 4)
		const ones = BitSmush.extractBits(u8[0], 3, 4)

		return {
			year: (tens * TEN) + ones
		}
	}

	static decodeTime(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const seconds = Converter.decodeSeconds(u8.subarray(0, 1))
		const minutes = Converter.decodeMinutes(u8.subarray(1, 2))
		const hours = Converter.decodeHours(u8.subarray(2, 3))
		const day = Converter.decodeDay(u8.subarray(3, 4))
		const date = Converter.decodeDate(u8.subarray(4, 5))
		const monthCentury = Converter.decodeMonthCentury(u8.subarray(5, 6))
		const year = Converter.decodeYear(u8.subarray(6, 7))

		return {
			...seconds,
			...minutes,
			...hours,
			...day,
			...date,
			...monthCentury,
			...year
		}
	}

	static decodeAlarm1Seconds(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const a1m1 = BitSmush.extractBits(u8[0], 7, 1)

		const seconds = Converter.decodeSeconds(buffer)

		return {
			a1m1,
			...seconds
		}
	}

	static decodeAlarm1Minutes(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const a1m2 = BitSmush.extractBits(u8[0], 7, 1)

		const minutes = Converter.decodeMinutes(buffer)

		return {
			a1m2,
			...minutes
		}
	}

	static decodeAlarm1Hours(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const a1m3 = BitSmush.extractBits(u8[0], 7, 1)

		const hours = Converter.decodeHours(buffer)

		return {
			a1m3,
			...hours
		}
	}

	static decodeDayDate(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const dydt = BitSmush.extractBits(u8[0], 6, 1)
		const dayOfWeek = dydt === BIT_SET
		const dayOfMonth = dydt === BIT_UNSET

		const value = dayOfWeek ?
			Converter.decodeDay(buffer) :
			Converter.decodeDate(buffer)

		return {
			dayOfWeek,
			dayOfMonth,
			...value
		}
	}

	static decodeAlarm1DayDate(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const a1m4 = BitSmush.extractBits(u8[0], 7, 1)

		const dayDate = Converter.decodeDayDate(buffer)

		return {
			a1m4,
			...dayDate
		}
	}

	static decodeAlarm1(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const seconds = Converter.decodeAlarm1Seconds(u8.subarray(0, 1))
		const minutes = Converter.decodeAlarm1Minutes(u8.subarray(1, 2))
		const hours = Converter.decodeAlarm1Hours(u8.subarray(2, 3))
		const dayDate = Converter.decodeAlarm1DayDate(u8.subarray(3, 4))

		const { a1m1 } = seconds
		const { a1m2 } = minutes
		const { a1m3 } = hours
		const { a1m4 } = dayDate

		const rate = 0

		return {
			rate,
			...seconds,
			...minutes,
			...hours,
			...dayDate,
		}
	}

	static decodeAlarm2Minutes(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const a2m2 = BitSmush.extractBits(u8[0], 7, 1)

		const minutes = Converter.decodeMinutes(buffer)

		return {
			a2m2,
			...minutes
		}
	}

	static decodeAlarm2Hours(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const a2m3 = BitSmush.extractBits(u8[0], 7, 1)

		const hours = Converter.decodeHours(buffer)

		return {
			a2m3,
			...hours
		}
	}

	static decodeAlarm2DayDate(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const a2m4 = BitSmush.extractBits(u8[0], 7, 1)

		const dayDate = Converter.decodeDayDate(buffer)

		return {
			a2m4,
			...dayDate
		}
	}

	static decodeAlarm2(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const rate = 0

		const minutes = Converter.decodeAlarm2Minutes(u8.subarray(0, 1))
		const hours = Converter.decodeAlarm2Hours(u8.subarray(1, 2))
		const dayDate = Converter.decodeAlarm2DayDate(u8.subarray(2, 3))


		return {
			rate,
			...minutes,
			...hours,
			...dayDate,
		}
	}

	static decodeControl(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const eosc = BitSmush.extractBits(u8[0], 7, 1)
		const bbsqw = BitSmush.extractBits(u8[0], 6, 1)
		const conv = BitSmush.extractBits(u8[0], 5, 1)
		const rs2 = BitSmush.extractBits(u8[0], 4, 1)
		const rs1 = BitSmush.extractBits(u8[0], 3, 1)
		const intcn = BitSmush.extractBits(u8[0], 2, 1)
		const a2ie = BitSmush.extractBits(u8[0], 1, 1)
		const a1ie = BitSmush.extractBits(u8[0], 0, 1)

		return {
			alarm1Enabled: a1ie === BIT_SET,
			alarm2Enabled: a2ie === BIT_SET,
			convertTemperatureEnabled: conv === BIT_SET,
			squareWaveEnabled: intcn === BIT_UNSET,
			batteryBackupOscillatorEnabled: eosc === BIT_UNSET,
			batteryBackupSquareWaveEnabled: bbsqw === BIT_SET,
			squareWaveFrequencyKHz: FREQUENCIES_KHZ[rs2][rs1]
		}
	}

	static decodeStatus(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const osf = BitSmush.extractBits(u8[0], 7, 1)
		const en32kHz = BitSmush.extractBits(u8[0], 3, 1)
		const busy = BitSmush.extractBits(u8[0], 2, 1)
		const a2f = BitSmush.extractBits(u8[0], 1, 1)
		const a1f = BitSmush.extractBits(u8[0], 0, 1)

		return {
			oscillatorStoppedFlag: osf === BIT_SET,
			output32kHzEnabled: en32kHz === BIT_SET,
			busyFlag: busy === BIT_SET,
			alarm1Flag: a1f === BIT_SET,
			alarm2Flag: a2f === BIT_SET
		}
	}

	// ---------------------------------------------------------------------------

	static encodeControl(control) {
		const {
			enableAlarm1 = false,
			enableAlarm2 = false,
			enableOscillatorOnBatteryBackup = true
		} = control

		const a1ie = enableAlarm1 ? BIT_SET : BIT_UNSET
		const a2ie = enableAlarm2 ? BIT_SET : BIT_UNSET
		const intcn = BIT_SET
		const eosc = !enableOscillatorOnBatteryBackup ? BIT_SET : BIT_UNSET

		const controlByte = BitSmush.smushBits(
			[[7, 1], [2, 1], [1, 1], [0, 1]],
			[ eosc, intcn, a2ie, a1ie ])

		return Uint8Array.from([ controlByte ]).buffer
	}

	static encodeStatus(status) {
		const {
			clearOscillatorStoppedFlag = false,
			enable32kHz = false,
			clearAlarm1Flag = false,
			clearAlarm2Flag = false
		} = status

		const osf = !clearOscillatorStoppedFlag ? BIT_SET : BIT_UNSET
		const en32kHz = enable32kHz ? BIT_SET : BIT_UNSET
		const a1 = !clearAlarm1Flag ? BIT_SET : BIT_UNSET
		const a2 = !clearAlarm2Flag ? BIT_SET : BIT_UNSET

		const statusByte = BitSmush.smushBits(
			[[7, 1], [3, 1], [1, 1], [0, 1]],
			[osf, en32kHz, a1, a2]
		)

		return Uint8Array.from([ statusByte ]).buffer
	}

	static encodeSeconds(seconds, into) {
		const buffer = (into !== undefined) ?
			new Uint8Array(into.buffer, into.byteOffset, LENGTH_ONE_BYTE) :
			new Uint8Array(LENGTH_ONE_BYTE)

		const tens = Math.floor(seconds / TEN)
		const ones = seconds % TEN

		buffer[0] = BitSmush.smushBits([[6, 3], [3, 4]], [tens, ones])

		return buffer.buffer
	}

	static encodeMinutes(minutes, into) {
		const buffer = (into !== undefined) ?
			new Uint8Array(into.buffer, into.byteOffset, LENGTH_ONE_BYTE) :
			new Uint8Array(LENGTH_ONE_BYTE)

		const tens = Math.floor(minutes / TEN)
		const ones = minutes % TEN

		buffer[0] = BitSmush.smushBits([[6, 3], [3, 4]], [tens, ones])

		return buffer.buffer
	}

	static encodeHours(hours, twelveHourMode, into) {
		function _encodeHoursAmPm(hours) {
			const pmTwenty = (hours >= TWELVE)
			const twelveTwentyFour = BIT_SET
			const amPmTwenty = pmTwenty ? BIT_SET : BIT_UNSET

			const remainingHours = pmTwenty ? hours - TWELVE : hours

			const tens = Math.floor(remainingHours / TEN)
			const ones = remainingHours % TEN

			return [twelveTwentyFour, amPmTwenty, tens, ones]
		}

		function _encodeHours24(hours) {
			const pmTwenty = (hours >= TWENTY)
			const twelveTwentyFour = BIT_UNSET
			const amPmTwenty = pmTwenty ? BIT_SET : BIT_UNSET

			const remainingHours = pmTwenty ? hours - TWENTY : hours

			const tens = Math.floor(remainingHours / TEN)
			const ones = remainingHours % TEN

			return [twelveTwentyFour, amPmTwenty, tens, ones]
		}

		const buffer = (into !== undefined) ?
			new Uint8Array(into.buffer, into.byteOffset, LENGTH_ONE_BYTE) :
			new Uint8Array(LENGTH_ONE_BYTE)

		const result = twelveHourMode ?
			_encodeHoursAmPm(hours) :
			_encodeHours24(hours)

		buffer[0] = BitSmush.smushBits(
			[[6, 1], [5, 1], [4, 1], [3, 4]],
			result)

		return buffer.buffer
	}

	static encodeDay(day, into) {
		const buffer = (into !== undefined) ?
			new Uint8Array(into.buffer, into.byteOffset, LENGTH_ONE_BYTE) :
			new Uint8Array(LENGTH_ONE_BYTE)

		// todo

		return buffer.buffer
	}

	static encodeDate(date, into) {
		const buffer = (into !== undefined) ?
			new Uint8Array(into.buffer, into.byteOffset, LENGTH_ONE_BYTE) :
			new Uint8Array(LENGTH_ONE_BYTE)

		const tens = Math.floor(date / TEN)
		const ones = date % TEN

		buffer[0] = BitSmush.smushBits([[5, 2], [3, 4]], [tens, ones])

		return buffer.buffer
	}

	static encodeMonth(month, into) {
		const buffer = (into !== undefined) ?
			new Uint8Array(into.buffer, into.byteOffset, LENGTH_ONE_BYTE) :
			new Uint8Array(LENGTH_ONE_BYTE)

		const tens = Math.floor(month / TEN)
		const ones = month % TEN

		buffer[0] = BitSmush.smushBits([[4, 1], [3, 4]], [tens, ones])

		return buffer.buffer
	}

	static encodeYear(year, into) {
		const buffer = (into !== undefined) ?
			new Uint8Array(into.buffer, into.byteOffset, LENGTH_ONE_BYTE) :
			new Uint8Array(LENGTH_ONE_BYTE)

		const tens = Math.floor(year / TEN)
		const ones = year % TEN

		buffer[0] = BitSmush.smushBits([[7, 4], [3, 4]], [tens, ones])

		return buffer.buffer
	}

	static encodeTime(time, twelveHourMode, into) {
		const { seconds, minutes, hours, day, date, month, year } = time

		const mode12 = twelveHourMode ?? false

		const buffer = (into !== undefined) ?
			new Uint8Array(into.buffer, into.byteOffset, REGISTER_BLOCKS.TIME.LENGTH) :
			new Uint8Array(REGISTER_BLOCKS.TIME.LENGTH)

		Converter.encodeSeconds(seconds, buffer.subarray(0, 1))
		Converter.encodeMinutes(minutes, buffer.subarray(1, 2))
		Converter.encodeHours(hours, mode12, buffer.subarray(2, 3))
		Converter.encodeDay(day, buffer.subarray(3, 4))
		Converter.encodeDate(date, buffer.subarray(4, 5))
		Converter.encodeMonth(month, buffer.subarray(5, 6))
		Converter.encodeYear(year, buffer.subarray(6, 7))

		return buffer.buffer
	}
}

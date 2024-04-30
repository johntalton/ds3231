import { BitSmush } from "@johntalton/bitsmush"

export class Converter {
	/** @param {DataView|ArrayBufferLike} buffer  */
	static decodeTemperature(buffer) {
		const dv = ArrayBuffer.isView(buffer) ?
			new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new DataView(buffer)

		const msb = dv.getInt8(0)
		const lsb = dv.getUint8(1)

		const temperatureC = msb + ((lsb >> 6) * 0.25)

		return { temperatureC }
	}

	static decodeSeconds(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const tens = BitSmush.extractBits(u8[0], 6, 3)
		const ones = BitSmush.extractBits(u8[0], 3, 4)

		return { seconds: tens * 10 + ones }
	}

	static decodeMinutes(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const tens = BitSmush.extractBits(u8[0], 6, 3)
		const ones = BitSmush.extractBits(u8[0], 3, 4)

		return { minutes: tens * 10 + ones }
	}

	/** @param {DataView|ArrayBufferLike} buffer  */
	static decodeHours(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const twelveTwentyFour = BitSmush.extractBits(u8[0], 6, 1)
		const twelveHourMode = twelveTwentyFour === 1
		const amPmTwenty = BitSmush.extractBits(u8[0], 5, 1)
		const pmTwenty = amPmTwenty === 1

		const twenty = (!twelveHourMode && pmTwenty) ? 20 : 0
		const tens = BitSmush.extractBits(u8[0], 4, 1)
		const ones = BitSmush.extractBits(u8[0], 3, 4)

		return {
			twelveHourMode,
			hours: twenty + (tens * 10) + ones,
			pm: pmTwenty
		}
	}

	/** @param {DataView|ArrayBufferLike} buffer  */
	static decodeDay(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const day = BitSmush.extractBits(u8[0], 2, 3)

		return {
			day
		}
	}

	/** @param {DataView|ArrayBufferLike} buffer  */
	static decodeDate(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const tens = BitSmush.extractBits(u8[0], 5, 2)
		const ones = BitSmush.extractBits(u8[0], 3, 4)

		return {
			date: (tens * 10) + ones
		}
	}

	/** @param {DataView|ArrayBufferLike} buffer  */
	static decodeMonthCentury(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const century = BitSmush.extractBits(u8[0], 7, 1)
		const tens = BitSmush.extractBits(u8[0], 4, 1)
		const ones = BitSmush.extractBits(u8[0], 3, 4)

		return {
			month: (tens * 10) + ones,
			century
		}
	}
	/** @param {DataView|ArrayBufferLike} buffer  */
	static decodeYear(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const tens = BitSmush.extractBits(u8[0], 7, 4)
		const ones = BitSmush.extractBits(u8[0], 3, 4)

		return {
			year: (tens * 10) + ones
		}
	}

	/** @param {DataView|ArrayBufferLike} buffer  */
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

	/** @param {DataView|ArrayBufferLike} buffer  */
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

		const FREQUENCIES_KHZ = [
			[1, 1.024],
			[4.096, 8.192]
		]

		return {
			alarm1Enabled: a1ie === 1,
			alarm2Enabled: a2ie === 1,
			convertTemperatureEnabled: conv === 1,
			squareWaveEnabled: intcn === 0,
			batteryBackupOscillatorEnabled: eosc === 0,
			batteryBackupSquareWaveEnabled: bbsqw === 1,
			squareWaveFrequencyKHz: FREQUENCIES_KHZ[rs2][rs1]
		}
	}

	/** @param {DataView|ArrayBufferLike} buffer  */
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
			oscillatorStoppedFlag: osf === 1,
			output32kHzEnabled: en32kHz === 1,
			busyFlag: busy === 1,
			alarm1Flag: a1f === 1,
			alarm2Flag: a2f === 1
		}
	}

	// ---------------------------------------------------------------------------

	static encodeControl(control) {
		const { enableAlarm1, enabledAlarm2 } = {
			enableAlarm1: false,
			enableAlarm2: false,

			enableSquareWave: false,
			squareWaveFrequencyKHz: 8.192,

			enableOscillatorOnBattery: false,
			enableSquareWaveOnBattery: false,

			triggerTemperatureConversion: false,

			...control
		}
		const controlByte = 0
		return Uint8Array.from([controlByte]).buffer
	}

	/** @param {StatusProfile} status  */
	static encodeStatus(status) {
		const { clearOscillatorStoppedFlag, enable32kHz, clearAlarm1Flag, clearAlarm2Flag } = {
			clearOscillatorStoppedFlag: false,
			enable32kHz: false,
			clearAlarm1Flag: false,
			clearAlarm2Flag: false,

			...status
		}
		const osf = !clearOscillatorStoppedFlag ? 1 : 0
		const en32kHz = enable32kHz ? 1 : 0
		const a1 = !clearAlarm1Flag ? 1 : 0
		const a2 = !clearAlarm2Flag ? 1 : 0

		const statusByte = (osf << 7) | (en32kHz << 3) | (a1 << 1) | (a2)

		return Uint8Array.from([statusByte]).buffer
	}

	/** @param {Number} seconds */
	/** @param {ArrayBufferView|DataView} into */
	/** @returns {ArrayBufferLike} */
	static encodeSeconds(seconds, into) {
		const buffer = (into !== undefined) ?
			new Uint8Array(into.buffer, into.byteOffset, 1) :
			new Uint8Array(1)

		const tens = Math.floor(seconds / 10)
		const ones = seconds % 10

		buffer[0] = BitSmush.smushBits([[6, 3], [3, 4]], [tens, ones])

		return buffer.buffer
	}

	/** @param {ArrayBufferView|DataView} into */
	/** @returns {ArrayBufferLike} */
	static encodeMinutes(minutes, into) {
		const buffer = (into !== undefined) ?
			new Uint8Array(into.buffer, into.byteOffset, 1) :
			new Uint8Array(1)

		const tens = Math.floor(minutes / 10)
		const ones = minutes % 10

		buffer[0] = BitSmush.smushBits([[6, 3], [3, 4]], [tens, ones])

		return buffer.buffer
	}

	/** @param {ArrayBufferView|DataView} into */
	/** @returns {ArrayBufferLike} */
	static encodeHours(hours, twelveHourMode, into) {
		function _encodeHoursAMPM(hours) {
			const pmTwenty = (hours >= 12)
			const twelveTwentyFour = 1
			const amPmTwenty = pmTwenty ? 1 : 0

			const remainingHours = pmTwenty ? hours - 12 : hours

			const tens = Math.floor(remainingHours / 10)
			const ones = remainingHours % 10

			return [twelveTwentyFour, amPmTwenty, tens, ones]
		}

		function _encodeHours24(hours) {
			const pmTwenty = (hours >= 20)
			const twelveTwentyFour = 0
			const amPmTwenty = pmTwenty ? 1 : 0

			const remainingHours = pmTwenty ? hours - 20 : hours

			const tens = Math.floor(remainingHours / 10)
			const ones = remainingHours % 10

			return [twelveTwentyFour, amPmTwenty, tens, ones]
		}

		const buffer = (into !== undefined) ?
			new Uint8Array(into.buffer, into.byteOffset, 1) :
			new Uint8Array(1)

		const result = twelveHourMode ?
			_encodeHoursAMPM(hours) :
			_encodeHours24(hours)

		buffer[0] = BitSmush.smushBits(
			[[6, 1], [5, 1], [4, 1], [3, 4]],
			result)

		return buffer.buffer
	}

	static encodeDay(day, into) {

	}

	/** @param {ArrayBufferView|DataView} into */
	/** @returns {ArrayBufferLike} */
	static encodeDate(date, into) {
		const buffer = (into !== undefined) ?
			new Uint8Array(into.buffer, into.byteOffset, 1) :
			new Uint8Array(1)

		const tens = Math.floor(date / 10)
		const ones = date % 10

		buffer[0] = BitSmush.smushBits([[5, 2], [3, 4]], [tens, ones])

		return buffer.buffer

	}

	/** @param {ArrayBufferView|DataView} into */
	/** @returns {ArrayBufferLike} */
	static encodeMonth(month, into) {
		const buffer = (into !== undefined) ?
			new Uint8Array(into.buffer, into.byteOffset, 1) :
			new Uint8Array(1)

		const tens = Math.floor(month / 10)
		const ones = month % 10

		console.log(month, tens, ones)

		buffer[0] = BitSmush.smushBits([[4, 1], [3, 4]], [tens, ones])

		return buffer.buffer
	}

	/** @param {ArrayBufferView|DataView} into */
	/** @returns {ArrayBufferLike} */
	static encodeYear(year, into) {
		const buffer = (into !== undefined) ?
		new Uint8Array(into.buffer, into.byteOffset, 1) :
		new Uint8Array(1)

		const tens = Math.floor(year / 10)
		const ones = year % 10

		buffer[0] = BitSmush.smushBits([[7, 4], [3, 4]], [tens, ones])

		return buffer.buffer
	}

	/** @param {ArrayBufferView|DataView} into */
	/** @returns {ArrayBufferLike} */
	static encodeTime(time, into) {
		const { seconds, minutes, hours, day, date, month, year } = time

		const twelveHourMode = false

		const buffer = (into !== undefined) ?
			new Uint8Array(into.buffer, into.byteOffset, 7) :
			new Uint8Array(7)

		Converter.encodeSeconds(seconds, buffer.subarray(0, 1))
		Converter.encodeMinutes(minutes, buffer.subarray(1, 2))
		Converter.encodeHours(hours, twelveHourMode, buffer.subarray(2, 3))
		Converter.encodeDay(day, buffer.subarray(3, 4))
		Converter.encodeDate(date, buffer.subarray(4, 5))
		Converter.encodeMonth(month, buffer.subarray(5, 6))
		Converter.encodeYear(year, buffer.subarray(6, 7))

		return buffer.buffer
	}
}

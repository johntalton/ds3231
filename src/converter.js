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

		return {

		}
	}

	/** @param {DataView|ArrayBufferLike} buffer  */
	static decodeMonthCentury(buffer) {

		return {

		}
	}
	/** @param {DataView|ArrayBufferLike} buffer  */
	static decodeYear(buffer) {

		return {

		}
	}



	/** @param {DataView|ArrayBufferLike} buffer  */
	static decodeTime(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
			new Uint8Array(buffer)

		const seconds = Converter.decodeSeconds(u8.subarray(0, 0))
		const minutes = Converter.decodeMinutes(u8.subarray(1, 1))
		const hours = Converter.decodeHours(u8.subarray(2, 2))
		const day = Converter.decodeDay(u8.subarray(3, 3))
		const date = Converter.decodeDate(u8.subarray(4, 4))
		const monthCentury = Converter.decodeMonthCentury(u8.subarray(5, 5))
		const year = Converter.decodeYear(u8.subarray(6, 6))

		return {
			seconds, minutes, hours, day, date, monthCentury, year
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
			oscillatorEnabled: eosc === 0,
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
			oscillatorEnabled: osf === 0,
			output32kHzEnabled: en32kHz === 1,
			busy: busy === 1,
			alarm1: a1f === 1,
			alarm2: a2f === 1
		}
	}

	/** @param {StatusProfile} status  */
	static encodeStatus(status) {
		const { oscillatorEnabled, output32kHzEnabled } = status
		const osf = !oscillatorEnabled ? 1 : 0
		const en32kHz = output32kHzEnabled ? 1 : 0

		const statusByte = (osf << 7) | (en32kHz << 3)

		return Uint8Array.from([ statusByte ])
	}
}
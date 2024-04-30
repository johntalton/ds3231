import { Common } from './common.js'

export const DEFAULT_ADDRESS = 0x68

export class DS3231 {
	#aBus

	/** @param {I2CAddressedBus} aBus */
	static from(aBus) {
		return new DS3231(aBus)
	}

	/** @param {I2CAddressedBus} aBus */
	constructor(aBus) {
		this.#aBus = aBus
	}

	/** @param {TimeProfile} time */
	async setTime(time) { return Common.setTime(this.#aBus, time) }
	async getTime() { return Common.getTime(this.#aBus) }

	/** @param {Alarm1Profile} alarm */
	async setAlarm1(alarm) { return Common.setAlarm1(this.#aBus, alarm) }
	async getAlarm1() { return Common.getAlarm1(this.#aBus) }

		/** @param {Alarm2Profile} alarm */
	async setAlarm2(alarm) { return Common.setAlarm2(this.#aBus, alarm) }
	async getAlarm2() { return Common.getAlarm2(this.#aBus) }

	/** @param {ControlProfile} control */
	async setControl(control) { return Common.setControl(this.#aBus, control) }
	async getControl() { return Common.getControl(this.#aBus) }

	/** @param {StatusProfile} status */
	async setStatus(status) { return Common.setStatus(this.#aBus, status) }
	async getStatus() { return Common.getStatus(this.#aBus) }

	/** @param {Offset} offset */
	async setAgingOffset(offset) { return Common.setAgingOffset(this.#aBus, offset)}
	async getAgingOffset() { return Common.getAgingOffset(this.#aBus)}

	async getTemperature() { return Common.getTemperature(this.#aBus) }
}

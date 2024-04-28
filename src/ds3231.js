import { CommonBuilder } from './builder.js'
import { DEFINITION } from './definition.js'
import { Common } from './common.js'

export const DEFAULT_ADDRESS = 0x68

export class DS3231 {
	#aBus
	#common = CommonBuilder.from(DEFINITION)

	/** @param {I2CAddressedBus} aBus  */
	static from(aBus) {
		return new DS3231(aBus)
	}

	/** @param {I2CAddressedBus} aBus  */
	constructor(aBus) {
		this.#aBus = aBus
	}


	async setTime(time) { return this.#common.setTime(this.#aBus, time) }
	async getTime() { return Common.getTime(this.#aBus) }

	async setAlarm1() {}
	async getAlarm1() {}

	async setAlarm2() {}
	async getAlarm2() {}

	/** @param {ControlProfile} control  */
	async setControl(control) { return this.#common.setControl(this.#aBus, control) }
	async getControl() { return Common.getControl(this.#aBus) }

	/** @param {StatusProfile} status  */
	async setStatus(status) { return Common.setStatus(this.#aBus, status) }
	async getStatus() { return Common.getStatus(this.#aBus) }

	async setAgingOffset() {}
	async getAgingOffset() {}

	async getTemperature() { return Common.getTemperature(this.#aBus) }
}

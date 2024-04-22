import { CommonBuilder } from './builder.js'
import { DEFINITION } from './definition.js'

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
	async getTime() { return this.#common.getTime(this.#aBus) }

	async setAlarm1() {}
	async getAlarm1() {}

	async setAlarm2() {}
	async getAlarm2() {}

	async getControl() {}
	async setControl() {}

	async getStatus() {}
	async setStatus() {}

	async getAgingOffset() {}
	async setAgingOffset() {}

	async getTemperature() {}
}
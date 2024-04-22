export const DEFAULT_ADDRESS = 0x68

export class DS3231 {
	#aBus

	/** @param {I2CAddressedBus} aBus  */
	static from(aBus) {
		return new DS3231(aBus)
	}

	/** @param {I2CAddressedBus} aBus  */
	constructor(aBus) {
		this.#aBus = aBus
	}
}
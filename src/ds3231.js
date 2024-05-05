import { Common } from './common.js'

export class DS3231 {
	#aBus

	static from(aBus) { return new DS3231(aBus) }

	constructor(aBus) { this.#aBus = aBus }

	async setTime(time, twelveHourMode = false) { return Common.setTime(this.#aBus, time, twelveHourMode) }
	async getTime() { return Common.getTime(this.#aBus) }

	async setAlarm1(alarm, twelveHourMode = false) { return Common.setAlarm1(this.#aBus, alarm, twelveHourMode) }
	async getAlarm1() { return Common.getAlarm1(this.#aBus) }

	async setAlarm2(alarm, twelveHourMode = false) { return Common.setAlarm2(this.#aBus, alarm, twelveHourMode) }
	async getAlarm2() { return Common.getAlarm2(this.#aBus) }

	async setControl(control) { return Common.setControl(this.#aBus, control) }
	async getControl() { return Common.getControl(this.#aBus) }

	async setStatus(status) { return Common.setStatus(this.#aBus, status) }
	async getStatus() { return Common.getStatus(this.#aBus) }

	async setAgingOffset(offset) { return Common.setAgingOffset(this.#aBus, offset)}
	async getAgingOffset() { return Common.getAgingOffset(this.#aBus)}

	async getTemperature() { return Common.getTemperature(this.#aBus) }
}

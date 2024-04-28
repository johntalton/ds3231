import { Converter } from './converter.js'

export class Common {
  /** @param {I2CAddressedBus} aBus */
  static async getTemperature(aBus) {
    const buffer = await aBus.readI2cBlock(0x11, 2)
    return Converter.decodeTemperature(buffer)
  }

  /** @param {I2CAddressedBus} aBus */
  static async getTime(aBus) {
    const buffer = await aBus.readI2cBlock(0x00, 7)
    return Converter.decodeTime(buffer)
  }

  /** @param {I2CAddressedBus} aBus */
  static async getControl(aBus) {
    const buffer = await aBus.readI2cBlock(0x0E, 1)
    return Converter.decodeControl(buffer)
  }

  /** @param {I2CAddressedBus} aBus */
  static async getStatus(aBus) {
    const buffer = await aBus.readI2cBlock(0x0F, 1)
    return Converter.decodeStatus(buffer)
  }

  /** @param {I2CAddressedBus} aBus */
  /** @param {StatusProfile} status  */
  static async setStatus(aBus, status) {
    const buffer = Converter.encodeStatus(status)
    return aBus.writeI2cBlock(0x0F, buffer)
  }

}
import { REGISTERS, REGISTER_BLOCKS, LENGTH_ONE_BYTE } from './defs.js'
import { Converter } from './converter.js'

export class Common {
  static async getTime(aBus) {
    const buffer = await aBus.readI2cBlock(
      REGISTER_BLOCKS.TIME.START,
      REGISTER_BLOCKS.TIME.LENGTH
    )
    return Converter.decodeTime(buffer)
  }

  static async setTime(aBus, time, twelveHourMode = false) {
    const buffer = Converter.encodeTime(time, twelveHourMode)
    return aBus.writeI2cBlock(REGISTER_BLOCKS.TIME.START, buffer)
  }

  static async getAlarm1(aBus) {
    const buffer = await aBus.readI2cBlock(
      REGISTER_BLOCKS.ALARM_1.START,
      REGISTER_BLOCKS.ALARM_1.LENGTH
    )
    return Converter.decodeAlarm1(buffer)
  }

  static async setAlarm1(aBus, alarm) {
    const buffer = Converter.encodeAlarm1(alarm)
    return aBus.writeI2cBlock(REGISTER_BLOCKS.ALARM_1.START, buffer)
  }

  static async getAlarm2(aBus) {
    const buffer = await aBus.readI2cBlock(
      REGISTER_BLOCKS.ALARM_2.START,
      REGISTER_BLOCKS.ALARM_2.LENGTH
    )
    return Converter.decodeAlarm2(buffer)
  }

  static async setAlarm2(aBus, alarm) {
    const buffer = Converter.encodeAlarm2(alarm)
    return aBus.writeI2cBlock(REGISTER_BLOCKS.ALARM_2.START, buffer)
  }

  static async getControl(aBus) {
    const buffer = await aBus.readI2cBlock(REGISTERS.CONTROL, LENGTH_ONE_BYTE)
    return Converter.decodeControl(buffer)
  }

  static async setControl(aBus, control) {
    const buffer = Converter.encodeControl(control)
    return aBus.writeI2cBlock(REGISTERS.CONTROL, buffer)
  }

  static async getStatus(aBus) {
    const buffer = await aBus.readI2cBlock(REGISTERS.CONTROL_STATUS, LENGTH_ONE_BYTE)
    return Converter.decodeStatus(buffer)
  }

  static async setStatus(aBus, status) {
    const buffer = Converter.encodeStatus(status)
    return aBus.writeI2cBlock(REGISTERS.CONTROL_STATUS, buffer)
  }

  static async getAgingOffset(aBus) {
    const buffer = await aBus.readI2cBlock(REGISTERS.AGING_OFFSET, LENGTH_ONE_BYTE)
    return Converter.decodeAgingOffset(buffer)
  }

  static async setAgingOffset(aBus, offset) {
    const buffer = Converter.encodeAgingOffset(offset)
    return aBus.writeI2cBlock(REGISTERS.AGING_OFFSET, buffer)
  }

  static async getTemperature(aBus) {
    const buffer = await aBus.readI2cBlock(
      REGISTER_BLOCKS.TEMPERATURE.START,
      REGISTER_BLOCKS.TEMPERATURE.LENGTH
    )
    return Converter.decodeTemperature(buffer)
  }
}

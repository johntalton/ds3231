

export const DEFAULT_ADDRESS = 0x68

export const CENTURY_NINETEENTH = 1900
export const CENTURY_TWENTY = 2000
export const CENTURY_CURRENT = CENTURY_TWENTY
export const CENTURY = CENTURY_CURRENT

export const TEMPERATURE_DEGREE_PER_LSB = 0.25

// array index are positionally sorted for [rs2][rs1] lookup
export const FREQUENCIES_KHZ = [
  [1, 1.024],
  [4.096, 8.192]
]

export const DEFAULT_FREQUENCY_KHZ = FREQUENCIES_KHZ[0][0]

export const BIT_SET = 1
export const BIT_UNSET = 0

export const LENGTH_ONE_BYTE = 1

export const REGISTERS = {
  SECONDS: 0x00,
  MINUTES: 0x01,
  HOURS: 0x02,
  DAYS: 0x03,
  DATE: 0x04,
  MONTH_CENTURY: 0x05,
  YEAR: 0x06,

  ALARM_1_SECONDS: 0x07,
  ALARM_1_MINUTES: 0x08,
  ALARM_1_HOURS: 0x09,
  ALARM_1_DAY_DATE: 0x0A,

  ALARM_2_MINUTES: 0x0B,
  ALARM_2_HOURS: 0x0C,
  ALARM_2_DAY_DATE: 0x0D,

  CONTROL: 0xE,
  CONTROL_STATUS: 0x0F,

  AGING_OFFSET: 0x10,

  MSB_OF_TEMP: 0x11,
  LSB_OF_TEMP: 0x12
}

export const REGISTER_BLOCKS = {
  TIME: { START: REGISTERS.SECONDS, LENGTH: 7 },
  ALARM_1: { START: REGISTERS.ALARM_1_SECONDS, LENGTH: 4 },
  ALARM_2: { START: REGISTERS.ALARM_2_MINUTES, LENGTH: 3 },
  TEMPERATURE: { START: REGISTERS.MSB_OF_TEMP, LENGTH: 2 }
}
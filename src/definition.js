export const DEFINITION = {
	name: 'DS3231',
	registers: {
		'Seconds': {
			address: 0x00,
			default: 0x00,
			fields: {
				'TEN_SECONDS': { offset: 6, length: 3 },
				'SECONDS': { offset: 3, length: 4 }
			}
		},
		'Minutes': {
			address: 0x01,
			default: 0x00,
			fields: {
				'TEN_MINUTES': { offset: 6, length: 3 },
				'MINUTES': { offset: 3, length: 4 }
			}
		},
		'Hours': {
			address: 0x02,
			default: 0x00,
			fields: {
				'TWELVE_TWENTY_FOUR': {},
				'AM_PM_TWENTY_HOUR': {},
				'TEN_HOUR': {}
			}
		},
		'Day': {
			address: 0x03,
			default: 0x00,
			fields: {
				'DAY': { offset: 2, length: 3 }
			}
		},
		'Date': {
			address: 0x04,
			default: 0x00,
			fields: {
				'TEN_DATE': { offset: 5, length: 2 },
				'DATE': { offset: 3, length: 4 }
			}
		},
		'Month / Century': {
			address: 0x05,
			default: 0x00
		},
		'Year': {
			address: 0x06,
			default: 0x00
		},
		'Alarm 1 Seconds': {
			address: 0x07,
			default: 0x00
		},
		'Alarm 1 Minutes': {
			address: 0x08,
			default: 0x00
		},
		'Alarm 1 Hours': {
			address: 0x09,
			default: 0x00
		},
		'Alarm 1 Day / Date': {
			address: 0x0A,
			default: 0x00
		},
		'Alarm 2 Minutes': {
			address: 0x0B,
			default: 0x00
		},
		'Alarm 2 Hours': {
			address: 0x0C,
			default: 0x00
		},
		'Alarm 2 Day / Date': {
			address: 0x0D,
			default: 0x00
		},
		'Control': {
			address: 0x0E,
			default: 0x1C,
			fields: {
				'EOSC': { type: 'boolean', offset: 7, length: 1 },
				'BBSQW': { type: 'boolean', offset: 6, length: 1 },
				'CONV': { type: 'boolean', offset: 5, length: 1 },
				'RS2': { type: 'boolean', offset: 4, length: 1 },
				'RS1': { type: 'boolean', offset: 3, length: 1 },
				'INTCN': { type: 'boolean', offset: 2, length: 1 },
				'A2IE': { type: 'boolean', offset: 1, length: 1 },
				'A1IE': { type: 'boolean', offset: 0, length: 1 }
			}
		},
		'Control / Status': {
			address: 0x0F,
			default: 0x88,
			fields: {
				'OSF': { type: 'boolean', offset: 7, length: 1 },
				'EN32kHz':  {type: 'boolean', offset: 3, length: 1 },
				'BSY': { type: 'boolean', offset: 2, length: 1 },
				'A2F': { type: 'boolean', offset: 1, length: 1 },
				'A1F': { type: 'boolean', offset: 0, length: 1 }
			}
		},
		'Aging Offset': {
			address: 0x10,
			default: 0x00
		},
		'MSB of Temp': {
			address: 0x11,
			default: 0x00,
			fields: {
				'MSB': { offset: 7, length: 8}
			}
		},
		'LSB of Temp': {
			address: 0x12,
			default: 0x00,
			fields: {
				'LSB': { offset: 7, length: 2 }
			}
		}
	},
	blocks: {
		'Temperature': { address: 0x11, length: 2 }
	}
}
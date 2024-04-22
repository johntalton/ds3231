export const DEFINITION = {
	name: 'DS3231',
	registers: {
		'Seconds': {
			address: 0x00,
			default: 0x00
		},
		'Minutes': {
			address: 0x01,
			default: 0x00
		},
		'Hours': {
			address: 0x02,
			default: 0x00
		},
		'Day': {
			address: 0x03,
			default: 0x00
		},
		'Date': {
			address: 0x04,
			default: 0x00
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
			default: 0x00
		},
		'Control / Status': {
			address: 0x0F,
			default: 0x00
		},
		'Aging Offset': {
			address: 0x10,
			default: 0x00
		},
		'MSB of Temp': {
			address: 0x11,
			default: 0x00
		},
		'LSB of Temp': {
			address: 0x12,
			default: 0x00
		}
	}
}
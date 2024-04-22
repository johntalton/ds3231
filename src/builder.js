import { BitSmush } from '@johntalton/bitsmush'

function fieldConverter(buffer, fieldDef) {
	const u8 = ArrayBuffer.isView(buffer) ?
		new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) :
		new Uint8Array(buffer)

	const type = (fieldDef?.type === undefined ? 'int' : fieldDef.type).toLowerCase()

	if(type === 'boolean') {
		const data = u8[0]
		const bit = BitSmush.extractBits(data, fieldDef.offset, 1)
		// todo support active low
		return bit === 1
	}

	if(type === 'int') {
		const data = u8[0]
		const bit = BitSmush.extractBits(data, fieldDef.offset, fieldDef.length)

		return bit
	}

	console.warn('unknown type', type)

	return u8[0]
}

export class CommonBuilder {
	static from(definition) {
		const funcs = Object.entries(definition.registers)
			.map(([name, regDef]) => {
				const funcName = 'get' + name.replace(' ', '')

				const converter = (buffer) => {
					return Object.entries(regDef.fields)
						.map(([key, fieldDef]) => {
							return {
								[key]: fieldConverter(buffer, fieldDef)
							}
						})
						.reduce((acc, cur) => {
							return { ...acc, ...cur }
						}, {})
				}

				const func = async (bus) => {

					const ab = await bus.readI2cBlock(regDef.address, 1)
					console.log(bus, funcName + ' : ' + regDef.address, ab)
					return converter(ab)
				}

				return [funcName, func]
			})

		const obj = funcs.reduce((acc, data) => {
			const [ name, value ] = data
			acc[name] = value
			return acc
		}, {})

		return obj
	}
}
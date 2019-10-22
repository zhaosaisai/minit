import { getDefinitionKey, createBaseType } from './utils'

interface InterfaceField {
	required: boolean;
	name: string;
	type: string;
}

export interface Interface {
	name: string;
	fields: InterfaceField[];
	description?: string;
	url?: string;
	method?: string;
}


/**
 * 解构level:2 的type
 * @param types
 */
export function getSecondLevelType(obj: any = {}) {
	if (obj.$ref) {
		return getDefinitionKey(obj.$ref)
	}

	if (obj.type === 'array') {
		return `${getSecondLevelType(obj.items)}[]`
	}

	return createBaseType(obj.type)
}

/**
 * 解构level:1 的类型
 * @param types
 */
export function getTopLevelType(obj) {
	if (obj.schema) {
		return getSecondLevelType(obj.schema)
	}

	if (obj.type === 'array') {
		return `${getSecondLevelType(obj.items)}[]`
	}

	return createBaseType(obj.type)
}

/**
 * 获取确定的类型
 *
 * level: 1
 * schema > type
 * 						- array -> items
 * 						- type
 *
 * level: 2
 * $ref > type
 * 						- array -> items
 * 						- type
 * @param level
 */
export function getSpecificType(obj, level: number = 1) {
	if (level === 1) {
		return getTopLevelType(obj)
	} else if (level === 2) {
		return getSecondLevelType(obj);
	}
}

/**
 * 将definitions转换成typescript 的接口
 * @param definitions
 */
export default function convertDefinition2Interface(definitions = {}) {
	const interfaces: Interface[] = []

	Object.keys(definitions).forEach(name => {
		const { type, required = [], properties, additionalProperties } = definitions[name]
		const _interface: Interface = {
			name,
			fields: []
		}
		// 先暂时认为全是 object, 并先忽略 additionalProperties
		// 处理type: string包含枚举数据的情况

		if (properties) {
			Object.keys(properties).forEach(prop => {
				_interface.fields.push({
					required: required.includes(prop) as boolean,
					name: prop,
					type: getSpecificType(properties[prop], 2)
				})
			})
		} else {
			_interface.fields.push({
				required: false,
				name: '[prop: string]',
				type: 'any'
			})
		}
		interfaces.push(_interface)
	})

	return interfaces
}

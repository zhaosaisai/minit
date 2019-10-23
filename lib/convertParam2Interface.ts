import { getFormattedName, firstCharToUpper } from './utils'
import { ParamObject } from './makeParamsObject'
import { Interface, getSecondLevelType } from './convertDefinition2Interface'

const prefix = '/TreasureBoxGateway/api/'

function convertObj2Arr(obj) {
	return Object.keys(obj).map(key => {
		return {
			name: key,
			...obj[key]
		}
	})
}

export default function convertParam2Interface(params: ParamObject[]) {
	const interfaces: Interface[] = []
	// TODO 待优化
	params.forEach(param => {
		const { description = '', bodyParams = {}, queryParams = {}, method, url, pathParams = {}, responseSchema } = param

		if (Object.keys(bodyParams).length > 0) {
			const name = `${firstCharToUpper(method as string)}${getFormattedName(url as string, prefix)}BodyInterface`
			interfaces.push({
				name,
				description,
				fields: convertObj2Arr(bodyParams)
			})

			param.bodyParams = name
		} else {
			delete param.bodyParams
		}

		if (Object.keys(queryParams).length > 0) {
			const name = `${firstCharToUpper(method as string)}${getFormattedName(url as string, prefix)}QueryInterface`
			interfaces.push({
				name,
				description,
				fields: convertObj2Arr(queryParams)
			})

			param.queryParams = name
		} else {
			delete param.queryParams
		}

		if (Object.keys(pathParams).length === 0) {
			delete param.pathParams
		}

		param.responseSchema = getSecondLevelType(responseSchema)
	})

	return interfaces
}

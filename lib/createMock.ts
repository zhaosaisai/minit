import getValue from 'get-value'
import parseDefinitions from './parseDefinitions'
import { getDefinitionKey, createBaseType } from './utils'

function getResponseValueDefinition(responseSchema, defintions) {
	const { $ref, type, items } = responseSchema

	if ($ref) {
		return parseDefinitions(getDefinitionKey($ref), defintions)
	} else if (type === 'array') {
		return [getResponseValueDefinition(items, defintions)]
	} else if(type === 'object') {
		// TODO additionalProperties的作用
		return {}
	} else {
		return createBaseType(type)
	}
}

export default function createMock(paths, defintions) {
	const mocks: any[] = []

	Object.keys(paths).forEach(url => {
		const methods = Object.keys(paths[url])

		for (let i = 0; i < methods.length; i++) {
			const method = methods[i]
			const { responses, summary } = paths[url][method]
			const responseSchema = getValue(responses, '200.schema', { default: Object.create(null) })
			mocks.push({
				url,
				method,
				response: getResponseValueDefinition(responseSchema, defintions)
			})
		}
	})

	return mocks
}

import { firstCharToUpper, isPlainObject } from '../utils'

interface MockBase {
	url: string;
	method: string;
	response?: any;
}

function createImportStatement() {
	return `
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Mock from 'mockjs'

function mockWrapper(data) {
	return Mock.mock(data)
}
	`
}

function on(method) {
	return `on${firstCharToUpper(method)}`
}

function stringify(json) {
	return JSON.stringify(json, null, 2)
}

function createBaseTypeRes(type) {
	switch(type) {
		case 'number':
			return '@natural(1, 1000)'
		case 'string':
			return '@first'
    case 'boolean':
			return '@boolean'
		default:
			return ''
  }
}

function createMockResponse(response) {
	if (!response) return {}

	if (isPlainObject(response)) {
		Object.keys(response).forEach(key => {
			response[key] = createMockResponse(response[key])
		})
	} else if (Array.isArray(response)) {
		for (let i = 0; i < response.length; i++) {
			response[i] = createMockResponse(response[i])
		}
	} else {
		return createBaseTypeRes(response)
	}
}

function getMockResponse(response) {
	const res = createMockResponse(response)
	if (typeof response === 'object') {
		return stringify(response)
	}
	return res
}

export default function generateMockjs(mocks: MockBase[]) {
	const statements = [
		'export default function mockConfig(instance){\n',
		'\tconst mock = new MockAdapter(instance, { delayResponse: 1000 })\n\n',
	]

	mocks.forEach(m => {
		statements.push(`\tmock.${on(m.method)}('${m.url}').reply((config) => {\n`)
		statements.push(`\t\treturn [200, mockWrapper(${getMockResponse(m.response)})]\n`)
		statements.push('\t})\n\n')
	})

	statements.push('\tmock.onAny().passThrough()\n}')

	return createImportStatement().concat('\n', statements.join(''));
}

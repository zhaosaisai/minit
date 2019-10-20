import getValue from 'get-value'

import { getDefinitionKey, createBaseType } from './utils'

interface Parameter {
  name: string;
  in: string;
  description: string;
  required: boolean;
  type?: string;
  default?: string;
  schema?: any;
  items?: any;
}

interface ParamObject {
	bodyParams?: any;
	queryParams?: any;
	pathParams?: any;
	responseSchema?: any;
	method?: string;
	url?: string;
}

export const methods = [
  'get',
  'post',
  'put',
  'delete',
  'head'
]

function getKey(parameter: Parameter) {
	if (parameter.schema) {
		return parameter.schema
	}

	if (parameter.items) {
		return parameter.items
	}

  return ''
}

export function confirmMethods(config: any) {
  const method = methods.find(m => !!config[m]) as any
  return [method, config[method]]
}

export function getParams(parameters: Parameter[]): ParamObject {
  const param: ParamObject = {
    bodyParams: {},
    queryParams: {},
    pathParams: {}
  }

  parameters.forEach(parameter => {
    const { name, required, type, schema, items } = parameter
    const position = parameter.in
    let key = ''

    // handle params in path in first
    if (position === 'path') {
      param.pathParams[name] = {
				type: createBaseType(type),
				required,
			}
      return
    }

    if (position === 'header') {
      return
    }

    const mount = position === 'query'
      ? param.queryParams
			: param.bodyParams

		mount[name] = {
			type: createBaseType(type),
			schema,
			items,
			required,
		}
  })

  return param
}

export default function makeParams(swaggerPaths: any) {
  const params: ParamObject[]  = []

  Object.keys(swaggerPaths).forEach(url => {
		const [method, config] = confirmMethods(swaggerPaths[url])
		const responseSchema = getValue(swaggerPaths[url], `${method}.responses.200.schema`, {})
		const parameters = config['parameters'] || []

    if (parameters.length === 0) {
      params.push({
        method,
				url,
				responseSchema
      })
      return
    }

    const { bodyParams = {}, queryParams = {}, pathParams = {} } = getParams(parameters)

    params.push({
      method,
      url,
      bodyParams,
      queryParams,
			pathParams,
			responseSchema
    })
  })

  return params
}

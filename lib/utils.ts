export function createObject(type: string) {
  if (type === 'object') {
    return {}
  } else if (type === 'array') {
    return []
  }
  return
}

export function createBaseType(type: string | undefined) {
  switch(type) {
    case 'number':
    case 'integer':
      return 'number'
    case 'string':
      return 'string'
    case 'boolean':
			return 'boolean'
		default:
			return 'any'
  }
}


export function getRandomNumber(min = 1, max = 5) {
  return Math.ceil(Math.random() * max) + min
}

export function getTrueOrFalse() {
  return Math.random() > 0.5
}

export function getRandomString(format: string = 'byte') {
  switch(format) {
    case 'byte':
      return new Buffer(`${Math.random()}`).toString('base64')
    case 'date-time':
      return formatTime(Date.now())
    case 'date':
      return formatTime(Date.now(), 'YYYY-MM-DD')
  }
}

type StringOrNumber = string | number | Date
export function formatTime(time: StringOrNumber = Date.now(), format = 'YYYY-MM-DD hh:mm:ss') {
  const date = new Date(time)
  const kv = {
    'YYYY': date.getFullYear(),
    'YY': `${date.getFullYear()}`.slice(-2),
    'MM': `0${date.getMonth()}`.slice(-2),
    'DD': `0${date.getDate()}`.slice(-2),
    'hh': `0${date.getHours()}`.slice(-2),
    'mm': `0${date.getMinutes()}`.slice(-2),
    'ss': `0${date.getSeconds()}`.slice(-2)
  }

  Object.keys(kv).forEach(k => {
    format = format.replace(new RegExp(k), kv[k])
  })

  return format
}

/**
 * 从$ref中获取definition的名字
 * @param definition
 */
export function getDefinitionKey(definition: string) {
  return definition.slice(definition.lastIndexOf('/') + 1)
}

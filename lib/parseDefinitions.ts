import { createObject, createBaseType, getDefinitionKey, isPlainObject } from './utils'

function parseArrayDefinition(items, definitions) {
  const { $ref, type } = items
  if ($ref) {
    return parseDefinitions(getDefinitionKey($ref), definitions)
  }
  return createBaseType(type)
}

function parseObjectDefinition(property, definitions) {
  const { $ref, type, items, format } = property

  if ($ref) {
    return parseDefinitions(getDefinitionKey($ref), definitions)
  } else if (type === 'array') {
    return [parseArrayDefinition(items, definitions)]
  }

  return createBaseType(type, format)
}

function parseDefinitions(key: string, definitions) {
  const { type, properties = {}, items, $ref } = definitions[key]
  const object: any = createObject(type)

  if (Array.isArray(object)) {
    object.push(parseArrayDefinition(items, definitions))
  } else if (isPlainObject(object)) {
    Object.keys(properties).forEach(property => {
      object[property] = parseObjectDefinition(properties[property], definitions)
    })
  }

  return object
}

export default parseDefinitions

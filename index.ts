import { getSwaggerJson } from './lib/service'
import  makeParamsObject from './lib/makeParamsObject'
import convertDefinition2Interface from './lib/convertDefinition2Interface'

getSwaggerJson('http://stable.treasureboxgateway.51.env/v2/api-docs?group=TreasureBoxGateway').then(json => {
	console.log(JSON.stringify(convertDefinition2Interface(json.definitions), null, 2))
})

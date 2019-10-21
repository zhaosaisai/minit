import ejs from 'ejs'
import { getSwaggerJson } from './lib/service'
import  makeParamsObject from './lib/makeParamsObject'
import convertDefinition2Interface from './lib/convertDefinition2Interface'

getSwaggerJson('http://stable.treasureboxgateway.51.env/v2/api-docs?group=TreasureBoxGateway').then(json => {
	const d = convertDefinition2Interface(json.definitions)
	console.log(JSON.stringify(d, null, 2))

	ejs.renderFile('./lib/templates/interface.ejs', {
		interfaces: d
	}).then(data => {
		console.log(data)
	})
})

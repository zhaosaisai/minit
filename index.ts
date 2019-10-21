import ejs from 'ejs'
import { getSwaggerJson } from './lib/service'
import  makeParamsObject from './lib/makeParamsObject'
import convertDefinition2Interface from './lib/convertDefinition2Interface'
import convertParam2Interface from './lib/convertParam2Interface'

getSwaggerJson('http://stable.treasureboxgateway.51.env/v2/api-docs?group=TreasureBoxGateway').then(json => {
	// const d = convertDefinition2Interface(json.definitions)
	// console.log(JSON.stringify(d, null, 2))

	// ejs.renderFile('./lib/templates/interface.ejs', {
	// 	interfaces: d
	// }).then(data => {
	// 	console.log(data)
	// })

	// console.log(JSON.stringify(makeParamsObject(json.paths), null, 2))
	const params = makeParamsObject(json.paths)
	const paramsInterfaces = convertParam2Interface(params)

	// ejs.renderFile('./lib/templates/interface.ejs', {
	// 	interfaces: paramsInterfaces
	// }).then(data => {
	// 	console.log(data)
	// })

	// console.log(JSON.stringify(paramsInterfaces, null, 2))
	// console.log(JSON.stringify(params, null, 2))

	ejs.renderFile('./lib/templates/request.ejs', {
		requests: params
	}).then(data => {
		console.log(data)
	})
})

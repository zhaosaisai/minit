import axios from 'axios'

interface SwaggerInfo {
  description: string,
  version: string,
  title: string;
  contact: any;
}

interface Swagger {
  swagger: string;
  host: string;
  basePath: string;
  tags: any[];
  paths: any;
  definitions: any;
  info: SwaggerInfo;
}

export const getSwaggerJson = async (jsonUrl: string): Promise<Swagger> => {
	const swagger = await axios.get(jsonUrl)
  return swagger.data
}

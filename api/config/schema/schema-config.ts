import axios from 'axios'
import { CONFIG } from '../../consts'

const genAddSchemaConfigMessage = (obj: {
  name: string, endpoint: string, token: string
}) => {
  return {
    schema_configs: [{
      name: obj.name,
      endpoint: obj.endpoint,
      token: obj.token
    }]
  }
}

const genEditSchemaConfigMessage = (obj: {
  name: string, endpoint: string, token: string
}) => {
  return {
      name: obj.name,
      endpoint: obj.endpoint,
      token: obj.token
  }
}

export class SchemaConfig {

  static async AddConfig (name: string, endpoint: string, schemaToken: string, token: string) {
    const message = genAddSchemaConfigMessage({
      name: name,
      endpoint: endpoint,
      token: schemaToken
    })
    console.log('request: Add Config ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/configs/schemas`, message,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async EditConfig (configId: string, name: string, endpoint: string, schemaToken: string, token: string) {
    const message = genEditSchemaConfigMessage({
      name: name,
      endpoint: endpoint,
      token: schemaToken
    })
    console.log('request: Edit Config ', JSON.stringify(message, null, 2))
    return await axios.put(`${CONFIG.BASE_URL}/api/web/configs/schemas/${configId}`, message,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async DeleteConfig (configId: string, token: string) {
    return await axios.delete(`${CONFIG.BASE_URL}/api/web/configs/schemas/${configId}`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetSchemaConfigs (token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/configs/schemas`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetSchemaConfigsByID (repositoryId: string,token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/configs/schemas/${repositoryId}`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }
}

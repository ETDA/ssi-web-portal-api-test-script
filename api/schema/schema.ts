import axios from 'axios'
import { CONFIG } from '../consts'

const genCreateSchemaMessage = (obj: {
  schema_name: string, schema_type: string, schema_body: any
}) => {
  return {
    // schema: {
    schema_name: obj.schema_name,
    schema_type: obj.schema_type,
    schema_body: obj.schema_body
    // }
  }
}

const genUpdateSchemaMessage = (obj: {
  schema_name: string, schema_type: string, schema_body: any, version: string
}) => {
  return {
    // id: obj.schema_id,
    // operation: OPERATION.VC_SCHEMA_UPDATE,
    // did_address: obj.did_address,
    // nonce: obj.nonce,
    // schema: {
    schema_name: obj.schema_name,
    schema_type: obj.schema_type,
    schema_body: obj.schema_body,
    version: obj.version
    // },
  }
}

export class Schema {

  static async Create (repositoryId: string, schemaName: string, schemaType: string, schemaBody: any, token: string) {
    const message = genCreateSchemaMessage({
      schema_name: schemaName,
      schema_type: schemaType,
      schema_body: schemaBody
    })
    console.log('request: Create VC schema ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/schemas/${repositoryId}`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async Update (repositoryId: string, schemaId: string, schemaName: string, schemaType: string,
    schemaBody: any, version: string, token: string) {
    const message = genUpdateSchemaMessage({
      // schema_id: schemaId,
      schema_name: schemaName,
      schema_type: schemaType,
      schema_body: schemaBody,
      version: version
    })
    console.log('request: Update VC schema ', JSON.stringify(message, null, 2))
    return await axios.put(`${CONFIG.BASE_URL}/api/web/schemas/${repositoryId}/${schemaId}`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async Upload (repositoryId: string, formData: any, token: string) {
    const response = await axios({
      method: 'post',
      url: `${CONFIG.BASE_URL}/api/web/schemas/${repositoryId}/upload`,
      data: formData,
      headers: {
        // @ts-ignore
        'content-type': `multipart/form-data; boundary=${formData._boundary}`,
        'Authorization': `FINEMA ${token}`
      }
    })
    return response
  }

  static async UploadUpdate (repositoryId: string, schemaId: string, formData: any, token: string) {
    const response = await axios({
      method: 'post',
      url: `${CONFIG.BASE_URL}/api/web/schemas/${repositoryId}/${schemaId}/upload`,
      data: formData,
      headers: {
        // @ts-ignore
        'content-type': `multipart/form-data; boundary=${formData._boundary}`,
        'Authorization': `FINEMA ${token}`
      }
    })
    return response
  }
}

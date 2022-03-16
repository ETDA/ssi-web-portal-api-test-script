import axios from 'axios'
import { CONFIG } from '../../consts'

export class GetSchema {
  static async All (repositoryId: string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/schemas/${repositoryId}`, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async ById (repositoryId: string, schemaId: string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/schemas/${repositoryId}/${schemaId}`, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async HistoryById (repositoryId: string, schemaId: string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/schemas/${repositoryId}/${schemaId}/history`, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async VersionById (repositoryId: string, schemaId: string, version: string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/schemas/${repositoryId}/${schemaId}/${version}`, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async Json (repositoryId: string, schemaId: string, version: string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/schemas/${repositoryId}/${schemaId}/${version}/schema`, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async Reference (repositoryId: string, schemaId: string, version: string, ref: string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/schemas/${repositoryId}/${schemaId}/${version}/schema/${ref}`, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async Type (repositoryId: string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/schemas/${repositoryId}/types`, { headers: { 'Authorization': `FINEMA ${token}` } })
  }
}

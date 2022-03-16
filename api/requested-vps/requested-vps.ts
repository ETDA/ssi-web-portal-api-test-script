import axios from 'axios'
import { CONFIG } from '../consts'

const genCreateVpsMessage = (obj: {
  name: string, schema_type: string
}) => {
  return {
    name: obj.name,
    schema_list: [
      {
        schema_type: obj.schema_type,
        is_required: true,
        noted: 'ขอเอกสาร'
      },
      {
        schema_type: 'EReceipt',
        is_required: false
      }
    ]
  }
}

const genEditVpsMessage = (obj: {
  status: string
}) => {
  return {
    status: obj.status
  }
}

const genCancelVpsMessage = (obj: {
  ids: any
}) => {
  return {
    ids: obj.ids
  }
}

export class RequestedVPs {
  static async Create (name: string, schemaType: string, token: string) {
    const message = genCreateVpsMessage({
      name: name,
      schema_type: schemaType
    })
    console.log('request: Requested VPs ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/requested-vps`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async Edit (requestId: string, status: string, token: string) {
    const message = genEditVpsMessage({
      status: status
    })
    console.log('request: Requested VPs ', JSON.stringify(message, null, 2))
    return await axios.put(`${CONFIG.BASE_URL}/api/web/requested-vps/${requestId}`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async Cancel (ids: any, token: string) {
    const message = genCancelVpsMessage({
      ids: ids
    })
    console.log('request: Requested VPs ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/requested-vps/cancel`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async UpdateQR (requestId: string, token: string) {
    return await axios.post(`${CONFIG.BASE_URL}/api/web/requested-vps/${requestId}/update-qrcode`,
      null, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetAllRequested (token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/requested-vps`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetRequestedById (requestId: string,token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/requested-vps/${requestId}`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetQRcodeById (endpoint: string,token: string) {
    return await axios.get(endpoint,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }
}

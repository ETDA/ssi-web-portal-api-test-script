import axios from 'axios'
import { CONFIG } from '../consts'
import { CryptoHelper } from '../utils/rsa-CrytoHelper'

const genCreateVCMessage = (obj: {
  schema_name: string, signer: string, holder: string, credentialSubject: any,
  schema_id: string, schema_type: string
}) => {
  return {
    schema_name: obj.schema_name,
    signer: obj.signer,
    holder: obj.holder,
    credentialSubject: obj.credentialSubject,
    credentialSchema: {
      id: obj.schema_id,
      type: obj.schema_type
    }
    // }
  }
}

const genCancelVCMessage = (obj: {
  status: string
}) => {
  return {
    status: obj.status
  }
}

const genCreateQRMessage = (obj: {
  cids: any, did_address: string
}) => {
  return {
    did_address: obj.did_address,
    cids: obj.cids
  }
}

const genSignature = (private_key: string, didAddress: any) => {
  return CryptoHelper.sign(private_key, didAddress)
}

export class VCs {
  static async Create (fullSchemaId: string, schemaName: string, schemaType: string,
    signer: string, holder: string, credentialSubject: any, token: string) {
    const message = genCreateVCMessage({
      schema_name: schemaName,
      signer: signer,
      holder: holder,
      credentialSubject: credentialSubject,
      schema_id: fullSchemaId,
      schema_type: schemaType
    })
    console.log('request: Create VC ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/vcs`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async Cancel (vcId: string, status: string, token: string) {
    const message = genCancelVCMessage({
      status: status
    })
    console.log('request: Cancel VC ', JSON.stringify(message, null, 2))
    return await axios.put(`${CONFIG.BASE_URL}/api/web/vcs/${vcId}`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GenQR (cids: any, didAddress: string, token: string) {
    const message = genCreateQRMessage({
      cids: cids,
      did_address: didAddress
    })
    console.log('request: Gen QR ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/vcs/qr`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async QRToken (qrToken: string, endpoint: string, didKey: any) {
    const sig = genSignature(didKey[0].private_key, qrToken)
    console.log('x-signature', JSON.stringify(sig, null, 2))
    return await axios.get(endpoint,
      { headers: { 'Authorization': `${qrToken}`, 'x-signature': sig } })
  }

  static async Get (token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/vcs`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetById (vcId: string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/vcs/${vcId}`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetByDID (didAddress: string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/vcs/did/${didAddress}`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }
}

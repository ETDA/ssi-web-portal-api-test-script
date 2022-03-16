import axios from 'axios'
import { CONFIG } from '../../consts'
import { CryptoHelper } from '../../utils/rsa-CrytoHelper'

const faker = require('faker')
const jwt = require('jsonwebtoken')

const genSubmitVpMessage = (obj: {
  jwt: string
}) => {
  return {
    message: obj.jwt
  }
}

const genAddTagMessage = (obj: {
  tags: any
}) => {
  return {
    tags: obj.tags
  }
}

const genJsonBodyForVP = (obj: {
  cid: string, issuer_did: string, audience_did: string, schema_id: string, vc: any, issuance_date: string
}) => {
  return {
    // sub: obj.did_address,
    nbf: 1541493724,
    jti: obj.cid,
    aud: obj.audience_did,
    iss: obj.issuer_did,
    // nbf: 1541493724,
    // iat: 1541493724,
    // exp: 1573029723,
    vp: {
      // credentialSchema: {
      //   id: `${CONFIG.BASE_URL}/vc/schema/${obj.schema_id}/1.0.0`,
      //   type: 'JsonSchemaValidator2018'
      // },
      type: ['VerifiablePresentation'],
      verifiableCredential: [obj.vc],
      issuanceDate: obj.issuance_date
    }
  }
}

const genJsonHeader = (obj: {
  key_id: string
}) => {
  return {
    alg: 'ES256',
    typ: 'JWT',
    kid: obj.key_id
  }
}

export class SubmitVP {

  static async GenVP (jwtVc: any, cid: string, issuerDid: string, audienceDid: string, didKey: any,
    keyId: string, schemaId: string, issuanceDate: string) {

    const header = genJsonHeader({
      key_id: keyId
    })

    const payload = genJsonBodyForVP({
      cid: cid,
      vc: jwtVc,
      issuer_did: issuerDid,
      audience_did: audienceDid,
      schema_id: schemaId,
      issuance_date: issuanceDate
    })
    console.log('Header:', JSON.stringify(header, null, 2))
    console.log('Payload:', JSON.stringify(payload, null, 2))

    const secret = faker.name.firstName()
    console.log('Secret: ', secret)

    const token = await jwt.sign(payload, secret, { keyid: keyId })

    const base64Header = CryptoHelper.encodeBase64(JSON.stringify(header)).replace(/=/g, '')
    const header_payload = base64Header + '.' + token.split('.')[1]
    const signature = CryptoHelper.sign(didKey[0].private_key, header_payload)

    const jwtVp = `${header_payload}.${signature}`
    console.log('VP JWT Request: ', JSON.stringify(jwtVp, null, 2))

    return jwtVp
  }

  static async Submit (requestId: string, jwtVp: string, token: string) {
    const message = genSubmitVpMessage({
      jwt: jwtVp
    })
    console.log('request: Submit VP ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/requested-vps/${requestId}/submit`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async AddTag (requestId: string, tags: any, token: string) {
    const message = genAddTagMessage({
      tags: tags
    })
    console.log('request: Add tag ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/submitted-vps/${requestId}/tag`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetAllSubmitted (requestedId: string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/requested-vps/${requestedId}/submitted-vps`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetSubmittedByID (submitId: string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/submitted-vps/${submitId}`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetSubmittedVC (submitId: string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/submitted-vps/${submitId}/vcs`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetSubmittedVCByID (submitId: string,vcId:string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/submitted-vps/${submitId}/vcs/${vcId}`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }
}

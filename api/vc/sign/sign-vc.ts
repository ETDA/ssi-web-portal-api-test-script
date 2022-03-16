import axios from 'axios'
import { CONFIG } from '../../consts'
import { CryptoHelper } from '../../utils/rsa-CrytoHelper'

const faker = require('faker')
const jwt = require('jsonwebtoken')
const base64 = require('base-64')
const utf8 = require('utf8')

const genVCApproveMessage = (obj: {
  jwt: string
}) => {
  return {
    jwt: obj.jwt
  }
}

const genVCCancelMessage = (obj: {
  reason: string
}) => {
  return {
    reason: obj.reason
  }
}

const genRequestData = (private_key: string, message: any) => {
  const messageData = CryptoHelper.encodeBase64(JSON.stringify(message))
  return {
    data: {
      message: messageData
    },
    headers: {
      'x-signature': CryptoHelper.sign(private_key, messageData)
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

export class SignVC {

  static async JWTEditor (keyId: string, cid: string, issuanceDate: string, jwtPayload: string,
    didKey: any) {
    const bytes = base64.decode(jwtPayload)
    const jwt_payload = utf8.decode(bytes)
    const header = genJsonHeader({
      key_id: keyId
    })
    const jwtInsert = JSON.parse(jwt_payload)
    jwtInsert['jti'] = cid
    jwtInsert['issuance_date'] = issuanceDate

    const secret = faker.name.firstName()
    console.log('Secret: ', secret)

    const token = await jwt.sign(jwtInsert, secret, { keyid: keyId })
    const base64Header = CryptoHelper.encodeBase64(JSON.stringify(header)).replace(/=/g, '')
    const header_payload = base64Header + '.' + token.split('.')[1]
    const signature = CryptoHelper.sign(didKey[0].private_key, header_payload)

    const jwtVc = `${header_payload}.${signature}`
    console.log('VC JWT Request: ', JSON.stringify(jwtVc, null, 2))

    return jwtVc
  }

  static async Approve (vcId: string, jwtVc: string, didKey: any) {
    const message = genVCApproveMessage({
      jwt: jwtVc
    })
    const res = genRequestData(didKey[0].private_key, message)
    console.log('request: VC Approve', JSON.stringify(message, null, 2))
    console.log('headers: VC Approve', JSON.stringify(res.headers, null, 2))
    console.log('body: VC Approve', JSON.stringify(res.data, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/vcs/${vcId}/approve`,
      res.data, { headers: res.headers })
  }

  static async Reject (vcId: string, reason: string, didKey: any) {
    const message = genVCCancelMessage({
      reason: reason
    })
    const res = genRequestData(didKey[0].private_key, message)
    console.log('request: VC Reject', JSON.stringify(message, null, 2))
    console.log('headers: VC Reject', JSON.stringify(res.headers, null, 2))
    console.log('body: VC Reject', JSON.stringify(res.data, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/vcs/${vcId}/reject`,
      res.data, { headers: res.headers })
  }

  static async Revoke (vcId: string, token: string) {
    return await axios.post(`${CONFIG.BASE_URL}/api/web/vcs/${vcId}/revoke`,
      null, { headers: { 'Authorization': `FINEMA ${token}`} })
  }
}

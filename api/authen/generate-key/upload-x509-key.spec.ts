import { INVALID, USER_INFO } from '../../consts'
import { Authen } from '../authen'
import { Key, x509_EXAMPLE } from './key'

let getInitState: any = () => ({
  token: ''
})

describe('Upload x509 key', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Upload x509 key', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const certificate = x509_EXAMPLE.CERTIFICATE
      const key = x509_EXAMPLE.KEY
      const genKey = await Key.UploadX509(certificate, key, state.token)
      console.log('Gen Key: ', JSON.stringify(genKey.data, null, 2))
      expect(login.status).toEqual(201)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Upload x509 key - Send request with invalid token', async () => {
    try {
      state.token = 'abc'
      const certificate = x509_EXAMPLE.CERTIFICATE
      const key = x509_EXAMPLE.KEY
      const genKey = await Key.UploadX509(certificate, key, state.token)
      console.log('Gen Key: ', JSON.stringify(genKey.data, null, 2))
      expect(genKey.status).toEqual(401)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(401)
      expect(err.response.data.code).toBe(INVALID.INVALID_TOKEN.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_TOKEN.MESSAGE)
    }
  })
})

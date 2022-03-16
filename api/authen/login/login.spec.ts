import { INVALID, INVALID_PARAMS, USER_INFO } from '../../consts'
import { Authen } from '../authen'

describe('Login', () => {

  test('Login', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      expect(login.data.email).toBe(userName)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Login with incorrect password', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = 'abc123'

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.INVALID_CREDENTIALS.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_CREDENTIALS.MESSAGE)
    }
  })

  test('Login with incorrect email', async () => {
    try {
      const userName = 'abc@gmail.com'
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.INVALID_CREDENTIALS.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_CREDENTIALS.MESSAGE)
    }
  })

  test('Login without password', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = ''

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.INVALID_CREDENTIALS.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_CREDENTIALS.MESSAGE)
    }
  })

  test('Login without email', async () => {
    try {
      const userName = ''
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.email.code).toBe(INVALID_PARAMS.EMAIL.CODE)
      expect(err.response.data.fields.email.message).toBe(INVALID_PARAMS.EMAIL.MESSAGE)
      expect(err.response.data.fields.password.code).toBe(INVALID_PARAMS.PASSWORD.CODE)
      expect(err.response.data.fields.password.message).toBe(INVALID_PARAMS.PASSWORD.MESSAGE)
    }
  })
})

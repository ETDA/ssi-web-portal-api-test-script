import { INVALID, INVALID_PARAMS, USER_INFO } from '../../consts'
import { Authen } from '../authen'
import { Me } from './me'
import { v4 as uuidv4 } from 'uuid'

let getInitState: any = () => ({
  token: ''
})

describe('Change password', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Change password', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login1 = await Authen.Login(userName, password)
      console.log('Login1: ', JSON.stringify(login1.data, null, 2))
      expect(login1.status).toEqual(201)
      state.token = login1.data.token

      const newPassword = 'P@ssW0rd1234'
      const changePassword1 = await Me.ChangePassword(password, newPassword, state.token)
      console.log('Change password: ', JSON.stringify(changePassword1.data, null, 2))
      expect(changePassword1.status).toEqual(204)

      const login2 = await Authen.Login(userName, newPassword)
      console.log('Login2: ', JSON.stringify(login2.data, null, 2))
      expect(login2.status).toEqual(201)
      state.token = login2.data.token

      const changePassword2 = await Me.ChangePassword(newPassword, password, state.token)
      console.log('Change password2: ', JSON.stringify(changePassword2.data, null, 2))
      expect(changePassword2.status).toEqual(204)

      const login3 = await Authen.Login(userName, password)
      console.log('Login3: ', JSON.stringify(login3.data, null, 2))
      expect(login3.status).toEqual(201)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Change with incorrect current_password ', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login1 = await Authen.Login(userName, password)
      console.log('Login1: ', JSON.stringify(login1.data, null, 2))
      expect(login1.status).toEqual(201)
      state.token = login1.data.token

      const newPassword = 'P@ssW0rd1234'
      const changePassword1 = await Me.ChangePassword('password', newPassword, state.token)
      console.log('Change password: ', JSON.stringify(changePassword1.data, null, 2))
      expect(changePassword1.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.INVALID_CURRENT_PASSWORD.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_CURRENT_PASSWORD.MESSAGE)
    }
  })

  test('Change without current_password', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login1 = await Authen.Login(userName, password)
      console.log('Login1: ', JSON.stringify(login1.data, null, 2))
      expect(login1.status).toEqual(201)
      state.token = login1.data.token

      const newPassword = 'P@ssW0rd1234'
      const changePassword1 = await Me.ChangePassword('', newPassword, state.token)
      console.log('Change password: ', JSON.stringify(changePassword1.data, null, 2))
      expect(changePassword1.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.INVALID_CURRENT_PASSWORD.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_CURRENT_PASSWORD.MESSAGE)
    }
  })

  test('Change without new_password', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login1 = await Authen.Login(userName, password)
      console.log('Login1: ', JSON.stringify(login1.data, null, 2))
      expect(login1.status).toEqual(201)
      state.token = login1.data.token

      const changePassword1 = await Me.ChangePassword(password, '', state.token)
      console.log('Change password: ', JSON.stringify(changePassword1.data, null, 2))
      expect(changePassword1.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.new_password.code).toBe(INVALID.INVALID_STRING_SIZE_MIN.CODE)
      expect(err.response.data.fields.new_password.message).toBe(INVALID.INVALID_STRING_SIZE_MIN.MESSAGE)
    }
  })

  test('Change password with shorter than 8 character', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login1 = await Authen.Login(userName, password)
      console.log('Login1: ', JSON.stringify(login1.data, null, 2))
      expect(login1.status).toEqual(201)
      state.token = login1.data.token

      const newPassword = '1234567'
      const changePassword1 = await Me.ChangePassword(password, newPassword, state.token)
      console.log('Change password: ', JSON.stringify(changePassword1.data, null, 2))
      expect(changePassword1.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.new_password.code).toBe(INVALID.INVALID_STRING_SIZE_MIN.CODE)
      expect(err.response.data.fields.new_password.message).toBe(INVALID.INVALID_STRING_SIZE_MIN.MESSAGE)
    }
  })

  test('Change password with invalid token', async () => {
    try {
      const password = USER_INFO.PASSWORD
      const dummyToken = uuidv4()

      const newPassword = '12345679'
      const changePassword1 = await Me.ChangePassword(password, newPassword, dummyToken)
      console.log('Change password: ', JSON.stringify(changePassword1.data, null, 2))
      expect(changePassword1.status).toEqual(204)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(401)
      expect(err.response.data.code).toBe(INVALID.INVALID_TOKEN.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_TOKEN.MESSAGE)
    }
  })
})

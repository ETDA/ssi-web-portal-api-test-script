import { INVALID, USER_INFO } from '../../consts'
import { Authen } from '../authen'
import { v4 as uuidv4 } from 'uuid'

let getInitState: any = () => ({
  token: ''
})

describe('Logout', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Logout', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const logout = await Authen.Logout(state.token)
      console.log('Logout: ', JSON.stringify(logout.data, null, 2))
      expect(logout.status).toEqual(204)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Logout with invalid token', async () => {
    try {
      const dummyToken = uuidv4()
      const logout = await Authen.Logout(dummyToken)
      console.log('Logout: ', JSON.stringify(logout.data, null, 2))
      expect(logout.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(401)
      expect(err.response.data.code).toBe(INVALID.INVALID_TOKEN.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_TOKEN.MESSAGE)
    }
  })
})

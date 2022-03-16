import { USER_INFO } from '../../consts'
import { Authen } from '../authen'
import { Me } from './me'

let getInitState: any = () => ({
  token: ''
})

describe('Get info', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Get info', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const getInfo = await Me.Info(state.token)
      console.log('Info: ', JSON.stringify(getInfo.data, null, 2))
      expect(getInfo.status).toEqual(200)
      expect(getInfo.data.email).toBe(userName)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })
})

import { USER_INFO } from '../../consts'
import { Authen } from '../authen'
import { User } from './user-verify'

let getInitState: any = () => ({
  token: ''
})

describe('Post user verify', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Post user verify', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const userVerify = await User.PostVerify(state.token, password)
      console.log('User Verify: ', JSON.stringify(userVerify.data, null, 2))
      expect(userVerify.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })
})

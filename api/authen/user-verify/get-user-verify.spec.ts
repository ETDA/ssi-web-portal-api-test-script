import { User } from './user-verify'

let getInitState: any = () => ({
  token: ''
})

describe('Get user verify', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Get user verify', async () => {
    try {
      state.token = 'b570f895ce2a87a6f81a8af104982edba9979a76af2461d0f0001b1d99f996db'

      const userVerify = await User.GetVerify(state.token)
      console.log('User Verify: ', JSON.stringify(userVerify.data, null, 2))
      expect(userVerify.status).toEqual(204)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Get user verify - Send request with incorrect token', async () => {
    try {
      state.token = 'abc'

      const userVerify = await User.GetVerify(state.token)
      console.log('User Verify: ', JSON.stringify(userVerify.data, null, 2))
      expect(userVerify.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})

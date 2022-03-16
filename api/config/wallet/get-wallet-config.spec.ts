import { CONFIG, INVALID, USER_INFO, WALLET_ACCESS } from '../../consts'
import { Authen } from '../../authen/authen'
import { v4 as uuidv4 } from 'uuid'
import { WalletConfig } from './wallet-config'

let getInitState: any = () => ({
  token: '',
  configId: ''
})

describe('Get wallet config', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Get wallet config', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const endpoint = CONFIG.BASE_URL + '/api'
      const token = WALLET_ACCESS.TOKEN

      const addWalletConfig = await WalletConfig.AddConfig(endpoint, token, state.token)
      console.log('Add wallet config: ', JSON.stringify(addWalletConfig.data, null, 2))
      expect(addWalletConfig.status).toEqual(201)
      state.configId = addWalletConfig.data.id

      const getWalletConfig = await WalletConfig.GetWalletConfigs(state.token)
      console.log('Get wallet config: ', JSON.stringify(getWalletConfig.data, null, 2))
      expect(getWalletConfig.status).toEqual(200)
      expect(getWalletConfig.data.id).toBe(state.configId)
      expect(getWalletConfig.data.endpoint).toBe(endpoint)
      expect(getWalletConfig.data.access_token).toBe(token)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Get wallet config - Send request with invalid token', async () => {
    try {
      state.token = uuidv4()

      const getWalletConfig = await WalletConfig.GetWalletConfigs(state.token)
      console.log('Get wallet config: ', JSON.stringify(getWalletConfig.data, null, 2))
      expect(getWalletConfig.status).toEqual(401)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(401)
      expect(err.response.data.code).toBe(INVALID.INVALID_TOKEN.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_TOKEN.MESSAGE)
    }
  })
})

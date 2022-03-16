import { CONFIG, INVALID, INVALID_PARAMS, USER_INFO, WALLET_ACCESS } from '../../consts'
import { Authen } from '../../authen/authen'
import { v4 as uuidv4 } from 'uuid'
import { WalletConfig } from './wallet-config'

let getInitState: any = () => ({
  token: ''
})

describe('Add wallet config', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Add wallet config', async () => {
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
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Post config wallet - Send request with not exists endpoint', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const endpoint = CONFIG.BASE_URL + '/abc'
      const token = WALLET_ACCESS.TOKEN

      const addWalletConfig = await WalletConfig.AddConfig(endpoint, token, state.token)
      console.log('Add wallet config: ', JSON.stringify(addWalletConfig.data, null, 2))
      expect(addWalletConfig.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.WALLET_CONFIG_NOT_CORRECT.CODE)
      expect(err.response.data.message).toBe(INVALID.WALLET_CONFIG_NOT_CORRECT.MESSAGE)
    }
  })

  test('Post config wallet - Send request with invalid access token', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const endpoint = CONFIG.BASE_URL + '/api'
      const token = uuidv4()

      const addWalletConfig = await WalletConfig.AddConfig(endpoint, token, state.token)
      console.log('Add wallet config: ', JSON.stringify(addWalletConfig.data, null, 2))
      expect(addWalletConfig.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.WALLET_CONFIG_NOT_CORRECT.CODE)
      expect(err.response.data.message).toBe(INVALID.WALLET_CONFIG_NOT_CORRECT.MESSAGE)
    }
  })

  test('Post config wallet - Send request without endpoint', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const token = WALLET_ACCESS.TOKEN

      const addWalletConfig = await WalletConfig.AddConfig('', token, state.token)
      console.log('Add wallet config: ', JSON.stringify(addWalletConfig.data, null, 2))
      expect(addWalletConfig.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.endpoint.code).toBe(INVALID_PARAMS.ENDPOINT.CODE)
      expect(err.response.data.fields.endpoint.message).toBe(INVALID_PARAMS.ENDPOINT.MESSAGE)
    }
  })

  test('Post config wallet - Send request without access token', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const endpoint = CONFIG.BASE_URL + '/api'

      const addWalletConfig = await WalletConfig.AddConfig(endpoint, '', state.token)
      console.log('Add wallet config: ', JSON.stringify(addWalletConfig.data, null, 2))
      expect(addWalletConfig.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.access_token.code).toBe(INVALID_PARAMS.ACCESS_TOKEN.CODE)
      expect(err.response.data.fields.access_token.message).toBe(INVALID_PARAMS.ACCESS_TOKEN.MESSAGE)
    }
  })

  test('Post config wallet - Send request with invalid token', async () => {
    try {
      state.token = uuidv4()

      const endpoint = CONFIG.BASE_URL + '/api'
      const token = WALLET_ACCESS.TOKEN

      const addWalletConfig = await WalletConfig.AddConfig(endpoint, token, state.token)
      console.log('Add wallet config: ', JSON.stringify(addWalletConfig.data, null, 2))
      expect(addWalletConfig.status).toEqual(401)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(401)
      expect(err.response.data.code).toBe(INVALID.INVALID_TOKEN.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_TOKEN.MESSAGE)
    }
  })
})

import { CONFIG, INVALID, INVALID_PARAMS, SCHEMA_ACCESS, USER_INFO } from '../../consts'
import { Authen } from '../../authen/authen'
import { v4 as uuidv4 } from 'uuid'
import { SchemaConfig } from './schema-config'

const faker = require('faker')

let getInitState: any = () => ({
  token: ''
})

describe('Add schema config', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Add schema config', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const configName = faker.name.jobTitle()
      const endpoint = CONFIG.BASE_URL + '/api'
      const token = SCHEMA_ACCESS.TOKEN

      const addSchemaConfig = await SchemaConfig.AddConfig(configName, endpoint, token, state.token)
      console.log('Add schema config: ', JSON.stringify(addSchemaConfig.data, null, 2))
      expect(addSchemaConfig.status).toEqual(200)
      expect(addSchemaConfig.data[0].name).toBe(configName)
      expect(addSchemaConfig.data[0].endpoint).toBe(endpoint)
      expect(addSchemaConfig.data[0].access_token).toBe(token)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Add schema config - Send request with not exists endpoint', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const configName = faker.name.jobTitle()
      const endpoint = CONFIG.BASE_URL + '/abc'
      const token = SCHEMA_ACCESS.TOKEN

      const addSchemaConfig = await SchemaConfig.AddConfig(configName, endpoint, token, state.token)
      console.log('Add schema config: ', JSON.stringify(addSchemaConfig.data, null, 2))
      expect(addSchemaConfig.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Add schema config - Send request with invalid access token', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const configName = faker.name.jobTitle()
      const endpoint = CONFIG.BASE_URL + '/api'
      const token = uuidv4()

      const addSchemaConfig = await SchemaConfig.AddConfig(configName, endpoint, token, state.token)
      console.log('Add schema config: ', JSON.stringify(addSchemaConfig.data, null, 2))
      expect(addSchemaConfig.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(401)
      expect(err.response.data.code).toBe(INVALID.INVALID_TOKEN.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_TOKEN.MESSAGE)
    }
  })

  test('Add schema config - Send request without name', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      // const configName = faker.name.jobTitle()
      const endpoint = CONFIG.BASE_URL + '/api'
      const token = uuidv4()

      const addSchemaConfig = await SchemaConfig.AddConfig('', endpoint, token, state.token)
      console.log('Add schema config: ', JSON.stringify(addSchemaConfig.data, null, 2))
      expect(addSchemaConfig.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.name.code).toBe(INVALID_PARAMS.NAME.CODE)
      expect(err.response.data.fields.name.message).toBe(INVALID_PARAMS.NAME.MESSAGE)
    }
  })

  test('Add schema config - Send request without endpoint', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const configName = faker.name.jobTitle()
      // const endpoint = CONFIG.BASE_URL + '/api'
      const token = uuidv4()

      const addSchemaConfig = await SchemaConfig.AddConfig(configName, '', token, state.token)
      console.log('Add schema config: ', JSON.stringify(addSchemaConfig.data, null, 2))
      expect(addSchemaConfig.status).toEqual(400)
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

  test('Add schema config - Send request without access token', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const configName = faker.name.jobTitle()
      const endpoint = CONFIG.BASE_URL + '/api'
      // const token = uuidv4()

      const addSchemaConfig = await SchemaConfig.AddConfig(configName, endpoint, '', state.token)
      console.log('Add schema config: ', JSON.stringify(addSchemaConfig.data, null, 2))
      expect(addSchemaConfig.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.token.code).toBe(INVALID_PARAMS.TOKEN.CODE)
      expect(err.response.data.fields.token.message).toBe(INVALID_PARAMS.TOKEN.MESSAGE)
    }
  })

  test('Add schema config - Send request with invalid token', async () => {
    try {
      state.token = uuidv4()

      const configName = faker.name.jobTitle()
      const endpoint = CONFIG.BASE_URL + '/api'
      const token = SCHEMA_ACCESS.TOKEN

      const addSchemaConfig = await SchemaConfig.AddConfig(configName, endpoint, token, state.token)
      console.log('Add schema config: ', JSON.stringify(addSchemaConfig.data, null, 2))
      expect(addSchemaConfig.status).toEqual(401)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(401)
      expect(err.response.data.code).toBe(INVALID.INVALID_TOKEN.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_TOKEN.MESSAGE)
    }
  })
})

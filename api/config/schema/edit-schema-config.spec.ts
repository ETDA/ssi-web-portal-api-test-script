import { CONFIG, INVALID, INVALID_PARAMS, SCHEMA_ACCESS, USER_INFO } from '../../consts'
import { Authen } from '../../authen/authen'
import { SchemaConfig } from './schema-config'
import { v4 as uuidv4 } from 'uuid'

const faker = require('faker')

let getInitState: any = () => ({
  token: '',
  configId: ''
})

describe('Edit schema config', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Edit schema config', async () => {
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
      state.configId = addSchemaConfig.data[0].id

      const newConfigName = faker.name.jobTitle()
      const editSchemaConfig = await SchemaConfig.EditConfig(state.configId, newConfigName, endpoint,
        token, state.token)
      console.log('Edit schema config: ', JSON.stringify(editSchemaConfig.data, null, 2))
      expect(editSchemaConfig.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Edit schema config - Edit endpoint & token', async () => {
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
      state.configId = addSchemaConfig.data[0].id

      const editSchemaConfig = await SchemaConfig.EditConfig(state.configId, configName, endpoint,
        token, state.token)
      console.log('Edit schema config: ', JSON.stringify(editSchemaConfig.data, null, 2))
      expect(editSchemaConfig.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Edit schema config - Send request with not exists endpoint', async () => {
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
      state.configId = addSchemaConfig.data[0].id

      const newEndpoint = CONFIG.BASE_URL + '/abc'
      const editSchemaConfig = await SchemaConfig.EditConfig(state.configId, configName, newEndpoint,
        token, state.token)
      console.log('Edit schema config: ', JSON.stringify(editSchemaConfig.data, null, 2))
      expect(editSchemaConfig.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Edit schema config - Send request with invalid access token', async () => {
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
      state.configId = addSchemaConfig.data[0].id

      const newToken = uuidv4()

      const editSchemaConfig = await SchemaConfig.EditConfig(state.configId, configName, endpoint,
        newToken, state.token)
      console.log('Edit schema config: ', JSON.stringify(editSchemaConfig.data, null, 2))
      expect(editSchemaConfig.status).toEqual(401)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(401)
      expect(err.response.data.code).toBe(INVALID.INVALID_TOKEN.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_TOKEN.MESSAGE)
    }
  })

  test('Edit schema config - Send request without name', async () => {
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
      state.configId = addSchemaConfig.data[0].id

      const editSchemaConfig = await SchemaConfig.EditConfig(state.configId, '', endpoint,
        token, state.token)
      console.log('Edit schema config: ', JSON.stringify(editSchemaConfig.data, null, 2))
      expect(editSchemaConfig.status).toEqual(401)
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

  test('Edit schema config - Send request without endpoint', async () => {
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
      state.configId = addSchemaConfig.data[0].id

      const editSchemaConfig = await SchemaConfig.EditConfig(state.configId, configName, '',
        token, state.token)
      console.log('Edit schema config: ', JSON.stringify(editSchemaConfig.data, null, 2))
      expect(editSchemaConfig.status).toEqual(401)
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

  test('Edit schema config - Send request without access token', async () => {
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
      state.configId = addSchemaConfig.data[0].id

      const editSchemaConfig = await SchemaConfig.EditConfig(state.configId, configName, endpoint,
        '', state.token)
      console.log('Edit schema config: ', JSON.stringify(editSchemaConfig.data, null, 2))
      expect(editSchemaConfig.status).toEqual(401)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(401)
      expect(err.response.data.code).toBe(INVALID.INVALID_TOKEN.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_TOKEN.MESSAGE)
    }
  })

  test('Edit schema config - Send request with invalid token', async () => {
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
      state.configId = addSchemaConfig.data[0].id

      state.token = uuidv4()
      const editSchemaConfig = await SchemaConfig.EditConfig(state.configId, configName, endpoint,
        token, state.token)
      console.log('Edit schema config: ', JSON.stringify(editSchemaConfig.data, null, 2))
      expect(editSchemaConfig.status).toEqual(401)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(401)
      expect(err.response.data.code).toBe(INVALID.INVALID_TOKEN.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_TOKEN.MESSAGE)
    }
  })
})

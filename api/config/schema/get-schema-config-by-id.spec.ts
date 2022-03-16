import { CONFIG, INVALID, SCHEMA_ACCESS, USER_INFO } from '../../consts'
import { Authen } from '../../authen/authen'
import { SchemaConfig } from './schema-config'

const faker = require('faker')
import { v4 as uuidv4 } from 'uuid'

let getInitState: any = () => ({
  token: '',
  repositoryId: ''
})

describe('Get schema config by ID', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Get schema config by ID', async () => {
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

      const getSchemaConfig = await SchemaConfig.GetSchemaConfigsByID(state.configId, state.token)
      console.log('Get schema config by ID: ', JSON.stringify(getSchemaConfig.data, null, 2))
      expect(getSchemaConfig.status).toEqual(200)
      expect(getSchemaConfig.data.name).toBe(configName)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Get schema config by ID - Send request with not exists config_id', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      state.configId = uuidv4()

      const getSchemaConfig = await SchemaConfig.GetSchemaConfigsByID(state.configId, state.token)
      console.log('Get schema config by ID: ', JSON.stringify(getSchemaConfig.data, null, 2))
      expect(getSchemaConfig.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.SCHEMA_NOT_FOUND.CODE)
      expect(err.response.data.message).toBe(INVALID.SCHEMA_NOT_FOUND.MESSAGE)
    }
  })

  test('Get schema config by ID - Send request with invalid token', async () => {
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
      const getSchemaConfig = await SchemaConfig.GetSchemaConfigsByID(state.configId, state.token)
      console.log('Get schema config by ID: ', JSON.stringify(getSchemaConfig.data, null, 2))
      expect(getSchemaConfig.status).toEqual(401)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(401)
      expect(err.response.data.code).toBe(INVALID.INVALID_TOKEN.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_TOKEN.MESSAGE)
    }
  })
})

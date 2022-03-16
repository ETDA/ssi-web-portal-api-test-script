import { GetSchema } from './get'
import { INVALID, USER_INFO } from '../../consts'
import { Authen } from '../../authen/authen'
import { SchemaConfig } from '../../config/schema/schema-config'
import { v4 as uuidv4 } from 'uuid'

let getInitState: any = () => ({
  schemaId: '',
  token: '',
  repositoryId: ''
})

describe('Get schema reference', () => {
  const state = getInitState()
  jest.setTimeout(20000)

  test('Get schema reference', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const getAllSchemaConfig = await SchemaConfig.GetSchemaConfigs(state.token)
      console.log('Get schema config: ', JSON.stringify(getAllSchemaConfig.data, null, 2))
      expect(getAllSchemaConfig.status).toEqual(200)
      state.repositoryId = ''
      for (let i = 0; i < getAllSchemaConfig.data.items.length; i++) {
        if (getAllSchemaConfig.data.items[i].permission == 'READ/WRITE') {
          state.repositoryId = getAllSchemaConfig.data.items[i].id
          break
        }
      }

      state.schemaId = 'b6b96576-d823-40ae-8bff-97ba3884e207'
      const version = '1.0.0'
      const ref = 'Movie.json'

      const getSchemaRef = await GetSchema.Reference(state.repositoryId, state.schemaId, version, ref, state.token)
      console.log('Get schema ref: ', JSON.stringify(getSchemaRef.data, null, 2))
      expect(getSchemaRef.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).not.toBeTruthy()
    }
  })

  test('Get schema reference - Send request with incorrect repository_id', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      state.schemaId = 'b6b96576-d823-40ae-8bff-97ba3884e207'
      const version = '1.0.0'
      const ref = 'Movie.json'

      state.repositoryId = uuidv4()

      const getSchemaRef = await GetSchema.Reference(state.repositoryId, state.schemaId, version, ref, state.token)
      console.log('Get schema ref: ', JSON.stringify(getSchemaRef.data, null, 2))
      expect(getSchemaRef.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.SCHEMA_NOT_FOUND.CODE)
      expect(err.response.data.message).toBe(INVALID.SCHEMA_NOT_FOUND.MESSAGE)
    }
  })

  test('Get schema reference - Send request with incorrect schema_id', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const getAllSchemaConfig = await SchemaConfig.GetSchemaConfigs(state.token)
      console.log('Get schema config: ', JSON.stringify(getAllSchemaConfig.data, null, 2))
      expect(getAllSchemaConfig.status).toEqual(200)
      state.repositoryId = ''
      for (let i = 0; i < getAllSchemaConfig.data.items.length; i++) {
        if (getAllSchemaConfig.data.items[i].permission == 'READ/WRITE') {
          state.repositoryId = getAllSchemaConfig.data.items[i].id
          break
        }
      }

      const version = '1.0.0'
      const ref = 'Movie.json'
      state.schemaId = uuidv4()

      const getSchemaRef = await GetSchema.Reference(state.repositoryId, state.schemaId, version, ref, state.token)
      console.log('Get schema ref: ', JSON.stringify(getSchemaRef.data, null, 2))
      expect(getSchemaRef.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })

  test('Get schema reference - Send request with incorrect version', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const getAllSchemaConfig = await SchemaConfig.GetSchemaConfigs(state.token)
      console.log('Get schema config: ', JSON.stringify(getAllSchemaConfig.data, null, 2))
      expect(getAllSchemaConfig.status).toEqual(200)
      state.repositoryId = ''
      for (let i = 0; i < getAllSchemaConfig.data.items.length; i++) {
        if (getAllSchemaConfig.data.items[i].permission == 'READ/WRITE') {
          state.repositoryId = getAllSchemaConfig.data.items[i].id
          break
        }
      }

      state.schemaId = 'b6b96576-d823-40ae-8bff-97ba3884e207'
      const version = '3.0.3'
      const ref = 'Movie.json'

      const getSchemaRef = await GetSchema.Reference(state.repositoryId, state.schemaId, version, ref, state.token)
      console.log('Get schema ref: ', JSON.stringify(getSchemaRef.data, null, 2))
      expect(getSchemaRef.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})

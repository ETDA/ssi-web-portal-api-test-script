import { SchemaBody } from '../schema-body'
import { Schema } from '../schema'
import { GetSchema } from './get'
import { v4 as uuidv4 } from 'uuid'
import { INVALID, USER_INFO } from '../../consts'
import { Authen } from '../../authen/authen'
import { SchemaConfig } from '../../config/schema/schema-config'

const faker = require('faker')

let getInitState: any = () => ({
  schemaId: '',
  token: '',
  repositoryId: '',
  schemaBody: ''
})

describe('Get json schema', () => {
  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Get json schema', async () => {
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

      const schemaName = faker.name.title()
      const schemaType = faker.name.firstName() + `'sDocument` + '_Type'
      const schemabodyDesc = faker.name.jobTitle()
      const schemaBodyType = 'object'
      const schemaBodyProperties = {
        'example_string': {
          'type': 'string',
          'alias': 'Text'
        }
      }
      const schemaRequired = ['example_string']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaType, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(state.repositoryId, schemaName, schemaType, schemaBody, state.token)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      // expect(createSchema.status).toEqual(201)
      state.schemaId = createSchema.data.id
      state.schemaBody = createSchema.data.schema_body

      const getJsonSchema = await GetSchema.Json(state.repositoryId, state.schemaId, '1.0.0', state.token)
      console.log('Get Json schema: ', JSON.stringify(getJsonSchema.data, null, 2))
      expect(getJsonSchema.status).toEqual(200)
      expect(getJsonSchema.data).toMatchObject(state.schemaBody)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Get json schema - Send request with incorrect repository_id', async () => {
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

      const schemaName = faker.name.title()
      const schemaType = faker.name.firstName() + `'sDocument` + '_Type'
      const schemabodyDesc = faker.name.jobTitle()
      const schemaBodyType = 'object'
      const schemaBodyProperties = {
        'example_string': {
          'type': 'string',
          'alias': 'Text'
        }
      }
      const schemaRequired = ['example_string']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaType, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(state.repositoryId, schemaName, schemaType, schemaBody, state.token)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      // expect(createSchema.status).toEqual(201)
      state.schemaId = createSchema.data.id

      const newSchemaName = schemaName + '_Update'
      const newSchemaDesc = schemabodyDesc + '_Update'
      const newSchemaBodyProperties = {
        'example_data': {
          'type': 'string'
        }
      }
      const newShemaRequired = ['example_data']
      const newAdditional = true
      const newVersion = '1.0.1'

      const newSchemabody = SchemaBody.Message(newSchemaName, newSchemaDesc, schemaBodyType,
        newSchemaBodyProperties, newShemaRequired, newAdditional)
      console.log('New SchemaBody: ', JSON.stringify(newSchemabody, null, 2))

      const updateSchema = await Schema.Update(state.repositoryId, state.schemaId, newSchemaName,
        schemaType, newSchemabody, newVersion, state.token)
      console.log('Update Schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(200)

      state.repositoryId = uuidv4()

      const getSchemaVersion = await GetSchema.Json(state.repositoryId, state.schemaId,
        '1.0.0', state.token)
      console.log('Get Schema Version: ', JSON.stringify(getSchemaVersion.data, null, 2))
      expect(getSchemaVersion.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.SCHEMA_NOT_FOUND.CODE)
      expect(err.response.data.message).toBe(INVALID.SCHEMA_NOT_FOUND.MESSAGE)
    }
  })

  test('Get json schema - Send request with incorrect schema_id', async () => {
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

      state.schemaId = uuidv4()

      const getSchemaVersion = await GetSchema.Json(state.repositoryId, state.schemaId,
        '1.0.0', state.token)
      console.log('Get Schema Version: ', JSON.stringify(getSchemaVersion.data, null, 2))
      expect(getSchemaVersion.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })

  test('Get json schema - Send request with incorrect version', async () => {
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

      const schemaName = faker.name.title()
      const schemaType = faker.name.firstName() + `'sDocument` + '_Type'
      const schemabodyDesc = faker.name.jobTitle()
      const schemaBodyType = 'object'
      const schemaBodyProperties = {
        'example_string': {
          'type': 'string',
          'alias': 'Text'
        }
      }
      const schemaRequired = ['example_string']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaType, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(state.repositoryId, schemaName, schemaType, schemaBody, state.token)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      // expect(createSchema.status).toEqual(201)
      state.schemaId = createSchema.data.id

      const version = '1.0.3'

      const getSchemaVersion = await GetSchema.Json(state.repositoryId, state.schemaId,
        version, state.token)
      console.log('Get Schema Version: ', JSON.stringify(getSchemaVersion.data, null, 2))
      expect(getSchemaVersion.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})

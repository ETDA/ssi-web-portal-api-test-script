import { SchemaBody } from '../schema-body'
import { Schema } from '../schema'
import { GetSchema } from './get'

const faker = require('faker')
import { v4 as uuidv4 } from 'uuid'
import { INVALID, USER_INFO } from '../../consts'
import { Authen } from '../../authen/authen'
import { SchemaConfig } from '../../config/schema/schema-config'

let getInitState: any = () => ({
  schemaId: '',
  token: '',
  repositoryId: ''
})

describe('Get schema by ID', () => {
  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Get schema by ID', async () => {
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

      const getSchemabyId = await GetSchema.ById(state.repositoryId, state.schemaId, state.token)
      console.log('Get schema by ID: ', JSON.stringify(getSchemabyId.data, null, 2))
      expect(getSchemabyId.status).toEqual(200)
      expect(getSchemabyId.data.id).toBe(state.schemaId)
      expect(getSchemabyId.data.schema_name).toBe(schemaName)
      expect(getSchemabyId.data.schema_type).toBe(schemaType)
      expect(getSchemabyId.data.schema_body.description).toBe(schemabodyDesc)
      expect(getSchemabyId.data.schema_body.additionalProperties).toBe(additional)
      expect(getSchemabyId.data.version).toBe('1.0.0')
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Get schema by ID in repository - Send request with incorrect repository_id', async () => {
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

      state.repositoryId = uuidv4()

      const getSchemabyId = await GetSchema.ById(state.repositoryId, state.schemaId, state.token)
      console.log('Get schema by ID: ', JSON.stringify(getSchemabyId.data, null, 2))
      expect(getSchemabyId.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.SCHEMA_NOT_FOUND.CODE)
      expect(err.response.data.message).toBe(INVALID.SCHEMA_NOT_FOUND.MESSAGE)
    }
  })

  test('Get schema by ID in repository - Send request with incorrect schema_id', async () => {
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

      const getSchemabyId = await GetSchema.ById(state.repositoryId, state.schemaId, state.token)
      console.log('Get schema by ID: ', JSON.stringify(getSchemabyId.data, null, 2))
      expect(getSchemabyId.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})

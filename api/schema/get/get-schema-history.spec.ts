import { Schema } from '../schema'
import { SchemaBody } from '../schema-body'
import { GetSchema } from './get'
import { v4 as uuidv4 } from 'uuid'
import { INVALID, USER_INFO } from '../../consts'
import { Authen } from '../../authen/authen'
import { SchemaConfig } from '../../config/schema/schema-config'

const faker = require('faker')

let getInitState: any = () => ({
  schemaId: '',
  token: '',
  repositoryId: ''
})

describe('Get schema history', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Get schema history', async () => {
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

      const getSchemaHistory = await GetSchema.HistoryById(state.repositoryId, state.schemaId, state.token)
      console.log('Get Schema History: ', JSON.stringify(getSchemaHistory.data, null, 2))
      expect(getSchemaHistory.status).toEqual(200)
      expect(getSchemaHistory.data[0].id).toBe(state.schemaId)
      expect(getSchemaHistory.data[0].schema_name).toBe(schemaName)
      expect(getSchemaHistory.data[0].schema_type).toBe(schemaType)
      expect(getSchemaHistory.data[0].schema_body.description).toBe(schemabodyDesc)
      expect(getSchemaHistory.data[0].schema_body.additionalProperties).toBe(additional)
      expect(getSchemaHistory.data[0].version).toBe('1.0.0')
      expect(getSchemaHistory.data[1].id).toBe(state.schemaId)
      expect(getSchemaHistory.data[1].schema_name).toBe(schemaName)
      expect(getSchemaHistory.data[1].schema_type).toBe(schemaType)
      expect(getSchemaHistory.data[1].schema_body.description).toBe(newSchemaDesc)
      expect(getSchemaHistory.data[1].schema_body.additionalProperties).toBe(newAdditional)
      expect(getSchemaHistory.data[1].version).toBe(newVersion)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Get schema history - Send request with incorrect repository_id', async () => {
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

      const getSchemaHistory = await GetSchema.HistoryById(state.repositoryId, state.schemaId, state.token)
      console.log('Get Schema History: ', JSON.stringify(getSchemaHistory.data, null, 2))
      expect(getSchemaHistory.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.SCHEMA_NOT_FOUND.CODE)
      expect(err.response.data.message).toBe(INVALID.SCHEMA_NOT_FOUND.MESSAGE)
    }
  })

  test('Get schema history - Send request with incorrect schema_id', async () => {
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

      const getSchemaHistory = await GetSchema.HistoryById(state.repositoryId, state.schemaId, state.token)
      console.log('Get Schema History: ', JSON.stringify(getSchemaHistory.data, null, 2))
      expect(getSchemaHistory.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})

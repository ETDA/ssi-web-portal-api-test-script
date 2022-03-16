import { SchemaBody } from '../schema-body'
import { Schema } from '../schema'
import { GetSchema } from './get'
import { INVALID, USER_INFO } from '../../consts'
import { Authen } from '../../authen/authen'
import { SchemaConfig } from '../../config/schema/schema-config'
import { v4 as uuidv4 } from 'uuid'

const faker = require('faker')

let getInitState: any = () => ({
  schemaId: '',
  token: '',
  repositoryId: ''
})

describe('Get all schema', () => {
  const state = getInitState()
  jest.setTimeout(20000)

  test('Get all schema', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token
      //
      // const configName = faker.name.jobTitle()
      // const endpoint = CONFIG.BASE_URL
      // const token = uuidv4()
      //
      // const addSchemaConfig = await SchemaConfig.AddConfig(configName, endpoint, token, state.token)
      // console.log('Add schema config: ', JSON.stringify(addSchemaConfig.data, null, 2))
      // expect(addSchemaConfig.status).toEqual(200)
      // state.repositoryId = addSchemaConfig.data.repository_id

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

      const getAllSchemas = await GetSchema.All(state.repositoryId, state.token)
      console.log('Get all schema: ', JSON.stringify(getAllSchemas.data, null, 2))
      expect(getAllSchemas.status).toEqual(200)
      expect(getAllSchemas.data.items[0].id).toBe(state.schemaId)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Get all schema in repository - Send request with incorrect repository_id', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      state.repositoryId = uuidv4()

      const getAllSchemas = await GetSchema.All(state.repositoryId, state.token)
      console.log('Get all schema: ', JSON.stringify(getAllSchemas.data, null, 2))
      expect(getAllSchemas.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.SCHEMA_NOT_FOUND.CODE)
      expect(err.response.data.message).toBe(INVALID.SCHEMA_NOT_FOUND.MESSAGE)
    }
  })
})

import { SchemaBody } from '../schema-body'
import { Schema } from '../schema'
import { GetSchema } from './get'
import { INVALID, USER_INFO } from '../../consts'
import { Authen } from '../../authen/authen'
import { v4 as uuidv4 } from 'uuid'
import { SchemaConfig } from '../../config/schema/schema-config'
const faker = require('faker')

let getInitState: any = () => ({
  schemaId: '',
  token: '',
  repositoryId: ''
})

describe('Get schema type',()=>{
  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Get schema type', async () => {
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

      const getSchemaType = await GetSchema.Type(state.repositoryId,state.token)
      console.log('Get all schema: ', JSON.stringify(getSchemaType.data, null, 2))
      expect(getSchemaType.status).toEqual(200)
      expect(getSchemaType.data.types).toContain(schemaType)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Get schema type - Send request with incorrect repository_id', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      state.repositoryId = uuidv4()

      const getSchemaType = await GetSchema.Type(state.repositoryId,state.token)
      console.log('Get all schema: ', JSON.stringify(getSchemaType.data, null, 2))
      expect(getSchemaType.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.SCHEMA_NOT_FOUND.CODE)
      expect(err.response.data.message).toBe(INVALID.SCHEMA_NOT_FOUND.MESSAGE)
    }
  })
})

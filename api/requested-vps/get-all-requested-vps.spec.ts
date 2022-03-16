import { USER_INFO } from '../consts'
import { Authen } from '../authen/authen'
import { SchemaConfig } from '../config/schema/schema-config'
import { SchemaBody } from '../schema/schema-body'
import { Schema } from '../schema/schema'
import { RequestedVPs } from './requested-vps'

const faker = require('faker')

let getInitState: any = () => ({
  token: '',
  repositoryId: '',
  schemaId: '',
  fullSchemaId: '',
  requestedId:'',
  holder: '',
  data: {
    did: '',
    nonce: ''
  },
  didKey1: []
})

describe('Get all requested VPs', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Get all requested VPs', async () => {
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
      expect(createSchema.status).toEqual(201)
      state.fullSchemaId = createSchema.data.schema_body['$id']

      const requestName = faker.name.title()
      const createRequestedVp = await RequestedVPs.Create(requestName, schemaType, state.token)
      console.log('Create Requested VP: ', JSON.stringify(createRequestedVp.data, null, 2))
      expect(createRequestedVp.status).toEqual(201)
      expect(createRequestedVp.data.name).toBe(requestName)
      state.requestedId = createRequestedVp.data.id

      const getAllRequestedVp = await RequestedVPs.GetAllRequested(state.token)
      console.log('Get all Requested VP: ', JSON.stringify(getAllRequestedVp.data, null, 2))
      expect(getAllRequestedVp.status).toEqual(200)
      expect(getAllRequestedVp.data.items[0].id).toBe(state.requestedId)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })
})

import { SchemaBody } from './schema-body'
import { Schema } from './schema'
import { ERR_REQUIRE, INVALID, INVALID_PARAMS, USER_INFO } from '../consts'
import { v4 as uuidv4 } from 'uuid'
import { Authen } from '../authen/authen'
import { SchemaConfig } from '../config/schema/schema-config'

const faker = require('faker')

let getInitState: any = () => ({
  token: '',
  repositoryId: '',
  schemaId: ''
})

describe('Schema update', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Update schema - Update schema_name, schema_body, version', async () => {
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
      expect(updateSchema.data.id).toBe(state.schemaId)
      expect(updateSchema.data.schema_name).toBe(schemaName)
      expect(updateSchema.data.schema_type).toBe(schemaType)
      expect(updateSchema.data.schema_body.description).toBe(newSchemaDesc)
      expect(updateSchema.data.schema_body.additionalProperties).toBe(newAdditional)
      expect(updateSchema.data.version).toBe(newVersion)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Update schema - Update without schema_name', async () => {
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
          'type': 'string'
        }
      }
      const schemaRequired = ['example_string']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaName, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(state.repositoryId, schemaName, schemaType, schemaBody, state.token)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      // expect(createSchema.status).toEqual(201)
      state.schemaId = createSchema.data.id

      const newSchemaName = ''
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
      expect(updateSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields['schema_name'].code).toBe(ERR_REQUIRE.SCHEMA_NAME.CODE)
      expect(err.response.data.fields['schema_name'].message).toBe(ERR_REQUIRE.SCHEMA_NAME.MESSAGE)
    }
  })

  test('Update schema - Update without schema_body', async () => {
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
          'type': 'string'
        }
      }
      const schemaRequired = ['example_string']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaName, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(state.repositoryId, schemaName, schemaType, schemaBody, state.token)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      // expect(createSchema.status).toEqual(201)
      state.schemaId = createSchema.data.id

      const newSchemaName = schemaName + '_Update'
      const newVersion = '1.0.1'

      const updateSchema = await Schema.Update(state.repositoryId, state.schemaId, newSchemaName,
        schemaType, '', newVersion, state.token)
      console.log('Update Schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields['schema_body.$schema'].code).toBe(ERR_REQUIRE.SCHEMA_BODY.CODE)
      expect(err.response.data.fields['schema_body.$schema'].message).toBe(ERR_REQUIRE.SCHEMA_BODY.MESSAGE)
    }
  })

  test('Update schema - Update without schema_type', async () => {
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
          'type': 'string'
        }
      }
      const schemaRequired = ['example_string']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaName, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
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
        '', newSchemabody, newVersion, state.token)
      console.log('Update Schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Update schema - Update properties array type to object type', async () => {
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
        'example_array': {
          'description': 'This is an example array',
          'type': 'array',
          'minItems': 1,
          'items': {
            'type': 'string'
          }
        }
      }
      const schemaRequired = ['example_array']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaName, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(state.repositoryId, schemaName, schemaType, schemaBody, state.token)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      // expect(createSchema.status).toEqual(201)
      state.schemaId = createSchema.data.id

      const newSchemaName = schemaName + '_Update'
      const newSchemaDesc = schemabodyDesc + '_Update'
      const newSchemaBodyProperties = {
        'example_array': {
          'type': 'object',
          'properties': {
            'text1': {
              'type': 'number'
            }
          }
        }
      }
      const newShemaRequired = ['example_array']
      const newAdditional = true
      const newVersion = '1.0.1'

      const newSchemabody = SchemaBody.Message(newSchemaName, newSchemaDesc, schemaBodyType,
        newSchemaBodyProperties, newShemaRequired, newAdditional)
      console.log('New SchemaBody: ', JSON.stringify(newSchemabody, null, 2))

      const updateSchema = await Schema.Update(state.repositoryId, state.schemaId, newSchemaName,
        schemaType, newSchemabody, newVersion, state.token)
      console.log('Update Schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Update schema - Update schema_body required to required more than one fields', async () => {
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
        'example_array': {
          'description': 'This is an example array',
          'type': 'array',
          'minItems': 1,
          'items': {
            'type': 'string'
          }
        },
        'example_object': {
          'type': 'object',
          'properties': {
            'text1': {
              'type': 'number'
            }
          }
        }
      }
      const schemaRequired = ['example_array']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaName, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(state.repositoryId, schemaName, schemaType, schemaBody, state.token)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      // expect(createSchema.status).toEqual(201)
      state.schemaId = createSchema.data.id

      const newSchemaName = schemaName + '_Update'
      const newSchemaDesc = schemabodyDesc + '_Update'
      const newSchemaBodyProperties = {
        'example_array': {
          'description': 'This is an example array',
          'type': 'array',
          'minItems': 1,
          'items': {
            'type': 'string'
          }
        },
        'example_object': {
          'type': 'object',
          'properties': {
            'text1': {
              'type': 'number'
            }
          }
        }
      }
      const newShemaRequired = ['example_array', 'example_object']
      const newAdditional = true
      const newVersion = '1.0.1'

      const newSchemabody = SchemaBody.Message(newSchemaName, newSchemaDesc, schemaBodyType,
        newSchemaBodyProperties, newShemaRequired, newAdditional)
      console.log('New SchemaBody: ', JSON.stringify(newSchemabody, null, 2))

      const updateSchema = await Schema.Update(state.repositoryId, state.schemaId, newSchemaName,
        schemaType, newSchemabody, newVersion, state.token)
      console.log('Update Schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Update schema - Update with incorrect version format', async () => {
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
          'type': 'string'
        }
      }
      const schemaRequired = ['example_string']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaName, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
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
      const newVersion = 'v1.0.1'

      const newSchemabody = SchemaBody.Message(newSchemaName, newSchemaDesc, schemaBodyType,
        newSchemaBodyProperties, newShemaRequired, newAdditional)
      console.log('New SchemaBody: ', JSON.stringify(newSchemabody, null, 2))

      const updateSchema = await Schema.Update(state.repositoryId, state.schemaId, newSchemaName, schemaType, newSchemabody, newVersion, state.token)
      console.log('Update Schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields['schema_body.version'].code).toBe(INVALID_PARAMS.VERSION_DISALLOWED.CODE)
      expect(err.response.data.fields['schema_body.version'].message).toBe(INVALID_PARAMS.VERSION_DISALLOWED.MESSAGE)
    }
  })

  test('Update schema - Update without version', async () => {
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
          'type': 'string'
        }
      }
      const schemaRequired = ['example_string']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaName, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
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
      const newVersion = ''

      const newSchemabody = SchemaBody.Message(newSchemaName, newSchemaDesc, schemaBodyType,
        newSchemaBodyProperties, newShemaRequired, newAdditional)
      console.log('New SchemaBody: ', JSON.stringify(newSchemabody, null, 2))

      const updateSchema = await Schema.Update(state.repositoryId, state.schemaId, newSchemaName, schemaType, newSchemabody, newVersion, state.token)
      console.log('Update Schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.version.code).toBe(ERR_REQUIRE.SCHEMA_VERSION.CODE)
      expect(err.response.data.fields.version.message).toBe(ERR_REQUIRE.SCHEMA_VERSION.MESSAGE)
    }
  })

  test('Update schema - Update with lower version', async () => {
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
          'type': 'string'
        }
      }
      const schemaRequired = ['example_string']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaName, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
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
      const newVersion = '0.0.1'

      const newSchemabody = SchemaBody.Message(newSchemaName, newSchemaDesc, schemaBodyType,
        newSchemaBodyProperties, newShemaRequired, newAdditional)
      console.log('New SchemaBody: ', JSON.stringify(newSchemabody, null, 2))

      const updateSchema = await Schema.Update(state.repositoryId, state.schemaId, newSchemaName, schemaType, newSchemabody, newVersion, state.token)
      console.log('Update Schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields['schema_body.version'].code).toBe(INVALID_PARAMS.SCHEMA_VERSION_UPDATE.CODE)
      expect(err.response.data.fields['schema_body.version'].message).toBe(INVALID_PARAMS.SCHEMA_VERSION_UPDATE.MESSAGE)
    }
  })

  test('Update schema - Update with skip version', async () => {
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
          'type': 'string'
        }
      }
      const schemaRequired = ['example_string']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaName, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
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
      const newVersion = '3.0.1'

      const newSchemabody = SchemaBody.Message(newSchemaName, newSchemaDesc, schemaBodyType,
        newSchemaBodyProperties, newShemaRequired, newAdditional)
      console.log('New SchemaBody: ', JSON.stringify(newSchemabody, null, 2))

      const updateSchema = await Schema.Update(state.repositoryId, state.schemaId, newSchemaName, schemaType, newSchemabody, newVersion, state.token)
      console.log('Update Schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields['schema_body.version'].code).toBe(INVALID_PARAMS.VERSION_DISALLOWED.CODE)
      expect(err.response.data.fields['schema_body.version'].message).toBe(INVALID_PARAMS.VERSION_DISALLOWED.MESSAGE)
    }
  })

  test('Update schema - Update with incorrect schema_id', async () => {
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
          'type': 'string'
        }
      }
      const schemaRequired = ['example_string']
      const additional = false

      const schemaBody = SchemaBody.Message(schemaName, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
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

      const dummySchemaId = uuidv4()
      const updateSchema = await Schema.Update(state.repositoryId, dummySchemaId, newSchemaName, schemaType, newSchemabody, newVersion, state.token)
      console.log('Update Schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })

  test('Update schema - Send request with incorrect repository_id', async () => {
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

      state.repositoryId = uuidv4()

      const updateSchema = await Schema.Update(state.repositoryId, state.schemaId, newSchemaName,
        schemaType, newSchemabody, newVersion, state.token)
      console.log('Update Schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.SCHEMA_NOT_FOUND.CODE)
      expect(err.response.data.message).toBe(INVALID.SCHEMA_NOT_FOUND.MESSAGE)
    }
  })

  test('Update schema - Send request with invalid token', async () => {
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

      state.token = uuidv4()
      const updateSchema = await Schema.Update(state.repositoryId, state.schemaId, newSchemaName,
        schemaType, newSchemabody, newVersion, state.token)
      console.log('Update Schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(401)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(401)
      expect(err.response.data.code).toBe(INVALID.INVALID_TOKEN.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_TOKEN.MESSAGE)
    }
  })
})

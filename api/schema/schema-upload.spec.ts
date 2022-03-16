import { Schema } from './schema'
import * as fs from 'fs'
import FormData from 'form-data'
import { INVALID, INVALID_PARAMS, USER_INFO } from '../consts'
import { Authen } from '../authen/authen'
import { SchemaConfig } from '../config/schema/schema-config'
import { v4 as uuidv4 } from 'uuid'

let getInitState: any = () => ({
  keyId: '',
  schemaId: '',
  didKey1: [],
  didKey2: [],
  didKey3: [],
  didKey4: [],
  data: {
    did: '',
    nonce: ''
  },
  didId: ''
})

describe('Schema upload', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Upload schema', async () => {
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

      let formData = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01.zip`)
      formData.append('file', files)
      const uploadSchema = await Schema.Upload(state.repositoryId, formData, state.token)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(201)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).not.toBeTruthy()
    }
  })

  test('Upload VC Schema - Upload incorrect file type', async () => {
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

      let formData = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/MessageInfo.json`)
      formData.append('file', files)
      const uploadSchema = await Schema.Upload(state.repositoryId, formData, state.token)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.SCHEMA_FILE_TYPE.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.SCHEMA_FILE_TYPE.MESSAGE)
    }
  })

  test('Upload VC Schema - Upload incomplete file', async () => {
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

      let formData = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01-incomplete.zip`)
      formData.append('file', files)
      const uploadSchema = await Schema.Upload(state.repositoryId, formData, state.token)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Upload VC Schema - Upload without file', async () => {
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

      let formData = new FormData()
      // const files = fs.createReadStream(process.cwd() + `/api/schema-file/JsonSchema-incomplete.zip`)
      formData.append('file', '')
      const uploadSchema = await Schema.Upload(state.repositoryId, formData, state.token)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Upload schema - Send request with incorrect repository_id', async () => {
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

      state.repositoryId = uuidv4()
      let formData = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01.zip`)
      formData.append('file', files)
      const uploadSchema = await Schema.Upload(state.repositoryId, formData, state.token)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(201)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.SCHEMA_NOT_FOUND.CODE)
      expect(err.response.data.message).toBe(INVALID.SCHEMA_NOT_FOUND.MESSAGE)
    }
  })

  test('Upload schema - Send request with invalid token', async () => {
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

      state.token = uuidv4()
      let formData = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01.zip`)
      formData.append('file', files)
      const uploadSchema = await Schema.Upload(state.repositoryId, formData, state.token)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(401)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(401)
      expect(err.response.data.code).toBe(INVALID.INVALID_TOKEN.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_TOKEN.MESSAGE)
    }
  })
})


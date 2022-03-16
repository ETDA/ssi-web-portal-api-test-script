import { Schema } from './schema'
import * as fs from 'fs'
import FormData from 'form-data'
import { INVALID, INVALID_PARAMS, USER_INFO } from '../consts'
import { v4 as uuidv4 } from 'uuid'
import { Authen } from '../authen/authen'
import { SchemaConfig } from '../config/schema/schema-config'

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

describe('Update schema by upload', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Update schema by upload', async () => {
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
      // expect(uploadSchema.status).toEqual(201)
      state.schemaId = uploadSchema.data[0].id

      let formData2 = new FormData()
      const updateFiles = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01-update.zip`)
      formData2.append('file', updateFiles)
      const updateSchema = await Schema.UploadUpdate(state.repositoryId, state.schemaId, formData2, state.token)
      console.log('Update schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).not.toBeTruthy()
    }
  })

  test('Update schema by upload - Upload with invalid version', async () => {
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

      let formData1 = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01.zip`)
      formData1.append('file', files)
      const uploadSchema = await Schema.Upload(state.repositoryId, formData1, state.token)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      // expect(uploadSchema.status).toEqual(201)
      state.schemaId = uploadSchema.data[0].id

      let formData2 = new FormData()
      const updateFiles = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01-update.zip`)
      formData2.append('file', updateFiles)
      const updateSchema = await Schema.UploadUpdate(state.repositoryId, state.schemaId, formData2, state.token)
      console.log('Update schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Update schema by upload - Upload with not created schema', async () => {
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
      let formData = new FormData()
      const files = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01-update.zip`)
      formData.append('file', files)
      const uploadSchema = await Schema.UploadUpdate(state.repositoryId, state.schemaId, formData, state.token)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      expect(uploadSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Update schema by upload - Upload incorrect file type', async () => {
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

      let formData1 = new FormData()
      const files1 = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01.zip`)
      formData1.append('file', files1)
      const uploadSchema = await Schema.Upload(state.repositoryId, formData1, state.token)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      // expect(uploadSchema.status).toEqual(201)
      state.schemaId = uploadSchema.data[0].id

      let formData = new FormData()
      const files2 = fs.createReadStream(process.cwd() + `/api/schema-file/MessageInfo.json`)
      formData.append('file', files2)
      const updateSchema = await Schema.UploadUpdate(state.repositoryId, state.schemaId, formData, state.token)
      console.log('Update schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.SCHEMA_FILE_TYPE.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.SCHEMA_FILE_TYPE.MESSAGE)
    }
  })

  test('Update schema by upload - Upload incomplete file', async () => {
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

      let formData1 = new FormData()
      const files1 = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01.zip`)
      formData1.append('file', files1)
      const uploadSchema = await Schema.Upload(state.repositoryId, formData1, state.token)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      // expect(uploadSchema.status).toEqual(201)
      state.schemaId = uploadSchema.data[0].id

      let formData2 = new FormData()
      const files2 = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01-update-incomplete.zip`)
      formData2.append('file', files2)
      const updateSchema = await Schema.UploadUpdate(state.repositoryId, state.schemaId, formData2, state.token)
      console.log('Update schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Update schema by upload - Send request without file', async () => {
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

      let formData1 = new FormData()
      const files1 = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01.zip`)
      formData1.append('file', files1)
      const uploadSchema = await Schema.Upload(state.repositoryId, formData1, state.token)
      console.log('Upload schema: ', JSON.stringify(uploadSchema.data, null, 2))
      // expect(uploadSchema.status).toEqual(201)
      state.schemaId = uploadSchema.data[0].id

      let formData2 = new FormData()
      formData2.append('file', '')
      const updateSchema = await Schema.UploadUpdate(state.repositoryId, state.schemaId, formData2, state.token)
      console.log('Update schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.NO_SCHEMA_FILE.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.NO_SCHEMA_FILE.MESSAGE)
    }
  })

  test('Update schema by upload - Send request with incorrect repository_id', async () => {
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
      // expect(uploadSchema.status).toEqual(201)
      state.schemaId = uploadSchema.data[0].id

      state.repositoryId = uuidv4()

      let formData2 = new FormData()
      const updateFiles = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01-update.zip`)
      formData2.append('file', updateFiles)
      const updateSchema = await Schema.UploadUpdate(state.repositoryId, state.schemaId, formData2, state.token)
      console.log('Update schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.SCHEMA_NOT_FOUND.CODE)
      expect(err.response.data.message).toBe(INVALID.SCHEMA_NOT_FOUND.MESSAGE)
    }
  })

  test('Update schema by upload - Send request with invalid token', async () => {
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
      // expect(uploadSchema.status).toEqual(201)
      state.schemaId = uploadSchema.data[0].id

      state.token = uuidv4()

      let formData2 = new FormData()
      const updateFiles = fs.createReadStream(process.cwd() + `/api/schema-file/SchemaDemo01-update.zip`)
      formData2.append('file', updateFiles)
      const updateSchema = await Schema.UploadUpdate(state.repositoryId, state.schemaId, formData2, state.token)
      console.log('Update schema: ', JSON.stringify(updateSchema.data, null, 2))
      expect(updateSchema.status).toEqual(401)
    } catch (err) {
      console.log(err.response)
      // console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(401)
      expect(err.response.data.code).toBe(INVALID.INVALID_TOKEN.CODE)
      expect(err.response.data.message).toBe(INVALID.INVALID_TOKEN.MESSAGE)
    }
  })
})


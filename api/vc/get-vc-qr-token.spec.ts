import { KEY_TYPE, USER_INFO } from '../consts'
import { Authen } from '../authen/authen'
import { v4 as uuidv4 } from 'uuid'
import { VCs } from './vc'
import { DID } from '../did-register'
import { SchemaConfig } from '../config/schema/schema-config'
import { SchemaBody } from '../schema/schema-body'
import { Schema } from '../schema/schema'
const faker = require('faker')

let getInitState: any = () => ({
  token: '',
  cid: '',
  repositoryId: '',
  schemaId: '',
  fullSchemaId: '',
  holder: '',
  data: {
    did: '',
    nonce: ''
  },
  didKey1: []
})

describe('Get VC QR Token', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Get VC QR Token', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      expect(didRegister.request.status).toEqual(201)
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1

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

      const credentialSubject = {
        'example_string': 'Testing'
      }
      const createVc = await VCs.Create(state.fullSchemaId, schemaName, schemaType, '',
        state.data.did, credentialSubject, state.token)
      console.log('Create VC: ', JSON.stringify(createVc.data, null, 2))
      state.cid = createVc.data.cid

      const cids = [state.cid]
      const createVcQr = await VCs.GenQR(cids, state.data.did, state.token)
      console.log('Create VC QR: ', JSON.stringify(createVcQr.data, null, 2))
      expect(createVcQr.status).toEqual(200)
      state.qrToken = createVcQr.data.token
      state.endpoint = createVcQr.data.endpoint

      const qrToken = await VCs.QRToken(state.qrToken, state.endpoint, state.didKey1)
      console.log('QR Token: ', JSON.stringify(qrToken.data, null, 2))
      expect(qrToken.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Get VC QR Token - Send request with invalid QR token', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      expect(didRegister.request.status).toEqual(201)
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1

      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      state.qrToken = uuidv4()
      const qrToken = await VCs.QRToken(state.qrToken, state.token, state.didKey1)
      console.log('QR Token: ', JSON.stringify(qrToken.data, null, 2))
      expect(qrToken.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})

import { v4 as uuidv4 } from 'uuid'
import { DID } from '../../did-register'
import { ERR_REQUIRE, ID_INFO, INVALID_PARAMS, KEY_TYPE, USER_INFO, VC_STATUS } from '../../consts'
import { Mobile } from '../../material/mobile'
import { UserDID } from '../../material/update-user-did'
import { Token } from '../../material/token'
import { DIDDoc } from '../../material/doc'
import { SchemaConfig } from '../../config/schema/schema-config'
import { Authen } from '../../authen/authen'
import { Schema } from '../../schema/schema'
import { SchemaBody } from '../../schema/schema-body'
import { DIDNonce } from '../../material/nonce'
import { VC } from '../../material/vc'
import { SignVC } from './sign-vc'
import { VCs } from '../vc'
import { VCStatus } from '../../material/status'

const thaiIdCard = require('thai-id-card')
const faker = require('faker')

let getInitState: any = () => ({
  didKey1: [],
  didKey2: [],
  didKey3: [],
  issuerKey1: [],
  schemaId: '',
  issuanceDate: '',
  data: {
    did: '',
    nonce: ''
  },
  token: '',
  repositoryId: ''
})

describe('Reject VC', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Reject VC', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      expect(didRegister.request.status).toEqual(201)
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1

      state.idCardNo = thaiIdCard.generate()
      state.firstName = faker.name.firstName()
      state.lastName = faker.name.lastName()
      state.dateOfBirth = ID_INFO.DATE_OF_BIRTH.CORRECT
      state.laserId = ID_INFO.LASER_ID.CORRECT
      state.email = faker.internet.email()
      state.uuid = uuidv4()

      const registerMobile = await Mobile.Register(state.didKey1, state.idCardNo, state.firstName,
        state.lastName, state.dateOfBirth, state.laserId, state.email, state.uuid)
      console.log('Register Mobile: ', JSON.stringify(registerMobile.data, null, 2))
      expect(registerMobile.status).toEqual(201)
      state.userId = registerMobile.data.user_id

      const updateDid = await UserDID.Update(state.data.did, state.userId, state.didKey1, state.userId)
      console.log('Update DID: ', JSON.stringify(updateDid.data, null, 2))
      expect(updateDid.status).toEqual(200)

      let token = uuidv4()
      const tokenUpdate = await Token.Update(state.data.did, state.uuid, token, state.uuid)
      console.log('Update Token: ', JSON.stringify(tokenUpdate.data, null, 2))
      expect(tokenUpdate.status).toEqual(200)

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
        if (getAllSchemaConfig.data.items[i].permission == 'ADMIN') {
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
      const createVc = await VCs.Create(state.fullSchemaId, schemaName, schemaType, state.data.did,
        state.data.did, credentialSubject, state.token)
      console.log('Create VC: ', JSON.stringify(createVc.data, null, 2))
      expect(createVc.status).toEqual(200)
      const jwtPayloadBase64 = createVc.data.jwt
      state.vcId = createVc.data.id

      const didDocHistory1 = await DIDDoc.GetHistory(state.data.did)
      console.log('DID Doc History1 : ', JSON.stringify(didDocHistory1.data, null, 2))
      expect(didDocHistory1.status).toEqual(200)
      state.keyId = didDocHistory1.data.did_document[0].verificationMethod[0].id

      const nonce1 = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce 1: ', JSON.stringify(nonce1.data, null, 2))
      expect(nonce1.status).toEqual(200)
      state.data.nonce = nonce1.data.nonce

      const vcRegister = await VC.Register(state.data.did, state.didKey1, state.data.nonce)
      console.log('VC Register: ', JSON.stringify(vcRegister.data, null, 2))
      expect(vcRegister.status).toEqual(201)
      state.cid = vcRegister.data.cid

      const vcGetStatus = await VCStatus.Get(state.cid)
      console.log('Get VC Status: ', JSON.stringify(vcGetStatus.data, null, 2))
      expect(vcGetStatus.status).toEqual(200)
      state.issuanceDate = vcGetStatus.data.created_at

      const jwtVc = await SignVC.JWTEditor(state.keyId,state.cid,state.issuanceDate,
        jwtPayloadBase64, state.didKey1)

      const nonce2 = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce 2: ', JSON.stringify(nonce2.data, null, 2))
      expect(nonce2.status).toEqual(200)
      state.data.nonce = nonce2.data.nonce

      const vcAddStatus = await VCStatus.Add(state.cid, state.data.did, VC_STATUS.ACTIVE,
        state.didKey1, state.data.nonce, jwtVc)
      console.log('Add VC Status: ', JSON.stringify(vcAddStatus.data, null, 2))
      expect(vcAddStatus.status).toEqual(200)

      const reason = 'Unused'
      const rejectVC = await SignVC.Reject(state.vcId, reason, state.didKey1)
      console.log('Reject VC: ', JSON.stringify(rejectVC.data, null, 2))
      expect(rejectVC.status).toEqual(200)
      expect(rejectVC.data.status).toBe('success')
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Reject VC without reason', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      expect(didRegister.request.status).toEqual(201)
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1

      state.idCardNo = thaiIdCard.generate()
      state.firstName = faker.name.firstName()
      state.lastName = faker.name.lastName()
      state.dateOfBirth = ID_INFO.DATE_OF_BIRTH.CORRECT
      state.laserId = ID_INFO.LASER_ID.CORRECT
      state.email = faker.internet.email()
      state.uuid = uuidv4()

      const registerMobile = await Mobile.Register(state.didKey1, state.idCardNo, state.firstName,
        state.lastName, state.dateOfBirth, state.laserId, state.email, state.uuid)
      console.log('Register Mobile: ', JSON.stringify(registerMobile.data, null, 2))
      expect(registerMobile.status).toEqual(201)
      state.userId = registerMobile.data.user_id

      const updateDid = await UserDID.Update(state.data.did, state.userId, state.didKey1, state.userId)
      console.log('Update DID: ', JSON.stringify(updateDid.data, null, 2))
      expect(updateDid.status).toEqual(200)

      let token = uuidv4()
      const tokenUpdate = await Token.Update(state.data.did, state.uuid, token, state.uuid)
      console.log('Update Token: ', JSON.stringify(tokenUpdate.data, null, 2))
      expect(tokenUpdate.status).toEqual(200)

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
        if (getAllSchemaConfig.data.items[i].permission == 'ADMIN') {
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
      const createVc = await VCs.Create(state.fullSchemaId, schemaName, schemaType, state.data.did,
        state.data.did, credentialSubject, state.token)
      console.log('Create VC: ', JSON.stringify(createVc.data, null, 2))
      expect(createVc.status).toEqual(200)
      const jwtPayloadBase64 = createVc.data.jwt
      state.vcId = createVc.data.id

      const didDocHistory1 = await DIDDoc.GetHistory(state.data.did)
      console.log('DID Doc History1 : ', JSON.stringify(didDocHistory1.data, null, 2))
      expect(didDocHistory1.status).toEqual(200)
      state.keyId = didDocHistory1.data.did_document[0].verificationMethod[0].id

      const nonce1 = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce 1: ', JSON.stringify(nonce1.data, null, 2))
      expect(nonce1.status).toEqual(200)
      state.data.nonce = nonce1.data.nonce

      const vcRegister = await VC.Register(state.data.did, state.didKey1, state.data.nonce)
      console.log('VC Register: ', JSON.stringify(vcRegister.data, null, 2))
      expect(vcRegister.status).toEqual(201)
      state.cid = vcRegister.data.cid

      const vcGetStatus = await VCStatus.Get(state.cid)
      console.log('Get VC Status: ', JSON.stringify(vcGetStatus.data, null, 2))
      expect(vcGetStatus.status).toEqual(200)
      state.issuanceDate = vcGetStatus.data.created_at

      const jwtVc = await SignVC.JWTEditor(state.keyId,state.cid,state.issuanceDate,
        jwtPayloadBase64, state.didKey1)

      const nonce2 = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce 2: ', JSON.stringify(nonce2.data, null, 2))
      expect(nonce2.status).toEqual(200)
      state.data.nonce = nonce2.data.nonce

      const vcAddStatus = await VCStatus.Add(state.cid, state.data.did, VC_STATUS.ACTIVE,
        state.didKey1, state.data.nonce, jwtVc)
      console.log('Add VC Status: ', JSON.stringify(vcAddStatus.data, null, 2))
      expect(vcAddStatus.status).toEqual(200)

      const approveVC = await SignVC.Approve(state.vcId, jwtVc, state.didKey1)
      console.log('Approve VC: ', JSON.stringify(approveVC.data, null, 2))
      expect(approveVC.status).toEqual(200)
      expect(approveVC.data.status).toBe('success')

      const rejectVC = await SignVC.Reject(state.vcId, '', state.didKey1)
      console.log('Reject VC: ', JSON.stringify(rejectVC.data, null, 2))
      expect(rejectVC.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.reason.code).toBe(ERR_REQUIRE.REASON.CODE)
      expect(err.response.data.fields.reason.message).toBe(ERR_REQUIRE.REASON.MESSAGE)
    }
  })
})

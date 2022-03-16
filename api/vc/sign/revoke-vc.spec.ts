import { DID } from '../../did-register'
import { ID_INFO, KEY_TYPE, USER_INFO } from '../../consts'
import { v4 as uuidv4 } from 'uuid'
import { Mobile } from '../../material/mobile'
import { UserDID } from '../../material/update-user-did'
import { Token } from '../../material/token'
import { Authen } from '../../authen/authen'
import { SchemaConfig } from '../../config/schema/schema-config'
import { SchemaBody } from '../../schema/schema-body'
import { Schema } from '../../schema/schema'
import { VCs } from '../vc'
import { SignVC } from './sign-vc'

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

describe('Revoke VC', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Revoke VC', async () => {
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

      const createVc = await VCs.Create(state.fullSchemaId, schemaName, schemaType, '',
        state.data.did, credentialSubject, state.token)
      console.log('Create VC: ', JSON.stringify(createVc.data, null, 2))
      expect(createVc.status).toEqual(200)
      state.vcId = createVc.data.id

      const revokeVC = await SignVC.Revoke(state.vcId, state.token)
      console.log('Revoke VC: ', JSON.stringify(revokeVC.data, null, 2))
      expect(revokeVC.status).toEqual(204)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })
})

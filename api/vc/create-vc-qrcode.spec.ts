import { ERR_REQUIRE, INVALID_PARAMS, KEY_TYPE, USER_INFO } from '../consts'
import { Authen } from '../authen/authen'
import { v4 as uuidv4 } from 'uuid'
import { VCs } from './vc'
import { DID } from '../did-register'
import { DIDNonce } from '../material/nonce'
import { VC } from '../material/vc'

let getInitState: any = () => ({
  token: '',
  cid: '',
  cid2: '',
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

describe('Create VC QR Code', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Create VC QR Code', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      expect(didRegister.request.status).toEqual(201)
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1

      const nonce1 = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce 1: ', JSON.stringify(nonce1.data, null, 2))
      expect(nonce1.status).toEqual(200)
      state.data.nonce = nonce1.data.nonce

      const vcRegister = await VC.Register(state.data.did, state.didKey1, state.data.nonce)
      console.log('VC Register: ', JSON.stringify(vcRegister.data, null, 2))
      expect(vcRegister.status).toEqual(201)
      expect(vcRegister.data.did_address).toBe(state.data.did)
      state.cid = vcRegister.data.cid

      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const cids = [state.cid]
      const createVcQr = await VCs.GenQR(cids, state.data.did, state.token)
      console.log('Create VC QR: ', JSON.stringify(createVcQr.data, null, 2))
      expect(createVcQr.status).toEqual(200)
      expect(createVcQr.data.token).not.toBe(null)
      expect(createVcQr.data.endpoint).not.toBe(null)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Create VC QR Code - Send request with multiple cids', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      expect(didRegister.request.status).toEqual(201)
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1

      const nonce1 = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce 1: ', JSON.stringify(nonce1.data, null, 2))
      expect(nonce1.status).toEqual(200)
      state.data.nonce = nonce1.data.nonce

      const vcRegister = await VC.Register(state.data.did, state.didKey1, state.data.nonce)
      console.log('VC Register: ', JSON.stringify(vcRegister.data, null, 2))
      expect(vcRegister.status).toEqual(201)
      expect(vcRegister.data.did_address).toBe(state.data.did)
      state.cid = vcRegister.data.cid

      const nonce2 = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce 2: ', JSON.stringify(nonce2.data, null, 2))
      expect(nonce2.status).toEqual(200)
      state.data.nonce = nonce2.data.nonce

      const vcRegister2 = await VC.Register(state.data.did, state.didKey1, state.data.nonce)
      console.log('VC Register2: ', JSON.stringify(vcRegister2.data, null, 2))
      expect(vcRegister2.status).toEqual(201)
      expect(vcRegister2.data.did_address).toBe(state.data.did)
      state.cid2 = vcRegister2.data.cid

      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const cids = [state.cid, state.cid2]
      const createVcQr = await VCs.GenQR(cids, state.data.did, state.token)
      console.log('Create VC QR: ', JSON.stringify(createVcQr.data, null, 2))
      expect(createVcQr.status).toEqual(200)
      expect(createVcQr.data.token).not.toBe(null)
      expect(createVcQr.data.endpoint).not.toBe(null)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Create VC\'s QR - Send request with unknown cids', async () => {
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

      state.cid = uuidv4()
      state.cid2 = uuidv4()

      const cids = [state.cid, state.cid2]
      const createVcQr = await VCs.GenQR(cids, state.data.did, state.token)
      console.log('Create VC QR: ', JSON.stringify(createVcQr.data, null, 2))
      expect(createVcQr.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Create VC\'s QR - Send request without did_address', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      expect(didRegister.request.status).toEqual(201)
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1

      const nonce1 = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce 1: ', JSON.stringify(nonce1.data, null, 2))
      expect(nonce1.status).toEqual(200)
      state.data.nonce = nonce1.data.nonce

      const vcRegister = await VC.Register(state.data.did, state.didKey1, state.data.nonce)
      console.log('VC Register: ', JSON.stringify(vcRegister.data, null, 2))
      expect(vcRegister.status).toEqual(201)
      expect(vcRegister.data.did_address).toBe(state.data.did)
      state.cid = vcRegister.data.cid

      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const cids = [state.cid]
      const createVcQr = await VCs.GenQR(cids, '', state.token)
      console.log('Create VC QR: ', JSON.stringify(createVcQr.data, null, 2))
      expect(createVcQr.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.did_address.code).toBe(ERR_REQUIRE.DID_ADDRESS.CODE)
      expect(err.response.data.fields.did_address.message).toBe(ERR_REQUIRE.DID_ADDRESS.MESSAGE)
    }
  })

  test('Create VC\'s QR - Send request without cids', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      expect(didRegister.request.status).toEqual(201)
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1

      const nonce1 = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce 1: ', JSON.stringify(nonce1.data, null, 2))
      expect(nonce1.status).toEqual(200)
      state.data.nonce = nonce1.data.nonce

      const vcRegister = await VC.Register(state.data.did, state.didKey1, state.data.nonce)
      console.log('VC Register: ', JSON.stringify(vcRegister.data, null, 2))
      expect(vcRegister.status).toEqual(201)
      expect(vcRegister.data.did_address).toBe(state.data.did)
      state.cid = vcRegister.data.cid

      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const createVcQr = await VCs.GenQR('', state.data.did, state.token)
      console.log('Create VC QR: ', JSON.stringify(createVcQr.data, null, 2))
      expect(createVcQr.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.cids.code).toBe(ERR_REQUIRE.CIDS_FIELD_TYPE.CODE)
      expect(err.response.data.fields.cids.message).toBe(ERR_REQUIRE.CIDS_FIELD_TYPE.MESSAGE)
    }
  })
})

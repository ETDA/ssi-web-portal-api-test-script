import { ID_INFO, KEY_TYPE, USER_INFO } from '../consts'
import { Authen } from '../authen/authen'
import { PortalMobile } from './mobile'
import { DID } from '../did-register'
import { v4 as uuidv4 } from 'uuid'
import { Mobile } from '../material/mobile'
import { UserDID } from '../material/update-user-did'

const faker = require('faker')
const thaiIdCard = require('thai-id-card')

let getInitState: any = () => ({
  token: '',
  repositoryId: '',
  groupId: '',
  userId: '',
  data: {
    did: '',
    nonce: '',
    did2: '',
    nonce2: ''
  },
  didKey1: []
})

describe('Add user to group', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Add user to group', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1
      expect(didRegister.request.status).toEqual(201)

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

      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const groupName = faker.name.firstName() + `'s Group`

      const createGroup = await PortalMobile.CreateGroup(groupName, state.token)
      console.log('Create group: ', JSON.stringify(createGroup.data, null, 2))
      expect(createGroup.status).toEqual(201)
      state.groupId = createGroup.data.id

      const getAllUser = await PortalMobile.GetAllUser(state.token)
      console.log('Get all user: ', JSON.stringify(getAllUser.data, null, 2))
      expect(getAllUser.status).toEqual(200)

      const getAllGroup = await PortalMobile.GetAllGroup(state.token)
      console.log('Get all group: ', JSON.stringify(getAllGroup.data, null, 2))
      expect(getAllGroup.status).toEqual(200)

      const groupIds = [state.groupId]
      const userIds = [state.userId]
      const addUserToGroup = await PortalMobile.AddUserToGroup(groupIds, userIds, state.token)
      console.log('Add user to group: ', JSON.stringify(addUserToGroup.data, null, 2))
      expect(addUserToGroup.status).toEqual(204)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Add user to group - one user with multiple group', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1
      expect(didRegister.request.status).toEqual(201)

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

      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const groupName = faker.name.firstName() + `'s Group`

      const createGroup = await PortalMobile.CreateGroup(groupName, state.token)
      console.log('Create group: ', JSON.stringify(createGroup.data, null, 2))
      expect(createGroup.status).toEqual(201)
      state.groupId = createGroup.data.id

      const groupName2 = faker.name.firstName() + `'s Group`

      const createGroup2 = await PortalMobile.CreateGroup(groupName2, state.token)
      console.log('Create group2: ', JSON.stringify(createGroup2.data, null, 2))
      expect(createGroup2.status).toEqual(201)
      state.groupId2 = createGroup2.data.id

      const getAllUser = await PortalMobile.GetAllUser(state.token)
      console.log('Get all user: ', JSON.stringify(getAllUser.data, null, 2))
      expect(getAllUser.status).toEqual(200)

      const getAllGroup = await PortalMobile.GetAllGroup(state.token)
      console.log('Get all group: ', JSON.stringify(getAllGroup.data, null, 2))
      expect(getAllGroup.status).toEqual(200)

      const groupIds = [state.groupId,state.groupId2]
      const userIds = [state.userId]
      const addUserToGroup = await PortalMobile.AddUserToGroup(groupIds, userIds, state.token)
      console.log('Add user to group: ', JSON.stringify(addUserToGroup.data, null, 2))
      expect(addUserToGroup.status).toEqual(204)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Add user to group - multiple user with one group', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1
      expect(didRegister.request.status).toEqual(201)

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

      const didRegister2 = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register2: ', JSON.stringify(didRegister2.request.data, null, 2))
      state.data.did2 = didRegister2.request.data.id
      state.didKey2 = didRegister2.didKey1
      expect(didRegister2.request.status).toEqual(201)

      state.idCardNo = thaiIdCard.generate()
      state.firstName = faker.name.firstName()
      state.lastName = faker.name.lastName()
      state.dateOfBirth = ID_INFO.DATE_OF_BIRTH.CORRECT
      state.laserId = ID_INFO.LASER_ID.CORRECT
      state.email = faker.internet.email()
      state.uuid = uuidv4()

      const registerMobile2 = await Mobile.Register(state.didKey2, state.idCardNo, state.firstName,
        state.lastName, state.dateOfBirth, state.laserId, state.email, state.uuid)
      console.log('Register Mobile2: ', JSON.stringify(registerMobile2.data, null, 2))
      expect(registerMobile2.status).toEqual(201)
      state.userId2 = registerMobile2.data.user_id

      const updateDid2 = await UserDID.Update(state.data.did2, state.userId2, state.didKey2, state.userId2)
      console.log('Update DID2: ', JSON.stringify(updateDid2.data, null, 2))
      expect(updateDid2.status).toEqual(200)

      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const groupName = faker.name.firstName() + `'s Group`

      const createGroup = await PortalMobile.CreateGroup(groupName, state.token)
      console.log('Create group: ', JSON.stringify(createGroup.data, null, 2))
      expect(createGroup.status).toEqual(201)
      state.groupId = createGroup.data.id

      const getAllUser = await PortalMobile.GetAllUser(state.token)
      console.log('Get all user: ', JSON.stringify(getAllUser.data, null, 2))
      expect(getAllUser.status).toEqual(200)

      const getAllGroup = await PortalMobile.GetAllGroup(state.token)
      console.log('Get all group: ', JSON.stringify(getAllGroup.data, null, 2))
      expect(getAllGroup.status).toEqual(200)

      const groupIds = [state.groupId]
      const userIds = [state.userId, state.userId2]
      const addUserToGroup = await PortalMobile.AddUserToGroup(groupIds, userIds, state.token)
      console.log('Add user to group: ', JSON.stringify(addUserToGroup.data, null, 2))
      expect(addUserToGroup.status).toEqual(204)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Add user to group - multiple user with multiple group', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1
      expect(didRegister.request.status).toEqual(201)

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

      const didRegister2 = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register2: ', JSON.stringify(didRegister2.request.data, null, 2))
      state.data.did2 = didRegister2.request.data.id
      state.didKey2 = didRegister2.didKey1
      expect(didRegister2.request.status).toEqual(201)

      state.idCardNo = thaiIdCard.generate()
      state.firstName = faker.name.firstName()
      state.lastName = faker.name.lastName()
      state.dateOfBirth = ID_INFO.DATE_OF_BIRTH.CORRECT
      state.laserId = ID_INFO.LASER_ID.CORRECT
      state.email = faker.internet.email()
      state.uuid = uuidv4()

      const registerMobile2 = await Mobile.Register(state.didKey2, state.idCardNo, state.firstName,
        state.lastName, state.dateOfBirth, state.laserId, state.email, state.uuid)
      console.log('Register Mobile2: ', JSON.stringify(registerMobile2.data, null, 2))
      expect(registerMobile2.status).toEqual(201)
      state.userId2 = registerMobile2.data.user_id

      const updateDid2 = await UserDID.Update(state.data.did2, state.userId2, state.didKey2, state.userId2)
      console.log('Update DID2: ', JSON.stringify(updateDid2.data, null, 2))
      expect(updateDid2.status).toEqual(200)

      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const groupName = faker.name.firstName() + `'s Group`

      const createGroup = await PortalMobile.CreateGroup(groupName, state.token)
      console.log('Create group: ', JSON.stringify(createGroup.data, null, 2))
      expect(createGroup.status).toEqual(201)
      state.groupId = createGroup.data.id

      const groupName2 = faker.name.firstName() + `'s Group`

      const createGroup2 = await PortalMobile.CreateGroup(groupName2, state.token)
      console.log('Create group2: ', JSON.stringify(createGroup2.data, null, 2))
      expect(createGroup2.status).toEqual(201)
      state.groupId2 = createGroup2.data.id

      const getAllUser = await PortalMobile.GetAllUser(state.token)
      console.log('Get all user: ', JSON.stringify(getAllUser.data, null, 2))
      expect(getAllUser.status).toEqual(200)

      const getAllGroup = await PortalMobile.GetAllGroup(state.token)
      console.log('Get all group: ', JSON.stringify(getAllGroup.data, null, 2))
      expect(getAllGroup.status).toEqual(200)

      const groupIds = [state.groupId, state.groupId2]
      const userIds = [state.userId, state.userId2]
      const addUserToGroup = await PortalMobile.AddUserToGroup(groupIds, userIds, state.token)
      console.log('Add user to group: ', JSON.stringify(addUserToGroup.data, null, 2))
      expect(addUserToGroup.status).toEqual(204)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Add user to group with not exists user_id', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const groupName = faker.name.firstName() + `'s Group`

      const createGroup = await PortalMobile.CreateGroup(groupName, state.token)
      console.log('Create group: ', JSON.stringify(createGroup.data, null, 2))
      expect(createGroup.status).toEqual(201)
      state.groupId = createGroup.data.id

      const getAllUser = await PortalMobile.GetAllUser(state.token)
      console.log('Get all user: ', JSON.stringify(getAllUser.data, null, 2))
      expect(getAllUser.status).toEqual(200)

      const getAllGroup = await PortalMobile.GetAllGroup(state.token)
      console.log('Get all group: ', JSON.stringify(getAllGroup.data, null, 2))
      expect(getAllGroup.status).toEqual(200)

      const groupIds = [state.groupId]
      const userIds = [uuidv4()]
      const addUserToGroup = await PortalMobile.AddUserToGroup(groupIds, userIds, state.token)
      console.log('Add user to group: ', JSON.stringify(addUserToGroup.data, null, 2))
      expect(addUserToGroup.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Add user to group with not exists group_id', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1
      expect(didRegister.request.status).toEqual(201)

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

      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const getAllUser = await PortalMobile.GetAllUser(state.token)
      console.log('Get all user: ', JSON.stringify(getAllUser.data, null, 2))
      expect(getAllUser.status).toEqual(200)

      const getAllGroup = await PortalMobile.GetAllGroup(state.token)
      console.log('Get all group: ', JSON.stringify(getAllGroup.data, null, 2))
      expect(getAllGroup.status).toEqual(200)

      const groupIds = [uuidv4()]
      const userIds = [state.userId]
      const addUserToGroup = await PortalMobile.AddUserToGroup(groupIds, userIds, state.token)
      console.log('Add user to group: ', JSON.stringify(addUserToGroup.data, null, 2))
      expect(addUserToGroup.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })
})

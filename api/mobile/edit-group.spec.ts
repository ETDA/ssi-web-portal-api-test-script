import { ERR_REQUIRE, INVALID_PARAMS, USER_INFO } from '../consts'
import { Authen } from '../authen/authen'
import { PortalMobile } from './mobile'
import { v4 as uuidv4 } from 'uuid'

const faker = require('faker')

let getInitState: any = () => ({
  token: '',
  repositoryId: '',
  groupId: ''
})

describe('Edit mobile group\'s name', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Edit mobile group\'s name', async () => {
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

      const newGroupName = groupName + `'s Group_Updated`

      const editGroup = await PortalMobile.EditGroup(state.groupId, newGroupName, state.token)
      console.log('Edit group: ', JSON.stringify(editGroup.data, null, 2))
      expect(editGroup.status).toEqual(200)
      expect(editGroup.data.name).toBe(newGroupName)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Edit mobile group\'s name - Edit with the same name', async () => {
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

      const editGroup = await PortalMobile.EditGroup(state.groupId, groupName, state.token)
      console.log('Edit group: ', JSON.stringify(editGroup.data, null, 2))
      expect(editGroup.status).toEqual(200)
      expect(editGroup.data.name).toBe(groupName)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Edit mobile group\'s name - Send request without name', async () => {
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

      const editGroup = await PortalMobile.EditGroup(state.groupId, '', state.token)
      console.log('Edit group: ', JSON.stringify(editGroup.data, null, 2))
      expect(editGroup.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.name.code).toBe(ERR_REQUIRE.NAME.CODE)
      expect(err.response.data.fields.name.message).toBe(ERR_REQUIRE.NAME.MESSAGE)
    }
  })

  test('Edit mobile group\'s name - Send request with incorrect group_id', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const groupName = faker.name.firstName() + `'s Group`
      state.groupId = uuidv4()

      const editGroup = await PortalMobile.EditGroup(state.groupId, groupName, state.token)
      console.log('Edit group: ', JSON.stringify(editGroup.data, null, 2))
      expect(editGroup.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})

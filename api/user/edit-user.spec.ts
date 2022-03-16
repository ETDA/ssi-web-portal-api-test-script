import { INVALID_PARAMS, USER_INFO, USER_ROLE } from '../consts'
import { Authen } from '../authen/authen'
import { PortalUser } from './user'

const faker = require('faker')

let getInitState: any = () => ({
  token: '',
  userId: ''
})

describe('Edit user', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Edit user role to Admin', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const email = faker.internet.email()
      const role = USER_ROLE.MEMBER
      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const dateOfBirth = '01/01/1980'
      const addUser = await PortalUser.Add(email, role, firstName, lastName, dateOfBirth, state.token)
      console.log('Add user: ', JSON.stringify(addUser.data, null, 2))
      expect(addUser.status).toEqual(201)
      state.userId = addUser.data.id

      const getUserById1 = await PortalUser.GetUserByID(state.userId, state.token)
      console.log('Get user by ID1: ', JSON.stringify(getUserById1.data, null, 2))
      expect(getUserById1.status).toEqual(200)
      expect(getUserById1.data.role).toBe(role)

      const newRole = USER_ROLE.ADMIN
      const editUser = await PortalUser.Edit(state.userId, newRole, state.token)
      console.log('Edit user: ', JSON.stringify(editUser.data, null, 2))
      expect(editUser.status).toEqual(200)

      const getUserById2 = await PortalUser.GetUserByID(state.userId, state.token)
      console.log('Get user by ID2: ', JSON.stringify(getUserById2.data, null, 2))
      expect(getUserById2.status).toEqual(200)
      expect(getUserById2.data.role).toBe(newRole)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Edit user role to Member', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const email = faker.internet.email()
      const role = USER_ROLE.ADMIN
      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const dateOfBirth = '01/01/1980'
      const addUser = await PortalUser.Add(email, role, firstName, lastName, dateOfBirth, state.token)
      console.log('Add user: ', JSON.stringify(addUser.data, null, 2))
      expect(addUser.status).toEqual(201)
      state.userId = addUser.data.id

      const getUserById1 = await PortalUser.GetUserByID(state.userId, state.token)
      console.log('Get user by ID1: ', JSON.stringify(getUserById1.data, null, 2))
      expect(getUserById1.status).toEqual(200)
      expect(getUserById1.data.role).toBe(role)

      const newRole = USER_ROLE.MEMBER
      const editUser = await PortalUser.Edit(state.userId, newRole, state.token)
      console.log('Edit user: ', JSON.stringify(editUser.data, null, 2))
      expect(editUser.status).toEqual(200)

      const getUserById2 = await PortalUser.GetUserByID(state.userId, state.token)
      console.log('Get user by ID2: ', JSON.stringify(getUserById2.data, null, 2))
      expect(getUserById2.status).toEqual(200)
      expect(getUserById2.data.role).toBe(newRole)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Edit user\'s role - Send request with incorrect role', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const email = faker.internet.email()
      const role = USER_ROLE.MEMBER
      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const dateOfBirth = '01/01/1980'
      const addUser = await PortalUser.Add(email, role, firstName, lastName, dateOfBirth, state.token)
      console.log('Add user: ', JSON.stringify(addUser.data, null, 2))
      expect(addUser.status).toEqual(201)
      state.userId = addUser.data.id

      const getUserById1 = await PortalUser.GetUserByID(state.userId, state.token)
      console.log('Get user by ID1: ', JSON.stringify(getUserById1.data, null, 2))
      expect(getUserById1.status).toEqual(200)
      expect(getUserById1.data.role).toBe(role)

      const newRole = 'ok'
      const editUser = await PortalUser.Edit(state.userId, newRole, state.token)
      console.log('Edit user: ', JSON.stringify(editUser.data, null, 2))
      expect(editUser.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.role.code).toBe(INVALID_PARAMS.ROLE.CODE)
      expect(err.response.data.fields.role.message).toBe(INVALID_PARAMS.ROLE.MESSAGE)
    }
  })

  test('Edit user\'s role - Send request without role', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const email = faker.internet.email()
      const role = USER_ROLE.MEMBER
      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const dateOfBirth = '01/01/1980'
      const addUser = await PortalUser.Add(email, role, firstName, lastName, dateOfBirth, state.token)
      console.log('Add user: ', JSON.stringify(addUser.data, null, 2))
      expect(addUser.status).toEqual(201)
      state.userId = addUser.data.id

      const getUserById1 = await PortalUser.GetUserByID(state.userId, state.token)
      console.log('Get user by ID1: ', JSON.stringify(getUserById1.data, null, 2))
      expect(getUserById1.status).toEqual(200)
      expect(getUserById1.data.role).toBe(role)

      const editUser = await PortalUser.Edit(state.userId, '', state.token)
      console.log('Edit user: ', JSON.stringify(editUser.data, null, 2))
      expect(editUser.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.role.code).toBe(INVALID_PARAMS.ROLE.CODE)
      expect(err.response.data.fields.role.message).toBe(INVALID_PARAMS.ROLE.MESSAGE)
    }
  })
})

import { ERR_REQUIRE, INVALID_PARAMS, USER_INFO, USER_ROLE } from '../consts'
import { Authen } from '../authen/authen'
import { PortalUser } from './user'

const faker = require('faker')

let getInitState: any = () => ({
  token: '',
  repositoryId: ''
})

describe('Add user', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Add user', async () => {
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

      const getUserById = await PortalUser.GetUserByID(state.userId, state.token)
      console.log('Get user by ID: ', JSON.stringify(getUserById.data, null, 2))
      expect(getUserById.status).toEqual(200)
      expect(getUserById.data.id).toBe(state.userId)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Add user - Send request with invalid email format', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const role = USER_ROLE.ADMIN
      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const dateOfBirth = '01/01/1980'
      const addUser = await PortalUser.Add(firstName, role, firstName, lastName, dateOfBirth, state.token)
      console.log('Add user: ', JSON.stringify(addUser.data, null, 2))
      expect(addUser.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.email.code).toBe(INVALID_PARAMS.EMAIL_FORMAT.CODE)
      expect(err.response.data.fields.email.message).toBe(INVALID_PARAMS.EMAIL_FORMAT.MESSAGE)
    }
  })

  test('Add user - Send request without email', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const role = USER_ROLE.ADMIN
      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const dateOfBirth = '01/01/1980'
      const addUser = await PortalUser.Add('', role, firstName, lastName, dateOfBirth, state.token)
      console.log('Add user: ', JSON.stringify(addUser.data, null, 2))
      expect(addUser.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.email.code).toBe(ERR_REQUIRE.EMAIL.CODE)
      expect(err.response.data.fields.email.message).toBe(ERR_REQUIRE.EMAIL.MESSAGE)
    }
  })

  test('Add user - Send request without role', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const email = faker.internet.email()
      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const dateOfBirth = '01/01/1980'
      const addUser = await PortalUser.Add(email, '', firstName, lastName, dateOfBirth, state.token)
      console.log('Add user: ', JSON.stringify(addUser.data, null, 2))
      expect(addUser.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.role.code).toBe(ERR_REQUIRE.ROLE.CODE)
      expect(err.response.data.fields.role.message).toBe(ERR_REQUIRE.ROLE.MESSAGE)
    }
  })

  test('Add user - Send request without first_name', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const email = faker.internet.email()
      const role = USER_ROLE.ADMIN
      const lastName = faker.name.lastName()
      const dateOfBirth = '01/01/1980'
      const addUser = await PortalUser.Add(email, role, '', lastName, dateOfBirth, state.token)
      console.log('Add user: ', JSON.stringify(addUser.data, null, 2))
      expect(addUser.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.first_name.code).toBe(ERR_REQUIRE.FIRST_NAME.CODE)
      expect(err.response.data.fields.first_name.message).toBe(ERR_REQUIRE.FIRST_NAME.MESSAGE)
    }
  })

  test('Add user - Send request without last_name', async () => {
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
      const dateOfBirth = '01/01/1980'
      const addUser = await PortalUser.Add(email, role, firstName, '', dateOfBirth, state.token)
      console.log('Add user: ', JSON.stringify(addUser.data, null, 2))
      expect(addUser.status).toEqual(201)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.last_name.code).toBe(ERR_REQUIRE.LAST_NAME.CODE)
      expect(err.response.data.fields.last_name.message).toBe(ERR_REQUIRE.LAST_NAME.MESSAGE)
    }
  })

  test('Add user - Send request without date_of_birth', async () => {
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
      const addUser = await PortalUser.Add(email, role, firstName, lastName, '', state.token)
      console.log('Add user: ', JSON.stringify(addUser.data, null, 2))
      expect(addUser.status).toEqual(201)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.date_of_birth.code).toBe(ERR_REQUIRE.DATE_OF_BIRTH.CODE)
      expect(err.response.data.fields.date_of_birth.message).toBe(ERR_REQUIRE.DATE_OF_BIRTH.MESSAGE)
    }
  })
})

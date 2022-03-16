import { USER_INFO, USER_ROLE } from '../consts'
import { Authen } from '../authen/authen'
import { PortalUser } from './user'
import { v4 as uuidv4 } from 'uuid'

const faker = require('faker')

let getInitState: any = () => ({
  token: '',
  userId: ''
})

describe('Get user by ID', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Get user by ID', async () => {
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

  test('Get user by ID - Send request with not exists user_id', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      state.userId = uuidv4()

      const getUserById = await PortalUser.GetUserByID(state.userId, state.token)
      console.log('Get user by ID: ', JSON.stringify(getUserById.data, null, 2))
      expect(getUserById.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})

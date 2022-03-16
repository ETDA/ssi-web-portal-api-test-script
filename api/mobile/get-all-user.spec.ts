import { USER_INFO, USER_ROLE } from '../consts'
import { Authen } from '../authen/authen'
import { PortalMobile } from './mobile'
import { PortalUser } from '../user/user'

const faker = require('faker')

let getInitState: any = () => ({
  token: '',
  repositoryId: '',
  groupId: '',
  userId: ''
})

describe('Get all user', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Get all user', async () => {
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

      // const groupIds = [state.groupId]
      // const userIds = [state.userId]
      // const addUserToGroup = await PortalMobile.AddUserToGroup(groupIds, userIds, state.token)
      // console.log('Add user to group: ', JSON.stringify(addUserToGroup.data, null, 2))
      // expect(addUserToGroup.status).toEqual(200)

      const getAllUser = await PortalMobile.GetAllUser(state.token)
      console.log('Get all user: ', JSON.stringify(getAllUser.data, null, 2))
      expect(getAllUser.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })
})

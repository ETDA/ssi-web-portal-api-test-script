import { USER_INFO } from '../consts'
import { Authen } from '../authen/authen'
import { PortalMobile } from './mobile'
import { v4 as uuidv4 } from 'uuid'

const faker = require('faker')

let getInitState: any = () => ({
  token: '',
  repositoryId: '',
  groupId: ''
})

describe('Delete group', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Delete group', async () => {
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

      const deleteGroup = await PortalMobile.DeleteGroup(state.groupId, state.token)
      console.log('Delete group: ', JSON.stringify(deleteGroup.data, null, 2))
      expect(deleteGroup.status).toEqual(204)

      const getAllGroup = await PortalMobile.GetAllGroup(state.token)
      console.log('Get all group: ', JSON.stringify(getAllGroup.data, null, 2))
      expect(getAllGroup.status).toEqual(200)
      expect(getAllGroup.data.items).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: groupName })
        ])
      )
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Delete mobile group - Send request with not exists group\'s ID', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      state.groupId = uuidv4()

      const deleteGroup = await PortalMobile.DeleteGroup(state.groupId, state.token)
      console.log('Delete group: ', JSON.stringify(deleteGroup.data, null, 2))
      expect(deleteGroup.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})

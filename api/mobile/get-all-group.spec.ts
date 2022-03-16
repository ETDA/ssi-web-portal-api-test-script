import { USER_INFO } from '../consts'
import { Authen } from '../authen/authen'
import { PortalMobile } from './mobile'

const faker = require('faker')

let getInitState: any = () => ({
  token: '',
  repositoryId: ''
})

describe('Get all group', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Get all group', async () => {
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

      const getAllGroup = await PortalMobile.GetAllGroup(state.token)
      console.log('Get all group: ', JSON.stringify(getAllGroup.data, null, 2))
      expect(getAllGroup.status).toEqual(200)
      expect(getAllGroup.data.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: groupName })
        ])
      )

    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })
})

import { ERR_REQUIRE, INVALID_PARAMS, USER_INFO } from '../consts'
import { Authen } from '../authen/authen'
import { PortalMobile } from './mobile'

const faker = require('faker')

let getInitState: any = () => ({
  token: '',
  repositoryId: ''
})

describe('Create group', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  test('Create group', async () => {
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
      expect(createGroup.data.name).toBe(groupName)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Create mobile group - Send request without name', async () => {
    try {
      const userName = USER_INFO.USER_NAME
      const password = USER_INFO.PASSWORD

      const login = await Authen.Login(userName, password)
      console.log('Login: ', JSON.stringify(login.data, null, 2))
      expect(login.status).toEqual(201)
      state.token = login.data.token

      const createGroup = await PortalMobile.CreateGroup('', state.token)
      console.log('Create group: ', JSON.stringify(createGroup.data, null, 2))
      expect(createGroup.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID_PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID_PARAMS.MESSAGE)
      expect(err.response.data.fields.name.code).toBe(ERR_REQUIRE.NAME.CODE)
      expect(err.response.data.fields.name.message).toBe(ERR_REQUIRE.NAME.MESSAGE)
    }
  })
})

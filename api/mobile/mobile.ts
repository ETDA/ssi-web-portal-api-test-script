import axios from 'axios'
import { CONFIG } from '../consts'

const genCreateEditGroupMessage = (obj: {
  name: string
}) => {
  return {
    name: obj.name
  }
}

const genAddUserToGroupMessage = (obj: {
  group_ids: any, user_ids: any
}) => {
  return {
    user_ids: obj.user_ids,
    group_ids: obj.group_ids
  }
}

const genRemoveUserFromGroupMessage = (obj: {
  user_ids: any
}) => {
  return {
    user_ids: obj.user_ids
  }
}

export class PortalMobile {

  static async CreateGroup (name: string, token: string) {
    const message = genCreateEditGroupMessage({
      name: name
    })
    console.log('request: Create Group ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/mobile/groups`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async EditGroup (groupId: string, name: string, token: string) {
    const message = genCreateEditGroupMessage({
      name: name
    })
    console.log('request: Edit Group ', JSON.stringify(message, null, 2))
    return await axios.put(`${CONFIG.BASE_URL}/api/web/mobile/groups/${groupId}`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async DeleteGroup (groupId: string, token: string) {
    return await axios.delete(`${CONFIG.BASE_URL}/api/web/mobile/groups/${groupId}`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async AddUserToGroup (groupIds: any, userIds: any, token: string) {
    const message = genAddUserToGroupMessage({
      group_ids: groupIds,
      user_ids: userIds
    })
    console.log('request: Add user to group ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/mobile/groups/users`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async RemoveUserFromGroup (groupId: string, userIds: any, token: string) {
    const message = genRemoveUserFromGroupMessage({
      user_ids: userIds
    })
    console.log('request: Remove user from group ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/mobile/groups/${groupId}/users/remove`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetAllGroup (token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/mobile/groups`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetAllUser (token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/mobile/users`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetUserInGroup (groupId: string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/mobile/groups/${groupId}/users`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }
}

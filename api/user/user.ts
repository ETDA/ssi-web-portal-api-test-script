import axios from 'axios'
import { CONFIG } from '../consts'

const genAddUserMessage = (obj: {
  email: string, role: string, first_name: string, last_name: string, date_of_birth: string
}) => {
  return {
    email: obj.email,
    role: obj.role,
    first_name: obj.first_name,
    last_name: obj.last_name,
    date_of_birth: obj.date_of_birth
  }
}

const genEditUserMessage = (obj: {
  role: string
}) => {
  return {
    role: obj.role
  }
}

export class PortalUser {

  static async Add (email: string, role: string, firstName: string, lastName: any,
    dateOfBirth: string, token: string) {
    const message = genAddUserMessage({
      email: email,
      role: role,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth
    })
    console.log('request: Add User ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/users`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async Edit (userId: string, role: string, token: string) {
    const message = genEditUserMessage({
      role: role
    })
    console.log('request: Edit User ', JSON.stringify(message, null, 2))
    return await axios.put(`${CONFIG.BASE_URL}/api/web/users/${userId}`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async Delete (userId: string, token: string) {
    return await axios.delete(`${CONFIG.BASE_URL}/api/web/users/${userId}`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetAllUser (token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/users`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetUserByID (userId: string, token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/users/${userId}`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async ResetPassword (userId: string, token: string) {
    return await axios.post(`${CONFIG.BASE_URL}/api/web/users/${userId}/reset-password`,
      null,{ headers: { 'Authorization': `FINEMA ${token}` } })
  }
}

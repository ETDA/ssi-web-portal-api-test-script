import axios from 'axios'
import { CONFIG } from '../../consts'

const genChangePWMessage = (obj: {
  current_password: string, new_password: string
}) => {
  return {
    current_password: obj.current_password,
    new_password: obj.new_password
  }
}

export class Me {
  static async Info (token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/me`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async ChangePassword (currentPassword: string, newPassword: string, token: string) {
    const message = genChangePWMessage({
      current_password: currentPassword,
      new_password: newPassword
    })
    console.log('request: Change Password ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/me/change-password`, message,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }
}

import axios from 'axios'
import { CONFIG } from '../../consts'

const genUserVerifyMessage = (obj: {
  token: string, password: string
}) => {
  return {
    token: obj.token,
    password: obj.password
  }
}

export class User {
  static async PostVerify (token: string, password: string) {
    const message = genUserVerifyMessage({
      token: token,
      password: password
    })
    console.log('request: User Verify ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/user-verify`, message,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetVerify (token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/user-verify?token=${token}`)
  }
}

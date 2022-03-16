import axios from 'axios'
import { CONFIG } from '../../consts'

const genAddWalletConfigMessage = (obj: {
  endpoint: string, access_token: string
}) => {
  return {
    endpoint: obj.endpoint,
    access_token: obj.access_token
  }
}

export class WalletConfig {

  static async AddConfig (endpoint: string, accessToken: string, token:string) {
    const message = genAddWalletConfigMessage({
      endpoint: endpoint,
      access_token: accessToken
    })
    console.log('request: Add Config ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/configs/wallets`, message,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async DeleteConfig (walletId: string, token: string) {
    return await axios.delete(`${CONFIG.BASE_URL}/api/web/configs/wallets/${walletId}`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GetWalletConfigs (token: string) {
    return await axios.get(`${CONFIG.BASE_URL}/api/web/configs/wallets`,
      { headers: { 'Authorization': `FINEMA ${token}` } })
  }
}

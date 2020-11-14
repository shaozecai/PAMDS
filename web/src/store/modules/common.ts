interface UserInfo {
    id: string
    phone: string
    userName: string
    email: string
}
  
export interface State {
    userInfo: UserInfo
    token: string
}
    

// initial state
const state: State = {
    userInfo: { id: '', phone: '', userName: '', email: '' },
    token: ''
}
export default state
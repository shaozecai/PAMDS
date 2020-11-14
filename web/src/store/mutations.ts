import { UserInfo, GlobalRouter, State } from '@/public/javascript/Interfaces'
import types from './mutation-types'

export default {
    [types.GOTO_PAGE](state: State,route: GlobalRouter){
        state.globalRouter = route
    },
    [types.SET_USER_INFO](state: State,payload: UserInfo){
        state.userInfo = payload
    },
    [types.SET_TOKEN](state: State,payload: string){
        state.token = payload
    }
}
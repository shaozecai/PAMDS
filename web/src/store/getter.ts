import { State } from '@/public/javascript/Interfaces'


export default {
    getToken: (state: State) => {
        return state.token
    }
}
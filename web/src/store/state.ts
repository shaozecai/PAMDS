import { State } from '@/public/javascript/Interfaces'

const state: State = {
    userInfo:{
        id:'',
        userName:'',
        phone:'',
        email:'',
        roleList:[]
    },
    token:'',
    globalRouter:{ url:'', params:{}, go:'', replace:false }
}
export default state
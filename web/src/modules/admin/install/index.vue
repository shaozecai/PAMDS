<template>
    <div class="user-list">
        <a-page-header style="border: 1px solid rgb(235, 237, 240)" :breadcrumb="{ props: { routes } }"/>
        <a-form-model :form="userInfo" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-row>
                <a-col :span="24">
                    <a-form-model-item label="姓名">
                        <a-input
                        v-model="userInfo.userName"
                        placeholder="请输入"
                        />
                    </a-form-model-item>
                </a-col>
                <a-col :span="24">
                    <a-form-model-item label="用户编号">
                        <a-input
                        v-model="userInfo.userId"
                        placeholder="请输入"
                        disabled
                        />
                    </a-form-model-item>
                </a-col>
                <a-col :span="24">
                    <a-form-model-item label="手机号">
                        <a-input
                        v-model="userInfo.phone"
                        placeholder="请输入"
                        disabled
                        />
                    </a-form-model-item>
                </a-col>
                <a-col :span="24">
                    <a-form-model-item label="邮箱">
                        <a-input
                        v-model="userInfo.email"
                        placeholder="请输入"
                        />
                    </a-form-model-item>
                </a-col>
                <a-col :span="24">
                    <a-form-model-item label="性别">
                        <a-select v-model="userInfo.sex" placeholder="请选择">
                            <a-select-option v-for="dic in sexDic" :key="dic.dicCode" :value="dic.dicCode">
                                {{dic.dicCodeDes}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>  
                </a-col>
            </a-row>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">
                    保存
                </a-button>
            </a-form-model-item>

        </a-form-model>

    </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import http from '@/public/javascript/http'
interface DicType {
    dicType: string;
    dicTypeDes: string;
    dicCode: string;
    dicCodeDes: string;
    supDicCode: string;
}

@Component({})
export default class AdminInstall extends Vue {
    labelCol = { span: 4 }
    wrapperCol = { span: 14 }
    routes = [
        {
            path: '/admin/home',
            breadcrumbName: '首页',
        },
        {
            path: '/admin/install',
            breadcrumbName: '设置',
        }
    ]
    sexDic: Array<DicType> = []

    get userInfo () {
        return JSON.parse(JSON.stringify(this.$store.state.userInfo))
    }
    onSubmit() {
        const params = {
            ...this.userInfo
        }
        http.post('/api/install/updUser',params).then(res=>{
            if(res.data.code && res.data.code === '0'){
                this.$message.success(res.data.msg);
                this.$store.commit('setUserInfo',this.userInfo)
                this.$cookies.set("userInfo",JSON.stringify(this.userInfo), 60*60*24) 
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch(e=>{
            console.log(e)
        })
    }
    created() {
        // 查询页面字典
        const params = {
            dicType:'SEX'
        }
        http.post('/api/public/getDic',params).then(res=>{
            if(res.data.code && res.data.code === '0'){
                this.sexDic = res.data.data
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch(e=>{
            console.log(e)
        })
    }
}

</script>

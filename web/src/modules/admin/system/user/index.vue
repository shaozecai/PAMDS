<template>
    <div class="user-list">
        <a-page-header style="border: 1px solid rgb(235, 237, 240)" :breadcrumb="{ props: { routes } }"/>
        <a-form-model :form="form" @submit="fetch" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-row>
                <a-col :span="24" style="text-align:center;">
                    <a-col :span="8">
                        <a-form-model-item label="姓名">
                            <a-input
                            v-model="form.userName"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="角色">
                            <a-select v-model="form.roles" placeholder="请选择角色">
                                <a-select-option v-for="dic in rolesDic" :key="dic.dicCode" :value="dic.dicCode">
                                    {{dic.dicCodeDes}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>  
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="创建时间">
                            <a-range-picker v-model="form.crtDate" format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" :placeholder="['开始时间', '结束时间']"/>
                        </a-form-model-item>
                    </a-col>
                </a-col>
            </a-row>
        </a-form-model>
        <a-row>
            <a-col :span="24" style="text-align:center;margin-bottom:25px;">
                <a-button type="primary" @click="fetch">查询</a-button>
                <a-button type="primary" @click="handleReset" style="margin:0 15px;">重置</a-button>
                <a-button type="primary" @click="addUser" :disabled="!hasAdmin">新增</a-button>
            </a-col>
        </a-row> 
        <a-row>
            <a-col :span="24">
                <a-table 
                :columns="columns"
                :row-key="record => record.userId"
                :data-source="userDatas"
                :pagination="pagination"
                :loading="loading"
                @change="handleTableChange"
                >
                    <div slot="operation" slot-scope="text,record">
                        <!-- <div v-if="record.rolesId.indexOf('003001') === -1 && userInfo.phone !== record.phone">
                            <a-button type="link">
                                授权 
                            </a-button>
                            <a-button type="link">
                                停用
                            </a-button>
                        </div>
                        <div v-if="record.rolesId.indexOf('003001') > -1 || userInfo.phone === record.phone">
                            无
                        </div>                        -->
                        <div v-if="record.rolesId">
                            无
                        </div> 
                    </div>
                </a-table>
            </a-col>
        </a-row>
    </div>
</template>

<script lang='ts'>
import { Component, Provide, Vue } from 'vue-property-decorator';
import http from '@/public/javascript/http'
interface DicType {
    dicType: string;
    dicTypeDes: string;
    dicCode: string;
    dicCodeDes: string;
    supDicCode: string;
}
interface UserData {
    rn: string;
    userId: string;
    userName: string;
    rolesId: string;
    rolesName: string;
    phone: string;
    email: string;
    crtDate: string;
}
interface RoleType {
	roleId: string;
	roleName: string;
}

@Component({})
export default class AdminSystemUser extends Vue {
    // data
    rolesDic: Array<DicType> = []
    labelCol = { span: 4 }
    wrapperCol = { span: 14 }
    form = {
        userName:'',
        roles:'',
        crtDate:[]
    }
    routes = [
        {
            path: '/admin/home',
            breadcrumbName: '首页',
        },
        {
            path: '/admin/system/user',
            breadcrumbName: '用户管理',
        }
    ]
    loading = false
    pagination = {
        defaultPageSize:5, // 默认的每页条数
        pageSize:5, //每页条数
        pageSizeOptions:['5','10','50'],
        defaultCurrent:1, //默认的当前页数
        current:1,//当前页数
        total:0,
        showQuickJumper:true, // 是否可以快速跳转至某页
        showSizeChanger:true
    }

    @Provide() dbLoading = true
    userDatas: Array<UserData> = []
    columns = [
        {
            title: '序号',
            dataIndex: 'rn',
            key: 'rn',
            align:'center'
        },
        {
            title: '用户Id',
            dataIndex: 'userId',
            key: 'userId',
            align:'center'
        },
        {
            title: '用户姓名',
            dataIndex: 'userName',
            key: 'userName',
            ellipsis: true,
            align:'center'
        },
        {
            title: '角色',
            dataIndex: 'rolesName',
            key: 'rolesName',
            ellipsis: true,
            align:'center'
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
            align:'center'
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            align:'center'
        },
        {
            title: '创建时间',
            dataIndex: 'crtDate',
            key: 'crtDate',
            align:'center'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            scopedSlots: { customRender: 'operation' },
            align:'center'
        }
    ]
    // computed
    get userInfo () {
        return this.$store.state.userInfo
    }
    get hasAdmin () {
        const arr = this.$store.state.userInfo.roleList
        const a = arr.filter((item: RoleType)=>{ return item.roleId === '003001'})
        if(a && a.length > 0){
            return true
        }else{
            return false
        }
    }
    fetch() {
        this.loading = true;
        const params = {
            bgnNum: (this.pagination.current - 1)*this.pagination.pageSize,
            pageSize: this.pagination.pageSize,
            crtDateBgn: this.form.crtDate[0] ? this.form.crtDate[0] : '',
            crtDateEnd: this.form.crtDate[1] ? this.form.crtDate[1] : '',
            ...this.form
        }
        http.post('/api/system/userSearch',params).then(res=>{
            if(res.data.code && res.data.code === '0'){
                if(res.data.data){
                    this.userDatas = res.data.data.datas
                    const pagination = { ...this.pagination };
                    pagination.total = res.data.data.total;
                    this.loading = false;
                    this.pagination = pagination;
                }else{
                    this.userDatas = []
                }
            }else{
                this.loading = false;
                this.$message.error(res.data.msg);
            }
        }).catch(e=>{
            console.log(e)
        })
    }
    handleReset(){
        this.form = {
            userName:'',
            roles:'',
            crtDate:[]
        }
    }
    handleTableChange(pagination: any){
        this.pagination = {...pagination}
        this.fetch()
    }
    addUser() {
        console.log(111)
    }
    // lifeCycle
    mounted() {
        this.fetch();
    }
    created() {
        // 查询页面字典
        const params = {
            phone:this.$store.state.phone,
            dicType:'USER_ROLE'
        }
        http.post('/api/public/getDic',params).then(res=>{
            if(res.data){
                this.rolesDic = res.data.data
            }else{
                this.rolesDic = []
            }
        }).catch(e=>{
            console.log(e)
        })

    }
}

</script>

<template>
    <div class="user-list">
        <a-page-header style="border: 1px solid rgb(235, 237, 240)" :breadcrumb="{ props: { routes } }"/>
        <a-form-model :form="form" @submit="fetch" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-row>
                <a-col :span="24" style="text-align:center;">
                    <a-col :span="8">
                        <a-form-model-item label="用户">
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
                        <a-form-model-item label="操作时间">
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
            </a-col>
        </a-row> 
        <a-row>
            <a-col :span="24">
                <a-table 
                :columns="columns"
                :row-key="record => record.rn"
                :data-source="journalDatas"
                :pagination="pagination"
                :loading="loading"
                @change="handleTableChange"
                >
                   
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
interface JournalData {
    rn: string;
    userId: string;
    userName: string;
    rolesId: string;
    rolesName: string;
    menu1: string;
    menu2: string;
    menu3: string;
    ywKey: string;
    crtDate: string;
}
interface RoleType {
	roleId: string;
	roleName: string;
}

@Component({})
export default class AdminSystemJournal extends Vue {
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
            path: '/admin/system/journal',
            breadcrumbName: '日志管理',
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
    journalDatas: Array<JournalData> = []
    columns = [
        {
            title: '序号',
            dataIndex: 'rn',
            key: 'rn',
            align:'center'
        },
        {
            title: '操作用户',
            dataIndex: 'userName',
            key: 'userName',
            ellipsis: true,
            align:'center'
        },
        {
            title: '菜单',
            dataIndex: 'menu1',
            key: 'menu1',
            align:'center'
        },
        {
            title: '二级菜单',
            dataIndex: 'menu2',
            key: 'menu2',
            align:'center'
        },
        {
            title: '功能',
            dataIndex: 'menu3',
            key: 'menu3',
            align:'center'
        },
        {
            title: '业务编号',
            dataIndex: 'ywKey',
            key: 'ywKey',
            align:'center'
        },
        {
            title: '操作时间',
            dataIndex: 'crtDate',
            key: 'crtDate',
            align:'center'
        }
    ]
    // computed
    get userInfo () {
        return this.$store.state.userInfo
    }
    get hasAdmin () {
        const arr = this.$store.state.userInfo.roleList
        const a = arr.filter((item: RoleType)=>{item.roleId === '003001'})
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
        http.post('/api/system/jourSearch',params).then(res=>{
            if(res.data.code && res.data.code === '0'){
                if(res.data.data){
                    this.journalDatas = res.data.data.datas
                    const pagination = { ...this.pagination };
                    pagination.total = res.data.data.total;
                    this.loading = false;
                    this.pagination = pagination;
                }else{
                    this.journalDatas = []
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
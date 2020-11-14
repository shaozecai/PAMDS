<template>
    <div class="user-list">
        <a-page-header style="border: 1px solid rgb(235, 237, 240)" :breadcrumb="{ props: { routes } }"/>
        <a-form-model :form="form" @submit="fetch" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-row>
                <a-col :span="24" style="text-align:center;">
                    <a-col :span="8">
                        <a-form-model-item label="标题">
                            <a-input
                            v-model="form.title"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="作者">
                            <a-input
                            v-model="form.author"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="状态">
                            <a-select v-model="form.status" placeholder="请选择状态">
                                <a-select-option v-for="dic in noticeStatus" :key="dic.dicCode" :value="dic.dicCode">
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
                <a-button type="primary" @click="addNotice">新增</a-button>
            </a-col>
            <a-col :span="24">
                <a-table
                    :columns="columns"
                    :row-key="record => record.id"
                    :data-source="noticeDatas"
                    :pagination="pagination"
                    :loading="loading"
                    @change="handleTableChange"
                >
                    <template slot="operation" slot-scope="text, record">
                        <a-button type="link" v-if="record.status !== '002002'" @click="editorNotice(record.id)">
                            编辑
                        </a-button>
                        <a-button type="link" v-if="record.status === '002002'" @click="unreleaseNotice(record.id)">
                            取消发布
                        </a-button>
                        <a-button type="link" v-if="record.status === '002003'" @click="releaseNotice(record.id)">
                            发布
                        </a-button>
                        <a-button type="link" v-if="record.status === '002001'" @click="deleteNotice(record.id)">
                            删除
                        </a-button>
                    </template>
                </a-table>
            </a-col>
        </a-row>
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
interface NoticeType {
    rn: string;
    id: string;
    title: string;
    author: string;
    crtDate: string;
    status: string;
    statusDesc: string;
}

@Component({})
export default class AdminNoticeList extends Vue {
    noticeStatus: Array<DicType> = []
    labelCol = { span: 4 }
    wrapperCol = { span: 14 }
    form = {
        title:'',
        author:'',
        status:'',
        crtDate:[]
    }
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
    noticeDatas: Array<NoticeType> = []
    routes = [
        {
            path: '/admin/home',
            breadcrumbName: '首页',
        },
        {
            path: '/admin/notice',
            breadcrumbName: '公告管理',
        }
    ]
    columns = [
        {
            title: '序号',
            dataIndex: 'rn',
            key: 'rn',
            align:'center'
        },
        {
            title: '公告标题',
            dataIndex: 'title',
            key: 'title',
            align:'center',
            ellipsis: true,
            scopedSlots: { customRender: 'title' },
        },
        {
            title: '作者',
            dataIndex: 'author',
            key: 'author',
            align:'center'
        },
        {
            title: '创建时间',
            dataIndex: 'crtDate',
            key: 'crtDate',
            align:'center'
        },
        {
            title: '状态',
            dataIndex: 'statusDesc',
            key: 'statusDesc',
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
    // methods
    addNotice() {
        this.$router.push({
            name: '/admin/notice/add',
            params: {},
            query: {}    
        }).catch(err=>err)
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
        http.post('/api/notice/search',params).then(res=>{
            console.log(res,11111111111)
            if(res.data.code && res.data.code === '0'){
                if(res.data.data){
                    this.noticeDatas = res.data.data.datas
                    const pagination = { ...this.pagination };
                    pagination.total = res.data.data.total;
                    this.loading = false;
                    this.pagination = pagination;
                }else{
                    this.noticeDatas = []
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
            title:'',
            author:'',
            status:'',
            crtDate:[]
        }
    }
    handleTableChange(pagination: any){
        this.pagination = {...pagination}
        this.fetch()
    }
    editorNotice(id: string) {
        this.$router.push({
            name: '/admin/notice/upd',
            params: {
                id: id
            },
            query: {}    
        }).catch(err=>err)
    }
    deleteNotice(id: string) {
        const params = {
            id: id
        }
        http.post('/api/notice/del',params).then(res=>{
            if(res.data.code && res.data.code === '0'){
                // 删除成功
                this.$message.success(res.data.msg);
                this.pagination.current = 1
                this.fetch();
            }else{
              this.$message.error(res.data.msg);
            }
        }).catch(e=>{
            console.log(e)
        })
    }
    unreleaseNotice(id: string){
        const params = {
            id: id
        }
        http.post('/api/notice/unrelease',params).then(res=>{
            if(res.data.code && res.data.code === '0'){
                this.$message.success(res.data.msg);
                this.pagination.current = 1
                this.fetch();
            }else{
              this.$message.error(res.data.msg);
            }
        }).catch(e=>{
            console.log(e)
        })
    }
    releaseNotice(id: string){
        const params = {
            id: id
        }
        http.post('/api/notice/release',params).then(res=>{
            if(res.data.code && res.data.code === '0'){
                this.$message.success(res.data.msg);
                this.pagination.current = 1
                this.fetch();
            }else{
              this.$message.error(res.data.msg);
            }
        }).catch(e=>{
            console.log(e)
        })
    }
    // lifeCycle
    mounted() {
        this.fetch();
    }
    created() {
        // 查询页面字典
        const params = {
            phone:this.$store.state.phone,
            dicType:'NOTICE_STATUS'
        }
        http.post('/api/public/getDic',params).then(res=>{
            if(res.data){
                this.noticeStatus = res.data.data
            }else{
                this.noticeStatus = []
            }
        }).catch(e=>{
            console.log(e)
        })

    }
}

</script>

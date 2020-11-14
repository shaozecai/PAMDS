<template>
    <div class="user-list">
        <a-page-header style="border: 1px solid rgb(235, 237, 240)" :breadcrumb="{ props: { routes } }"/>
        <a-form-model :form="form" @submit="fetch" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-row :gutter="24">
                <a-col :span="8">
                    <a-form-model-item label="新闻编号">
                        <a-input
                        v-model="form.num"
                        placeholder="请输入"
                        />
                    </a-form-model-item>
                </a-col>
                <a-col :span="8">
                    <a-form-model-item label="新闻标题">
                        <a-input
                        v-model="form.title"
                        placeholder="请输入"
                        />
                    </a-form-model-item>
                </a-col>
                <a-col :span="8">
                    <a-form-model-item label="新闻摘要">
                        <a-input
                        v-model="form.des"
                        placeholder="请输入"
                        />
                    </a-form-model-item>
                </a-col>
                <a-col :span="8" :style="{ display:  showMore ? 'block' : 'none' }">
                    <a-form-model-item label="新闻状态">
                        <a-select v-model="form.status" placeholder="请选择状态">
                            <a-select-option v-for="dic in newStatus" :key="dic.dicCode" :value="dic.dicCode">
                                {{dic.dicCodeDes}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>  
                </a-col>
                

                <a-col :span="8" :style="{ display: showMore ? 'block' : 'none' }">
                    <a-form-model-item label="创建时间">
                        <a-range-picker v-model="form.crtDate" format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" :placeholder="['开始时间', '结束时间']"/>
                    </a-form-model-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center', marginBottom:'25px' }">
                    <a-button type="primary" html-type="submit">
                        查询
                    </a-button>
                    <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
                        重置
                    </a-button>
                    <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
                        高级查询 <a-icon :type="showMore ? 'up' : 'down'" />
                    </a>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="24">
                    <a-table
                        :columns="columns"
                        :row-key="record => record.id"
                        :data-source="newDatas"
                        :pagination="pagination"
                        :loading="loading"
                        @change="handleTableChange"
                    >
                        <template slot="operation" slot-scope="text, record">
                            <a-button type="link" @click="editorNew(record.id)">
                                查看
                            </a-button>
                            <a-button v-if="record.status === '001003'" type="link" @click="stopNew(record.id)">
                                暂停发布
                            </a-button>
                            <a-button v-if="record.status === '001004'" type="link" @click="resetNew(record.id)">
                                恢复发布
                            </a-button>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-form-model>
    </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import http from '@/public/javascript/http'

interface NewType {
    key: string;
    rn: string;
    num: string;
    title: string;
    author: string;
    crtDate: string;
    status: string;
    statusDesc: string;
}
interface DicType {
    dicType: string;
    dicTypeDes: string;
    dicCode: string;
    dicCodeDes: string;
    supDicCode: string;
}


@Component({
  components: {
   
  },
})
export default class AdminNewsSearch extends Vue {
    // data
    newStatus: Array<DicType> = []
    showMore = false
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
    newDatas: Array<NewType> = []
    routes = [
        {
            path: '/admin/home',
            breadcrumbName: '首页',
        },
        {
            path: '/admin/news/search',
            breadcrumbName: '新闻查询',
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
            title: '编号',
            dataIndex: 'num',
            key: 'num',
            align:'center'
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            scopedSlots: { customRender: 'title' },
            ellipsis: true,
            align:'center'
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
        },
    ]
    form = {
        num:'',
        title:'',
        des:'',
        status:'',
        crtDate:[]
    }
    labelCol = { span: 4 }
    wrapperCol = { span: 14 }
    // methods
    fetch() {
        this.loading = true;
        const params = {
            bgnNum: (this.pagination.current - 1)*this.pagination.pageSize,
            pageSize: this.pagination.pageSize,
            crtDateBgn: this.form.crtDate[0] ? this.form.crtDate[0] : '',
            crtDateEnd: this.form.crtDate[1] ? this.form.crtDate[1] : '',
            ...this.form
        }
        
        http.post('/api/news/search',params).then(res=>{
            if(res.data.code && res.data.code === '0'){
                if(res.data.data){
                    this.newDatas = res.data.data.datas
                    const pagination = { ...this.pagination };
                    pagination.total = res.data.data.total;
                    this.loading = false;
                    this.pagination = pagination;

                }else{
                    this.newDatas = []
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
            num:'',
            title:'',
            des:'',
            status:'',
            crtDate:[]
        }
    }
    handleTableChange(pagination: any){
        this.pagination = {...pagination}
        this.fetch()
    }
    editorNew(newId: string) {
        this.$router.push({
            name: '/admin/news/update',
            params: {
                id:newId
            },
            query: {}    
        }).catch(err=>err)
    }
    stopNew(newId: string) {
        const params = {
            id: newId
        }
        http.post('/api/news/stop',params).then(res=>{
            if(res.data.code && res.data.code === '0'){
                // 暂停成功
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
    resetNew(newId: string) {
        const params = {
            id: newId
        }
        http.post('/api/news/reset',params).then(res=>{
            if(res.data.code && res.data.code === '0'){
                // 恢复成功
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
    toggle() {
      this.showMore = !this.showMore;
    }
    // lifeCycle
    mounted() {
        this.fetch();
    }
    created() {
        // 查询页面字典
        const params = {
            phone:this.$store.state.phone,
            dicType:'NEW_STATUS'
        }
        http.post('/api/public/getDic',params).then(res=>{
            if(res.data){
                this.newStatus = res.data.data
            }else{
                this.newStatus = []
            }
        }).catch(e=>{
            console.log(e)
        })

    }
}

</script>

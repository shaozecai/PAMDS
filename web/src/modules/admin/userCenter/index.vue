<template>
    <div class="user-list">
        <a-page-header style="border: 1px solid rgb(235, 237, 240)" :breadcrumb="{ props: { routes } }"/>
        <a-row>
            <a-collapse accordion v-model="activeKey">
                <a-collapse-panel key="1" header="我的待办">
                    <a-table 
                    :columns="columns"
                    :row-key="record => record.rn"
                    :data-source="needDoDatas"
                    :pagination="pagination"
                    :loading="loading"
                    @change="handleTableChange" bordered center>
                        <a slot="operation" slot-scope="text,record">
                            <a-button type="link" @click="$message.info('开发中...')" v-if="record.status === '001001' || record.status === '002001'">
                                编辑 
                            </a-button>
                            <a-button type="link" @click="$message.info('开发中...')" v-if="record.status === '001002'">
                                审批 
                            </a-button>
                        </a>
                    </a-table>
                </a-collapse-panel>
                <a-collapse-panel key="2" header="我的已办" :disabled="false">
                    <a-table                     
                     :columns="columns"
                    :row-key="record => record.rn"
                    :data-source="doneDatas"
                    :pagination="pagination"
                    :loading="loading"
                    @change="handleTableChange" bordered center>
                        <a slot="operation" slot-scope="text,record">{{ record.num }}</a>
                    </a-table>
                </a-collapse-panel>
            </a-collapse>
        </a-row>
    </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import http from '@/public/javascript/http'

interface Datas {
    rn: string;
    type: string;
    typeDesc: string;
    num: string;
    title: string;
    updDate: string;
    status: string;
    statusDesc: string;
    operation: string;
}

@Component({})
export default class Home extends Vue {
    // data
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
    needDoDatas: Array<Datas> = []
    doneDatas: Array<Datas> = []
    activeKey = ['1']
    routes = [
        {
            path: '/admin/home',
            breadcrumbName: '首页',
        },
        {
            path: '/admin/userCenter',
            breadcrumbName: '个人中心',
        }
    ]
    columns = [
        {
            title: '类型',
            dataIndex: 'typeDesc',
            key: 'typeDesc',
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
            title: '最新修改时间',
            dataIndex: 'updDate',
            key: 'updDate',
            align:'center'
        },
        {
            title: '状态',
            dataIndex: 'statusDesc',
            key: 'statusDesc',
            align:'center'
            //scopedSlots: { customRender: 'name' },
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            align:'center',
            scopedSlots: { customRender: 'operation' },
        }
    ]
    
    // methods
    fetch() {
        this.loading = true;
        const params = {
            bgnNum: (this.pagination.current - 1)*this.pagination.pageSize,
            pageSize: this.pagination.pageSize
        }
        http.post('/api/userCenter/needDo',params).then(res=>{
            if(res.data.code && res.data.code === '0'){
                if(res.data.data){
                    this.needDoDatas = res.data.data.datas
                    const pagination = { ...this.pagination };
                    pagination.total = res.data.data.total;
                    this.loading = false;
                    this.pagination = pagination;
                }else{
                    this.needDoDatas = []
                }
            }else{
                this.loading = false;
                this.$message.error(res.data.msg);
            }
        }).catch(e=>{
            console.log(e)
        })
    }
    handleTableChange(pagination: any){
        this.pagination = {...pagination}
        this.fetch()
    }

    //lifeCycle
    created() {
        // 查询用户列表数据
        // const params = {
        //     phone:this.$store.state.phone
        // }
        // http.post('/api/userCenter/needDo',params).then(res=>{
        //     if(res.data){
        //         this.needDoDatas = res.data.data
        //     }else{
        //         this.needDoDatas = []
        //     }
        // }).catch(e=>{
        //     console.log(e)
        // })

    }
    mounted() {
        this.fetch()
    }
}

</script>

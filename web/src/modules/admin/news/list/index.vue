<template>
    <div class="user-list">
        <a-page-header style="border: 1px solid rgb(235, 237, 240)" :breadcrumb="{ props: { routes } }"/>
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
                            编辑
                        </a-button>
                        <a-button type="link" @click="deleteNew(record.id)">
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

@Component({
  components: {
   
  },
})
export default class AdminNewsList extends Vue {
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
            path: '/admin/news/list',
            breadcrumbName: '新闻列表',
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
    // methods
    fetch() {
        this.loading = true;
        const params = {
            phone: this.$store.state.phone,
            bgnNum: (this.pagination.current - 1)*this.pagination.pageSize,
            pageSize: this.pagination.pageSize
        }
        http.post('/api/news/list',params).then(res=>{
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
    deleteNew(newId: string) {
        const params = {
            id: newId
        }
        http.post('/api/news/del',params).then(res=>{
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
    // lifeCycle
    mounted() {
        this.fetch();
    }
    created() {
        // 查询用户列表数据
        // const params = {
        //     phone:this.$store.state.phone
        // }
        // http.post('/api/user/list',params).then(res=>{
        //     if(res.data){
        //         this.userDatas = res.data.data
        //     }else{
        //         this.userDatas = []
        //     }
        // }).catch(e=>{
        //     console.log(e)
        // })

    }
}

</script>

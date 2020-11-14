<template>
    <div class="user-list">
        <a-page-header style="border: 1px solid rgb(235, 237, 240)" :breadcrumb="{ props: { routes } }"/>
        <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
            <a-form-model-item label="标题" prop="title">
                <a-input v-model="form.title" />
            </a-form-model-item>
            <a-form-model-item label="状态" prop="status">
                <a-select v-model="form.status" placeholder="请选择状态">
                    <a-select-option v-for="dic in noticeStatus" :key="dic.dicCode" :value="dic.dicCode">
                        {{dic.dicCodeDes}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>  
            <a-form-model-item label="正文" prop="content">
                <div id="editor"></div>
                <a-input id="content" class="content" v-model="form.content" type="textarea" hidden/>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">
                    提交
                </a-button>
                <a-button style="margin-left: 10px;" @click="onCancle">
                    取消
                </a-button>
            </a-form-model-item>
        </a-form-model>
       
    </div>
</template>

<script lang='ts'>
import { FormModel } from 'ant-design-vue';
import { Component, Vue } from 'vue-property-decorator';
import http from '@/public/javascript/http'
import E from 'wangeditor'
interface DicType {
    dicType: string;
    dicTypeDes: string;
    dicCode: string;
    dicCodeDes: string;
    supDicCode: string;
}

@Component({})
export default class AdminNewsAdd extends Vue {
    // data
    noticeStatus: Array<DicType> = []
    routes = [
        {
            path: '/admin/home',
            breadcrumbName: '首页',
        },
        {
            path: '/admin/notice',
            breadcrumbName: '公告管理',
        },
        {
            path: '/admin/notice/upd',
            breadcrumbName: '公告更新',
        }
    ]
    labelCol = { span: 4 }
    wrapperCol = { span: 14 }
    form = {
        id:'',
        title: '',
        status: '',
        content:''
    }
    rules ={
        title: [
          { required: true, message: '请输入标题!', trigger: 'blur' },
          { min: 1, max: 100, message: '标题长度不能超过100!', trigger: 'blur' },
        ],
        status: [{ required: true, message: '请选择状态!', trigger: 'change' }],
        content: [{ required: true, message: '请输入正文!', trigger: 'blur' }],
    }
    // methods
    onSubmit() {
        (this.$refs['ruleForm'] as FormModel).validate((valid: boolean) => {
            if (valid) {
                // 修改公告
                const params = {
                    id: this.form.id,
                    title: this.form.title,
                    status: this.form.status,
                    content: this.form.content
                }
                http.post('/api/notice/upd',params).then(res=>{
                    if(res.data.code && res.data.code === '0'){
                        this.$message.success(res.data.msg);
                        this.$router.push({
                            name: '/admin/notice',
                            params: {},
                            query: {}    
                        }).catch(err=>err)
                    }else{
                        this.$message.error(res.data.msg);
                    }
                }).catch(e=>{
                    console.log(e)
                })
            } else {
                return false;
            }
        })
    }
    onCancle() {
        this.$router.push({
            name: '/admin/notice',
            params: {},
            query: {}    
        }).catch(err=>err)
    }
    // lifeCycle
    created() {
        // 查询页面字典
        const params = {
            phone:this.$store.state.phone,
            dicType:'NOTICE_STATUS'
        }
        http.post('/api/public/getDic',params).then(res=>{
            if(res.data.code && res.data.code === '0'){
                this.noticeStatus = res.data.data
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch(e=>{
            console.log(e)
        })
    }
    mounted() {
        const editor = new E('#editor')
        editor.config.onchange = (newHtml: any) => {
            const content: HTMLElement = document.getElementById('content') as HTMLElement
            content.innerHTML = newHtml
            this.form.content = newHtml
        }
        editor.create()

         // 查询公告基本信息
        const params2 = {
            id: this.$route.params.id
        }
        http.post('/api/notice/getInfo',params2).then(res=>{
            if(res.data.code && res.data.code === '0'){
                this.form = {...res.data.data}
                console.log(this.form.content,11111111111)
                editor.txt.html(this.form.content) // 重新设置编辑器内容
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch(e=>{
            console.log(e)
        })

    }
}
</script>

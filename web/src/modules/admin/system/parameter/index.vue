<template>
    <div class="user-list">
        <a-page-header style="border: 1px solid rgb(235, 237, 240)" :breadcrumb="{ props: { routes } }"/>
        <a-row>
            <a-col :span="24">
                参数管理内容
            </a-col>
        </a-row>
    </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class AdminSystemParameter extends Vue {
    routes = [
        {
            path: '/admin/home',
            breadcrumbName: '首页',
        },
        {
            path: '/admin/system/parameter',
            breadcrumbName: '参数管理',
        }
    ]
}
</script>

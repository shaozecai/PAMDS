<template>
  <div class="home">
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" :breadcrumb="{ props: { routes } }"/>
    <a-row>
      <a-col :span="12">
        <a-card title="角色总量分析" :bordered="true" style="width: 100%">
          <div ref="card1" style="width: 600px;height:300px"></div>
        </a-card>
      </a-col>
      <a-col :span="12">
         <a-card title="专业总量分析" :bordered="true" style="width: 100%">
          <div ref="card2" style="width: 600px;height:300px"></div>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="8">        
        <a-card title="总访问量" :bordered="true" style="width: 100%">
          <div ref="card3" style="width: 300px;height:300px"></div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="日志访问量" :bordered="true" style="width: 100%">
          <div ref="card4" style="width: 300px;height:300px"></div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="公告分析" :bordered="true" style="width: 100%">
          <div ref="card5" style="width: 300px;height:300px"></div>
        </a-card>
      </a-col>
      
    </a-row>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
   
  },
})
export default class Home extends Vue {
  routes = [
    {
        path: '/admin/home',
        breadcrumbName: '首页',
    }
  ]
  option1 = {
    xAxis: {
        type: 'category',
        data: ['管理员', '经办', '一级审核', '二级审核', '一级审批', '二级审批', '三级审批']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        // showBackground: true,
        // backgroundStyle: {
        //     color: 'rgba(220, 220, 220, 0.8)'
        // }
    }]
  };
  option2 = {
    xAxis: {
        type: 'category',
        data: ['专业1', '专业2', '专业3', '专业31', '专业32', '专业33']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 190, 80, 50, 60],
        type: 'bar',
        // showBackground: true,
        // backgroundStyle: {
        //     color: 'rgba(220, 220, 220, 0.8)'
        // }
    }]
  };
  option3 = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line'
    }]
  };
  option4 = {
      backgroundColor: '#2c343c',

      title: {
          text: 'Customized Pie',
          left: 'center',
          top: 20,
          textStyle: {
              color: '#ccc'
          }
      },

      tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
      },

      visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
              colorLightness: [0, 1]
          }
      },
      series: [
          {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: [
                  {value: 335, name: '直接访问'},
                  {value: 310, name: '邮件营销'},
                  {value: 274, name: '联盟广告'},
                  {value: 235, name: '视频广告'},
                  {value: 400, name: '搜索引擎'}
              ].sort(function (a, b) { return a.value - b.value; }),
              roseType: 'radius',
              label: {
                  color: 'rgba(255, 255, 255, 0.3)'
              },
              labelLine: {
                  lineStyle: {
                      color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
              },
              itemStyle: {
                  color: '#c23531',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              },

              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function () {
                  return Math.random() * 200;
              }
          }
      ]
  };

  mounted() {
    const card1 = this.$echarts.init(this.$refs.card1);
    card1.setOption(this.option1);

    const card2 = this.$echarts.init(this.$refs.card2);
    card2.setOption(this.option2);

    const card3 = this.$echarts.init(this.$refs.card3);
    card3.setOption(this.option3);

    const card4 = this.$echarts.init(this.$refs.card4);
    card4.setOption(this.option3);

    const card5 = this.$echarts.init(this.$refs.card5);
    card5.setOption(this.option4);

  }
}

</script>

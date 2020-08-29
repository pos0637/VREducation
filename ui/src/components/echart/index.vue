<template>
    <div>
        <div id="myChart" :style="{ width: '460px !important', height: '350px !important', margin: 'auto' }"></div>
    </div>
</template>

<script>
import echarts from 'echarts';

export default {
    props: {
        lineData: {}
    },
    watch: {
        lineData: function() {
            this.drawLine();
        }
    },
    mounted() {
        this.drawLine();
    },
    methods: {
        drawLine() {
            let series = [];
            let legend = [];
            this.lineData.forEach(item => {
                let j = {
                    name: item.name,
                    type: 'line',
                    lineStyle: {
                        color: item.color
                    },
                    data: item.point
                };
                series.push(j);
                legend.push(item.name);
            });
            let myChart = echarts.init(document.getElementById('myChart'));
            myChart.setOption({
                title: {
                    text: '实时曲线'
                },
                legend: {
                    data: legend
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: 'black'
                        }
                    }
                },
                xAxis: {
                    splitLine: {
                        show: true
                    }
                },
                yAxis: {},
                series: series,
                dataZoom: [
                    {
                        type: 'inside',
                        show: true,
                        xAxisIndex: [0]
                    }
                ]
            });
        }
    }
};
</script>

<style scoped>
#myChart {
    position: absolute !important;
}
</style>

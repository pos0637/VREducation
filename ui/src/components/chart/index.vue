<template>
    <div ref="container" class="container"><canvas ref="canvas" style="width: 100%; height: 100%" /><resize-observer @notify="_onResize" /></div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    border: 0;
}
</style>

<script>
import F2 from '@antv/f2';

export default {
    name: 'Chart',
    props: {
        charts: Array
    },
    data: function() {
        return {
            chart: null,
            points: []
        };
    },
    mounted() {
        this._generatePoints(this.charts);
        this._showCharts();
        this._onResize();
    },
    methods: {
        refreash(charts) {
            this._generatePoints(charts);
            this._showCharts();
        },
        _generatePoints(charts) {
            let points = [];
            for (const chart of charts) {
                points = points.concat(chart.points);
            }

            this.points = points;
        },
        _showCharts() {
            this.chart = new F2.Chart({
                el: this.$refs.canvas,
                pixelRatio: window.devicePixelRatio
            });

            this.chart.source(this.points);
            this.chart
                .line()
                .position('x*y')
                .color('type');
            this.chart.render();
        },
        _onResize() {
            const rect = this.$refs.container.getBoundingClientRect();
            this.$refs.canvas.width = rect.width;
            this.$refs.canvas.height = rect.height;
            // this.$refs.canvas.style.width = rect.width + 'px';
            // this.$refs.canvas.style.height = rect.height + 'px';
            this.chart.render();
        }
    }
};
</script>

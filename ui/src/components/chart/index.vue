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
            chart: null
        };
    },
    mounted() {
        this._showCharts();
        this._onResize();
    },
    methods: {
        _showCharts() {
            this.chart = new F2.Chart({
                el: this.$refs.canvas,
                pixelRatio: window.devicePixelRatio
            });

            const data = [
                { genre: 'Sports', sold: 275 },
                { genre: 'Strategy', sold: 115 },
                { genre: 'Action', sold: 120 },
                { genre: 'Shooter', sold: 350 },
                { genre: 'Other', sold: 150 }
            ];

            this.chart.source(data);
            this.chart
                .interval()
                .position('genre*sold')
                .color('genre');
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

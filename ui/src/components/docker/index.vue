<template>
    <div ref="container" class="container"><resize-observer @notify="_onResize" /></div>
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
import { getVariable } from '@/miscs/global';

export default {
    name: 'Docker',
    props: {
        target: String
    },
    mounted() {
        this._onResize();
    },
    beforeDestroy() {
        const rect = {};
        rect.target = this.target;
        rect.action = 'hide';
        getVariable('eventbus').$emit('docker_onResize', rect);
    },
    methods: {
        _onResize() {
            const rect = this.$refs.container.getBoundingClientRect();
            rect.target = this.target;
            rect.action = 'show';
            getVariable('eventbus').$emit('docker_onResize', rect);
        }
    }
};
</script>

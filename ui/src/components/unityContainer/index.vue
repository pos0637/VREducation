<template>
    <div class="unityContainer" ref="container" v-if="visiable">
        <iframe ref="frame" frameborder="0" scrolling="auto" src="unity/index.html"></iframe>
    </div>
</template>

<style scoped>
.unityContainer {
    position: absolute;
    left: 20px;
    top: 0px;
    width: 1px;
    height: 1px;
    z-index: -1;
}
</style>

<script>
import { getVariable } from '@/miscs/global';

export default {
    name: 'UnityContainer',
    props: {
        visiable: Boolean
    },
    created() {
        getVariable('eventbus').$on('docker_onResize', rect => {
            if (rect.target !== 'UnityContainer') {
                return;
            }

            if (rect.action === 'show') {
                this.$refs.container.style.left = rect.left + window.pageXOffset + 'px';
                this.$refs.container.style.top = rect.top + window.pageYOffset + 'px';
                this.$refs.container.style.width = rect.width + 'px';
                this.$refs.container.style.height = rect.height + 'px';
                this.$refs.container.style.zIndex = 1;

                const frame = this.$refs.frame;
                frame.style.width = rect.width + 'px';
                frame.style.height = rect.height + 'px';
            } else if (rect.action === 'hide') {
                this.$refs.container.style.zIndex = -1;
            }
        });
    }
};
</script>

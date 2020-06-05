<template>
    <div class="content">
        <a-layout style="width: 100%; height: 100%; background-color: #292929;">
            <a-row style="padding: 8px;">
                <a-col :span="12" style="text-align: left">
                    <span style="font-size: 1.4rem; color: white;">视觉工作站拆装</span>
                </a-col>
                <a-col :span="12" style="text-align: right">
                    <a-button type="primary" icon="forward" style="margin-left: 8px;" @click="_nextUnit">下一单元</a-button>
                </a-col>
            </a-row>
            <a-row style="width: 100%; height: 100%;">
                <Docker target="UnityContainer" />
            </a-row>
        </a-layout>
    </div>
</template>

<style scoped>
.content {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #292929;
}
</style>

<script>
import Docker from '@/components/docker';

export default {
    name: 'VisionSystemStructural',
    components: {
        Docker
    },
    mounted() {
        const gameInstance = top.window.gameInstance;
        top.window.onUnityInitialized = () => {
            setTimeout(() => {
                gameInstance.SendMessage('UintyConnectJS', 'StartScene', '');
            }, 1);
        };

        gameInstance.SendMessage('UintyConnectJS', 'SetScene', 4);
    },
    beforeDestroy() {
        top.window.onUnityInitialized = null;
    },
    methods: {
        _nextUnit() {
            this.$store.commit('changeScene', 'experiment', null, null);
        }
    }
};
</script>

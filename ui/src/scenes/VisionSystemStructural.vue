<template>
    <div class="content">
        <a-layout style="width: 100%; height: 100%; background-color: #292929;">
            <a-row style="padding: 8px;">
                <a-col :span="12" style="text-align: left">
                    <span style="font-size: 1.4rem; color: white;">视觉工作站拆装</span>
                </a-col>
                <a-col :span="12" style="text-align: right">
                    <a-button data-id="next_unit" type="primary" icon="forward" style="margin-left: 8px;" @click="_nextUnit">下一单元</a-button>
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
    data() {
        return {
            startPlay: false
        };
    },
    components: {
        Docker
    },
    mounted() {
        const options = {
            nextLabel: '<span style="font-size: 1.0rem">下一步</span>',
            prevLabel: '<span style="font-size: 1.0rem">上一步</span>',
            skipLabel: '<span style="font-size: 1.0rem">跳过</span>',
            doneLabel: '<span style="font-size: 1.0rem; color: blue">开始实验</span>',
            tooltipPosition: 'auto',
            exitOnEsc: false,
            exitOnOverlayClick: false
        };

        const steps = [
            {
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/vision.html"></iframe>'
            },
            {
                element: document.querySelectorAll('[data-id="next_unit"]')[0],
                intro: '实训完毕后点击 下一单元 按钮, 进入下一单元学习'
            }
        ];

        this.$intro()
            .setOptions(Object.assign(options, { steps: steps }))
            .onexit(() => {
                this.startPlay = true;
                this._onResize();
            })
            .start();
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
        _onResize() {
            if (!this.startPlay) {
                return;
            }

            const rect = this.$refs.container.$el.getBoundingClientRect();
            this.playerOptions.width = rect.width;
            this.playerOptions.height = rect.height;
        },
        _nextUnit() {
            this.$store.commit('changeScene', 'experiment', null, null);
        }
    }
};
</script>

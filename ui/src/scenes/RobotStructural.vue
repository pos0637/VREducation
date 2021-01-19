<template>
    <div class="content">
        <a-layout style="width: 100%; height: 100%; background-color: #292929;">
            <a-row style="padding: 8px;">
                <a-col :span="12" style="text-align: left">
                    <span style="font-size: 1.4rem; color: white;">工业机器人内部结构介绍</span>
                </a-col>
                <a-col :span="12" style="text-align: right">
                    <a-button data-id="next_unit" type="primary" icon="forward" style="margin-left: 8px;" @click="_readMore">延伸阅读</a-button>
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
    name: 'RobotStructural',
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
                intro: '<iframe frameborder="0" style="width: 70vw; height: 80vh; magin: 10px;" scrolling="auto" src="guides/structural.html"></iframe>'
            },
            {
                intro: '学习完毕后点击 下一单元 按钮, 进入下一单元学习'
            }
        ];

        this.$intro()
            .setOptions(Object.assign(options, { steps: steps }))
            .start();

        const gameInstance = top.window.gameInstance;
        top.window.onUnityInitialized = () => {
            setTimeout(() => {
                gameInstance.SendMessage('Unity2JS', 'StartScene', '');
            }, 1);
        };

        gameInstance.SendMessage('Unity2JS', 'SetScene', 2);
    },
    beforeDestroy() {
        top.window.onUnityInitialized = null;
    },
    methods: {
        _nextUnit() {
            this.$store.commit('changeScene', { scene: 'robotProgramming', stage: null, step: null });
        },
        _readMore() {
            window.open('./guides/readMore.html', '_blank');
        }
    }
};
</script>

<template>
    <div class="content">
        <a-layout style="width: 100%; height: 100%; background-color: #292929;">
            <a-row style="padding: 8px;">
                <a-col :span="12" style="text-align: left">
                    <span style="font-size: 1.4rem; color: white;">机器人示教原理</span>
                </a-col>
                <a-col :span="12" style="text-align: right">
                    <a-button data-id="next_unit" type="primary" icon="forward" style="margin-left: 8px;" @click="_nextUnit">下一单元</a-button>
                </a-col>
            </a-row>
            <a-row style="width: 100%; height: 100%;">
                <!-- <iframe :src="'https://view.officeapps.live.com/op/view.aspx?src=' + require('../assets/1.pptx')" width="100%" height="100%" frameborder="0" /> -->
                <iframe
                    :src="'https://view.officeapps.live.com/op/view.aspx?src=http://qiniu3.shangyunsoft.com/1.pptx'"
                    width="100%"
                    height="100%"
                    frameborder="0"
                />
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
export default {
    name: 'RobotProgramming',
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
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/programming.html"></iframe>'
            },
            {
                intro: '学习完毕后点击 下一单元 按钮, 进入下一单元学习'
            }
        ];

        this.$intro()
            .setOptions(Object.assign(options, { steps: steps }))
            .start();
    },
    methods: {
        _nextUnit() {
            this.$store.commit('changeScene', { scene: 'visionSystemStructural', stage: null, step: null });
        }
    }
};
</script>

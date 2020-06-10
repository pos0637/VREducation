<template>
    <div class="content">
        <a-layout style="width: 100%; height: 100%; background-color: #292929;">
            <a-row style="padding: 8px;">
                <a-col :span="12" style="text-align: left">
                    <span style="font-size: 1.4rem; color: white;">视觉抓取实验介绍</span>
                </a-col>
                <a-col :span="12" style="text-align: right">
                    <a-button data-id="next_unit" type="primary" icon="forward" style="margin-left: 8px;" @click="_nextUnit">下一单元</a-button>
                </a-col>
            </a-row>
            <a-row ref="container" style="width: 100%; height: 100%;">
                <video-player class="video-player-box" ref="videoPlayer" height="500" :options="playerOptions" :playsinline="true" />
                <resize-observer @notify="_onResize" />
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
import { videoPlayer } from 'vue-video-player';
import 'video.js/dist/video-js.css';

export default {
    name: 'Introduction',
    components: {
        videoPlayer
    },
    data() {
        return {
            startPlay: false,
            playerOptions: {
                autoplay: true,
                width: 0,
                height: 0,
                muted: true,
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                sources: [
                    {
                        type: 'video/mp4',
                        src: 'http://qblk2bgoy.bkt.clouddn.com/introduction.mp4'
                    }
                ]
            }
        };
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
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/introduction.html"></iframe>'
            },
            {
                intro: '观看完毕后点击 下一单元 按钮, 进入下一单元学习'
            }
        ];

        this.$intro()
            .setOptions(Object.assign(options, { steps: steps }))
            .onexit(() => {
                this.startPlay = true;
                this._onResize();
            })
            .start();
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
            this.$store.commit('changeScene', { scene: 'robotStructural', stage: null, step: null });
        }
    }
};
</script>

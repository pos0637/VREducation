<template>
    <div class="content">
        <a-layout style="width: 100%; height: 100%; background-color: #fff;">
            <a-row style="padding: 8px;">
                <a-col :span="12" style="text-align: left">
                    <span style="font-size: 1.4rem; color: black;">实验考核</span>
                </a-col>
                <a-col :span="12" style="text-align: right">
                    <a-button data-id="exam_button" type="primary" icon="question" style="margin-left: 8px" @click="_commit">提交实验考核结果</a-button>
                    <a-button type="primary" icon="forward" style="margin-left: 8px">下一单元</a-button>
                </a-col>
            </a-row>
            <a-row style="height: 100%">
                <a-col :span="16" class="codeEditor">
                    <CodeEditor ref="codeEditor" :blocks="blocks" :toolbox="toolbox" :inspectorVariables="inspectorVariables" :eventHandler="eventHandler" />
                </a-col>
                <a-col :span="8" style="height: 100%">
                    <a-layout style="width: 100%; height: 100%;">
                        <a-row style="height: 50%">
                            <Docker target="UnityContainer" />
                        </a-row>
                        <a-row style="height: 50%">
                            <Echarts :lineData="lineData" />
                        </a-row>
                    </a-layout>
                </a-col>
            </a-row>
        </a-layout>
        <Loading :visiable="loading" tip="加载中" />
    </div>
</template>

<style>
.introjs-tooltip {
    max-width: unset !important;
}
</style>

<style scoped>
.content {
    position: relative;
    width: 100%;
    height: 100%;
}

.codeEditor {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>

<script>
import { sleep } from '@/miscs/coroutine';
import Docker from '@/components/docker';
import CodeEditor from '@/components/codeEditor';
import Loading from '@/components/loading';
import Echarts from '@/components/echart';
import { blocks } from './blocks';
import { toolbox } from './toolbox';
import { buildSteps } from './tours';

export default {
    name: 'Exam',
    components: {
        Docker,
        CodeEditor,
        Loading,
        Echarts
    },
    data: function() {
        return {
            blocks: blocks,
            toolbox: toolbox,
            inspectorVariables: [],
            lineData: [],
            eventHandler: {
                beforeRunCode: async () => {
                    this.expectAltitude = 0.0;
                    this.altitude = 0.0;
                    this.pterm = 0.0;
                    this.iterm = 0.0;
                    this.dterm = 0.0;
                    this.lastError = 0.0;
                },
                runCode: async func => {
                    this.testNum++;
                    const point = [];
                    for (let i = 0; i < 300; ++i) {
                        console.debug(`run code: ${i}`);
                        await func();
                        point.push([i, this.altitude]);
                    }

                    const data = {
                        name: `第${this.testNum}次测试`,
                        point: point
                    };

                    const lineData = this.lineData;
                    if (lineData.length == 3) {
                        lineData.splice(0, 1);
                    }
                    lineData.push(data);

                    this.lineData = lineData;
                    // TODO:
                    this.gameInstance.SendMessage('DontDestory', 'UpdateTarget', 30);
                    this.gameInstance.SendMessage('DontDestory', 'ShowAni', 2);
                    this.gameInstance.SendMessage('DontDestory', 'StartScence', 1);
                }
            },
            loading: true,
            runFlag: false,
            gameInstance: null,
            expectAltitude: 0.0,
            altitude: 0.0,
            pterm: 0.0,
            iterm: 0.0,
            dterm: 0.0,
            lastError: 0.0,
            testNum: 0
        };
    },
    mounted() {
        top.window.get_altitude = async () => {
            let altitude = this.altitude - Math.round(Math.random() * 3);
            if (altitude < 0) {
                altitude = 0;
            }

            this.altitude = altitude;
            return altitude;
        };

        top.window.proportional = async proportional_value => {
            return proportional_value;
        };

        top.window.integral = async (integral_value, error) => {
            this.iterm += error * 1.0;
            return integral_value * this.iterm;
        };

        top.window.derivative = async (derivative_value, error) => {
            this.dterm = (error - this.lastError) / 1.0;
            this.lastError = error;
            return derivative_value * this.dterm;
        };

        top.window.speed = async (speed, expectAltitude) => {
            this.altitude += speed * 1.0;
            this.expectAltitude = expectAltitude;
            console.debug(`expect: ${expectAltitude}, altitude: ${this.altitude}, speed: ${speed}`);
        };

        let initialized = false;
        top.window.resetScene = async id => {
            this.gameInstance.SendMessage('DontDestory', 'SetScence', id);
            while (this.runFlag && !initialized) {
                await sleep(1000);
            }

            initialized = false;
        };

        top.window.onUnityInitialized = () => {
            this.loading = false;
            if (!this.runFlag) {
                this.runFlag = true;
                const options = {
                    nextLabel: '<span style="font-size: 1.0rem">下一步</span>',
                    prevLabel: '<span style="font-size: 1.0rem">上一步</span>',
                    skipLabel: '<span style="font-size: 1.0rem">跳过</span>',
                    doneLabel: '<span style="font-size: 1.0rem; color: blue">开始实验</span>',
                    tooltipPosition: 'auto',
                    tooltipClass: 'introjs-tooltip',
                    exitOnEsc: false,
                    exitOnOverlayClick: false
                };

                this.$intro()
                    .setOptions(Object.assign(options, buildSteps()[0]))
                    .onexit(() => this.$refs.codeEditor.updateToolbox())
                    .start();
            } else {
                setTimeout(() => {
                    console.debug('StartScene');
                    this.gameInstance.SendMessage('DontDestory', 'StartScence', 1);
                    initialized = true;
                }, 1);
            }
        };

        this.gameInstance = top.window.gameInstance;
        this.gameInstance.SendMessage('DontDestory', 'ReplaceScene', 1);
    },
    beforeDestroy() {
        top.window.onUnityInitialized = null;
        this.runFlag = false;
    },
    methods: {
        _commit() {}
    }
};
</script>

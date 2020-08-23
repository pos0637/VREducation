<template>
    <div class="content">
        <a-layout style="width: 100%; height: 100%; background-color: #fff;">
            <a-row style="padding: 8px;">
                <a-col :span="12" style="text-align: left">
                    <span style="font-size: 1.4rem; color: black;">无人机PID控制实验介绍</span>
                </a-col>
                <a-col :span="12" style="text-align: right">
                    <a-button type="primary" icon="right-square" style="margin-left: 8px" v-bind:disabled="!startExperiment" @click="_start">
                        {{ currentExperiment === null ? '开始实验' : experimentsFinish ? '实验完成' : '下一实验步骤' }}
                    </a-button>
                    <a-button type="primary" icon="question" style="margin-left: 8px" @click="_restart">重新学习</a-button>
                    <a-button type="primary" icon="forward" style="margin-left: 8px" @click="_nextUnit">下一单元</a-button>
                </a-col>
            </a-row>
            <a-row style="height: 100%">
                <a-col :span="16" class="codeEditor">
                    <CodeEditor
                        ref="codeEditor"
                        :blocks="blocks"
                        :toolbox="toolbox"
                        :tours="tours"
                        :experiments="experiments"
                        :inspectorVariables="inspectorVariables"
                        :eventHandler="eventHandler"
                    />
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
import { tours } from './tours';
import { buildExperiments } from './experiments';

export default {
    name: 'Experiment',
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
            tours: tours,
            experiments: buildExperiments(this),
            inspectorVariables: [],
            lineData: [],
            eventHandler: {
                onTourComplete: id => {
                    this.$refs.codeEditor.startExperiment(id);
                },
                onStartExperimentStep: experiment => {
                    this.currentExperiment = experiment.experiment;
                    this.currentStep = experiment.step;
                    this.$message.success(
                        `${experiment.step > 0 ? '操作成功, 下一步' : ''}${this.experiments[this.currentExperiment].steps[this.currentStep].intro}`,
                        2
                    );
                },
                onExperimentComplete: experiment => {
                    if (experiment.experiment === this.experiments.length - 1) {
                        this.experimentsFinish = true;
                        this.$message.success('本单元实验完成,请进入下一单元学习');
                    } else {
                        this.startExperiment = true;
                    }
                },
                beforeRunCode: async () => {
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
                    this.gameInstance.SendMessage('this.gameInstanceDontDestory', 'UpdateTarget', 30);
                    this.gameInstance.SendMessage('DontDestory', 'ShowAni', 2);
                    this.gameInstance.SendMessage('DontDestory', 'StartScence', 1);
                }
            },
            currentExperiment: null,
            currentStep: null,
            startExperiment: true,
            experimentsFinish: false,
            loading: true,
            runFlag: false,
            gameInstance: null,
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

        top.window.speed = async speed => {
            this.altitude += speed * 1.0;
            console.debug(`altitude: ${this.altitude}, speed: ${speed}`);
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
                this._start();
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
    watch: {
        '$store.state.stage': function() {
            this.startExperiment = false;
            this.$refs.codeEditor.startTour(this.$store.state.stage);
        }
    },
    methods: {
        _nextUnit() {
            this.$store.commit('changeScene', { scene: 'exam', stage: null, step: null });
        },
        _start() {
            if (this.currentExperiment === null) {
                this.startExperiment = false;
                this.$refs.codeEditor.startTour(this.$store.state.stage || 0);
            } else if (this.currentExperiment < this.experiments.length) {
                const scene = 'experiment' + (this.currentExperiment + 2);
                this.$store.commit('changeScene', { scene: scene, stage: this.currentExperiment + 1, step: null });
            }
        },
        _restart() {
            this.currentExperiment = null;
            this.currentStep = null;
            this.startExperiment = true;
            this.experimentsFinish = false;
            this._start();
        }
    }
};
</script>

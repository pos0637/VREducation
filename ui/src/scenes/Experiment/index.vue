<template>
    <div id="content">
        <a-layout style="width: 100%; height: 100%">
            <a-row>
                <a-col :span="12" style="text-align: left">
                    <span>提示信息: </span>
                    <span v-if="currentExperiment !== null && currentStep !== null"
                        >当前实验 {{ experiments[currentExperiment].name }}; 步骤: {{ experiments[currentExperiment].steps[currentStep].intro }}
                    </span>
                </a-col>
                <a-col :span="12" style="text-align: right">
                    <a-button type="primary" icon="right-square" style="margin-left: 8px" v-bind:disabled="!startExperiment" @click="_start">
                        {{ currentExperiment === null ? '开始实验' : experimentsFinish ? '实验完成' : '下一实验步骤' }}
                    </a-button>
                    <a-button type="primary" icon="question" style="margin-left: 8px" @click="_restart">重新学习</a-button>
                    <a-button type="primary" icon="forward" style="margin-left: 8px">下一单元</a-button>
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
                <a-col :span="8" class="vr">VR</a-col>
            </a-row>
        </a-layout>
    </div>
</template>

<style scoped>
#content {
    width: 100%;
    height: 100%;
}

#content .codeEditor {
    display: flex;
    flex-direction: column;
    height: 100%;
}

#content .vr {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>

<script>
import Blockly from 'blockly';
import { sleep } from '@/miscs/coroutine';
import CodeEditor from '@/components/codeEditor';
import { blocks } from './blocks';
import { toolbox } from './toolbox';
import { tours } from './tours';
import { buildExperiments } from './experiments';

export default {
    name: 'Experiment',
    components: {
        CodeEditor
    },
    data: function() {
        return {
            blocks: blocks,
            toolbox: Blockly.Xml.textToDom(toolbox),
            tours: tours,
            experiments: buildExperiments(this),
            inspectorVariables: [
                { name: '图片', id: 'inspector_variable_image1' },
                { name: '预处理图片', id: 'inspector_variable_image2' },
                { name: '边缘', id: 'inspector_variable_image3' },
                { name: '中心点', id: 'inspector_variable_image4' },
                { name: '工件类型', id: 'inspector_variable_image5' },
                { name: null, id: null }
            ],
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
                }
            },
            currentExperiment: null,
            currentStep: null,
            startExperiment: true,
            experimentsFinish: false,
            runFlag: false
        };
    },
    mounted() {
        this.runFlag = true;

        top.window.wait_for_sensor_signal = async () => {
            await sleep(1000);
        };

        top.window.camera_snapshot = async exposure => {
            console.debug(exposure);
            // eslint-disable-next-line no-undef
            const mat = cv.imread('test_image');
            this.$refs.codeEditor.setVariable('inspector_variable_image1', mat);
            return mat;
        };

        top.window.threshold = async (image, min, max) => {
            const dst = image.clone();
            // eslint-disable-next-line no-undef
            cv.cvtColor(dst, dst, cv.COLOR_BGR2GRAY);
            // eslint-disable-next-line no-undef
            cv.threshold(dst, dst, min, max, cv.THRESH_BINARY);
            this.$refs.codeEditor.setVariable('inspector_variable_image2', dst);
            return dst;
        };

        top.window.findcontours = async (image, min, max) => {
            const edges = image.clone();
            // eslint-disable-next-line no-undef
            cv.Canny(image, edges, min, max, 3);
            // eslint-disable-next-line no-undef
            let contours = new cv.MatVector();
            // eslint-disable-next-line no-undef
            let hierarchy = new cv.Mat();
            // eslint-disable-next-line no-undef
            cv.findContours(image, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
            // eslint-disable-next-line no-undef
            const dst = image.clone();
            // eslint-disable-next-line no-undef
            cv.cvtColor(dst, dst, cv.COLOR_GRAY2BGR);
            // eslint-disable-next-line no-undef
            cv.drawContours(dst, contours, -1, [0, 255, 0, 255], 2);
            this.$refs.codeEditor.setVariable('inspector_variable_image3', dst);
            return contours;
        };

        top.window.findcenter = async (contours, image) => {
            const dst = image.clone();
            // eslint-disable-next-line no-undef
            const moments = cv.moments(contours.get(1));
            // eslint-disable-next-line no-undef
            const epsilon = 0.01 * cv.arcLength(contours.get(1), true);
            // eslint-disable-next-line no-undef
            const approx = new cv.Mat();
            // eslint-disable-next-line no-undef
            cv.approxPolyDP(contours.get(1), approx, epsilon, true);
            // eslint-disable-next-line no-undef
            const rect = cv.minAreaRect(approx);
            const center = { x: moments.m10 / moments.m00, y: moments.m01 / moments.m00, angle: rect.angle.toFixed(1) };

            let startPoint = { x: center.x - 10, y: center.y };
            let endPoint = { x: center.x + 10, y: center.y };
            // eslint-disable-next-line no-undef
            cv.line(dst, startPoint, endPoint, [255, 0, 0, 255]);
            startPoint = { x: center.x, y: center.y - 10 };
            endPoint = { x: center.x, y: center.y + 10 };
            // eslint-disable-next-line no-undef
            cv.line(dst, startPoint, endPoint, [255, 0, 0, 255]);
            // eslint-disable-next-line no-undef
            cv.putText(dst, `x: ${center.x}, y: ${center.y}, angle: ${center.angle}`, startPoint, cv.FONT_HERSHEY_SIMPLEX, 0.5, [255, 0, 0, 255]);
            this.$refs.codeEditor.setVariable('inspector_variable_image4', dst);
            return center;
        };

        top.window.shapedetect = async (contours, image) => {
            const dst = image.clone();
            // eslint-disable-next-line no-undef
            const moments = cv.moments(contours.get(1));
            // eslint-disable-next-line no-undef
            const epsilon = 0.01 * cv.arcLength(contours.get(1), true);
            // eslint-disable-next-line no-undef
            const approx = new cv.Mat();
            // eslint-disable-next-line no-undef
            cv.approxPolyDP(contours.get(1), approx, epsilon, true);
            // eslint-disable-next-line no-undef
            const rect = cv.minAreaRect(approx);
            const center = { x: moments.m10 / moments.m00, y: moments.m01 / moments.m00, angle: rect.angle.toFixed(1) };
            // eslint-disable-next-line no-undef
            cv.putText(dst, `sharp: ${approx.rows}`, center, cv.FONT_HERSHEY_SIMPLEX, 0.5, [0, 0, 255, 255]);
            this.$refs.codeEditor.setVariable('inspector_variable_image5', dst);
            return approx.rows;
        };

        top.window.grab = async (sharp, center) => {
            console.debug(`sharp: ${sharp}, center: ${JSON.stringify(center)}`);
        };
    },
    beforeDestroy() {
        this.runFlag = false;
    },
    methods: {
        _start() {
            if (this.currentExperiment === null) {
                this.startExperiment = false;
                this.$refs.codeEditor.startTour(0);
            } else if (this.currentExperiment < this.experiments.length) {
                this.startExperiment = false;
                this.$refs.codeEditor.startTour(this.currentExperiment + 1);
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

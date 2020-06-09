<template>
    <div class="content">
        <a-layout style="width: 100%; height: 100%; background-color: #292929;">
            <a-row style="padding: 8px;">
                <a-col :span="12" style="text-align: left">
                    <span style="font-size: 1.4rem; color: white;">实验考核</span>
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
                    <Docker target="UnityContainer" />
                </a-col>
            </a-row>
        </a-layout>
        <Loading :visiable="loading" tip="加载中" />
        <img id="experiment_image" style="display: none" src="image/test.png" />
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
import { blocks } from './blocks';
import { toolbox } from './toolbox';
import { buildSteps } from './tours';

export default {
    name: 'Exam',
    components: {
        Docker,
        CodeEditor,
        Loading
    },
    data: function() {
        return {
            blocks: blocks,
            toolbox: toolbox,
            inspectorVariables: [
                { name: '图片', id: 'inspector_variable_image1' },
                { name: '预处理图片', id: 'inspector_variable_image2' },
                { name: '边缘', id: 'inspector_variable_image3' },
                { name: '中心点', id: 'inspector_variable_image4' },
                { name: '工件类型', id: 'inspector_variable_image5' },
                { name: null, id: null }
            ],
            eventHandler: {
                onRunCode: () => {
                    this.gameInstance.SendMessage('UintyConnectJS', 'SetScene', 3);
                }
            },
            loading: true,
            runFlag: false,
            gameInstance: null
        };
    },
    mounted() {
        let signal = false;
        top.window.onSignal = () => {
            console.debug('onSignal');
            signal = true;
        };

        top.window.wait_for_sensor_signal = async () => {
            while (this.runFlag && !signal) {
                await sleep(1000);
            }

            signal = false;
        };

        let image = false;
        top.window.onSnapshot = (sender, data) => {
            console.debug('onSnapshot');
            document.getElementById('experiment_image').src = 'data:image/png;base64,' + data;
            image = true;
        };

        top.window.camera_snapshot = async exposure => {
            this.gameInstance.SendMessage('UintyConnectJS', 'Snapshot', (exposure / 10000).toString());
            while (this.runFlag && !image) {
                await sleep(1000);
            }

            image = false;
            // eslint-disable-next-line no-undef
            const mat = cv.imread('experiment_image');
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
            const moments = cv.moments(contours.get(0));
            // eslint-disable-next-line no-undef
            const epsilon = 0.01 * cv.arcLength(contours.get(0), true);
            // eslint-disable-next-line no-undef
            const approx = new cv.Mat();
            // eslint-disable-next-line no-undef
            cv.approxPolyDP(contours.get(0), approx, epsilon, true);
            // eslint-disable-next-line no-undef
            const rect = cv.minAreaRect(approx);
            const center = { x: parseInt(moments.m10 / moments.m00), y: parseInt(moments.m01 / moments.m00), angle: rect.angle.toFixed(1) };

            let startPoint = { x: center.x - 10, y: center.y };
            let endPoint = { x: center.x + 10, y: center.y };
            // eslint-disable-next-line no-undef
            cv.line(dst, startPoint, endPoint, [255, 0, 0, 255]);
            startPoint = { x: center.x, y: center.y - 10 };
            endPoint = { x: center.x, y: center.y + 10 };
            // eslint-disable-next-line no-undef
            cv.line(dst, startPoint, endPoint, [255, 0, 0, 255]);
            // eslint-disable-next-line no-undef
            cv.putText(dst, `x: ${center.x}, y: ${center.y}, angle: ${center.angle}`, startPoint, cv.FONT_HERSHEY_SIMPLEX, 1, [255, 0, 0, 255]);
            this.$refs.codeEditor.setVariable('inspector_variable_image4', dst);
            return center;
        };

        top.window.shapedetect = async (contours, image) => {
            const dst = image.clone();
            // eslint-disable-next-line no-undef
            const moments = cv.moments(contours.get(0));
            // eslint-disable-next-line no-undef
            const epsilon = 0.01 * cv.arcLength(contours.get(0), true);
            // eslint-disable-next-line no-undef
            const approx = new cv.Mat();
            // eslint-disable-next-line no-undef
            cv.approxPolyDP(contours.get(0), approx, epsilon, true);
            const center = { x: parseInt(moments.m10 / moments.m00), y: parseInt(moments.m01 / moments.m00) };
            // eslint-disable-next-line no-undef
            cv.putText(dst, `sharp: ${approx.rows}`, center, cv.FONT_HERSHEY_SIMPLEX, 1, [0, 0, 255, 255]);
            this.$refs.codeEditor.setVariable('inspector_variable_image5', dst);
            return approx.rows;
        };

        top.window.grab = async (sharp, center) => {
            console.debug(`sharp: ${sharp}, center: ${JSON.stringify(center)}`);
            this.gameInstance.SendMessage('UintyConnectJS', 'Grab', `${center.x}:${center.y}`);
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
                    this.gameInstance.SendMessage('UintyConnectJS', 'StartScene', '');
                }, 1);
            }
        };

        this.gameInstance = top.window.gameInstance;
        this.gameInstance.SendMessage('UintyConnectJS', 'SetScene', 3);
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
<template>
    <div class="content">
        <a-layout style="width: 100%; height: 100%; background-color: #292929;">
            <a-row style="padding: 8px;">
                <a-col :span="12" style="text-align: left">
                    <span style="font-size: 1.4rem; color: white;">实验考核</span>
                </a-col>
                <a-col :span="12" style="text-align: right">
                    <a-button data-id="location_button" type="primary" icon="question" style="margin-left: 8px" @click="_generatedCode">生成代码</a-button>
                    <a-button data-id="location_button" type="primary" icon="question" style="margin-left: 8px" @click="getLocat">获取坐标</a-button>
                    <a-button data-id="exam_button" type="primary" icon="question" style="margin-left: 8px" @click="_commit">提交实验考核结果</a-button>
                    <a-button type="primary" icon="forward" style="margin-left: 8px">下一单元</a-button>
                </a-col>
            </a-row>
            <a-row style="height: 100%">
                <a-col :span="14" class="codeEditor">
                    <CodeEditor ref="codeEditor" :blocks="blocks" :toolbox="toolbox" :inspectorVariables="inspectorVariables" :eventHandler="eventHandler" />
                </a-col>
                <a-col :span="10" style="height: 100%">
                    <Docker target="UnityContainer" />
                </a-col>
            </a-row>
        </a-layout>
        <Loading :visiable="loading" tip="加载中" />
        <img id="experiment_image" style="display: none" src="image/test.png" />
        <a-modal v-if="visible" v-model="visible" :title="'实验报告'" on-ok="_handleOk" :maskClosable="false" :mask="true" centered :width="'98%'">
            <ExamReport :info="stepEntity" :base64Images="base64Images" />
            <template slot="footer">
                <a-button key="back" @click="_handleCancel">取消</a-button>
                <a-button key="submit" type="primary" @click="_handleOk">确认</a-button>
            </template>
        </a-modal>
        <a-modal v-if="codeVisible" v-model="codeVisible" :title="'运行代码'" :maskClosable="false" :mask="true" centered :width="'80%'">
            <div v-html="programCode"></div>
            <template slot="footer">
                <a-button key="back" @click="_onCodeModalCancel">取消</a-button>
            </template>
        </a-modal>
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
import ExamReport from '@/scenes/ExamReport/index2';
import { blocks } from './blocks';
import { toolbox } from './toolbox';
import { buildSteps } from './tours';
import { buildExperiments } from '../ExamReport/examReport';
import { getUserInfo } from '@/miscs/auth';
import request from '@/miscs/request';
import moment from 'moment';

export default {
    name: 'Exam',
    components: {
        Docker,
        CodeEditor,
        Loading,
        ExamReport
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
                onRunCode: async () => {
                    await top.window.resetScene(3);
                }
            },
            loading: true,
            runFlag: false,
            gameInstance: null,
            // 弹窗显示状态
            visible: false,
            codeVisible: false,
            stepEntity: {},
            experiments: buildExperiments(),
            userInfo: {},
            base64Images: [],
            // 发送给unity的坐标集合
            poses: [],
            programCode: ''
        };
    },
    mounted() {
        this.userInfo = getUserInfo();
        let signal = false;
        top.window.onSignal = () => {
            signal = true;
        };

        top.window.wait_for_sensor_signal = async () => {
            this.poses = [];
            this.gameInstance.SendMessage('Unity2JS', 'SpwanSeal');
            while (this.runFlag && !signal) {
                await sleep(1000);
            }
            signal = false;
        };

        let image = false;
        top.window.onSnapshot = (sender, data) => {
            document.getElementById('experiment_image').src = 'data:image/png;base64,' + data;
            image = true;
        };

        top.window.camera_snapshot = async exposure => {
            this.gameInstance.SendMessage('Unity2JS', 'Snapshot', (exposure / 10000).toString());
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
            this.poses.push({
                position: {
                    x: center.x,
                    y: center.y,
                    z: 0.0
                },
                quaternion: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0,
                    w: 1.0
                }
            });
            const sendPoses = {
                poses: this.poses
            };
            console.debug(`***grab-send***: ${JSON.stringify(sendPoses)}`);
            this.gameInstance.SendMessage('Unity2JS', 'Grab', `${JSON.stringify(sendPoses)}`);
            // this.gameInstance.SendMessage('Unity2JS', 'Grab', `${center.x}:${center.y}`);
        };

        let initialized = false;
        top.window.resetScene = async id => {
            console.debug('SetScene');
            this.gameInstance.SendMessage('Unity2JS', 'SetScene', id);
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
                    this.gameInstance.SendMessage('Unity2JS', 'StartScene', '');
                    initialized = true;
                }, 1);
            }
        };

        top.window.onRecord = currentLocat => {
            console.debug('getLocation==> ', currentLocat);
            const currentLocation = JSON.parse(currentLocat);
            const selectedBlock = this.$refs.codeEditor.selectedBlock;
            this.$refs.codeEditor.setBlockFieldText(selectedBlock.id, 'position', JSON.stringify(currentLocation.position));
            this.$refs.codeEditor.setBlockFieldText(selectedBlock.id, 'quaternion', JSON.stringify(currentLocation.quaternion));
        };

        top.window.addPoint = (positionValue, quaternionValue) => {
            console.debug('positionValue', positionValue);
            this.poses.push({
                position: positionValue,
                quaternion: quaternionValue
            });
        };

        this.gameInstance = top.window.gameInstance;
        this.gameInstance.SendMessage('Unity2JS', 'SetScene', 3);
        this.initialized();
    },
    beforeDestroy() {
        top.window.onUnityInitialized = null;
        this.runFlag = false;
    },
    methods: {
        initialized() {
            this.$refs.codeEditor.updateWorkspace(
                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable><variable id="ngGsJ|]W6|4*;S=B$V5t">中心点</variable><variable id="BjY+_k6qc`DvCq#D6ak|">工件类型</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">10</field><field name="max">30</field></block></value><next><block type="variables_set" id="NJQrl{iE7F]5wA$86b,Q"><field name="VAR" id="ngGsJ|]W6|4*;S=B$V5t">中心点</field><value name="VALUE"><block type="findcenter" id=",/Q06oI8k{MdjLT`9pn;"><field name="contours" id="01nW-U)u6HfpH,E[QV,m">边缘</field><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field></block></value><next><block type="variables_set" id="v)O#A+,Ll+7gTQFn^gQT"><field name="VAR" id="BjY+_k6qc`DvCq#D6ak|">工件类型</field><value name="VALUE"><block type="shapedetect" id="3y_lzy!6U0D^l%C`-^Tx"><field name="contours" id="01nW-U)u6HfpH,E[QV,m">边缘</field><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field></block></value></block></next></block></next></block></next></block></next></block></next></block></xml>'
            );
        },
        getImages() {
            this.base64Images = [];
            for (let index = 0; index < this.inspectorVariables.length; index++) {
                if (this.inspectorVariables[index].id !== null) {
                    const outputCanvas = document.getElementById(this.inspectorVariables[index].id);
                    this.base64Images[index] = {
                        id: this.inspectorVariables[index].id,
                        title: this.inspectorVariables[index].name,
                        url: outputCanvas.toDataURL('image/jpeg')
                    };
                }
            }
        },
        _commit() {
            var xml = this.$refs.codeEditor._generateXml();
            if (this.$refs.codeEditor._compareXml(this.experiments[0].expect)) {
                // 曝光值
                var cameraSnapshot = xml.querySelectorAll('[type="camera_snapshot"]>field[name="exposure"]');
                var cameraSnapshotValue;
                if (cameraSnapshot != undefined && cameraSnapshot.length > 0) {
                    cameraSnapshotValue = cameraSnapshot[0].innerHTML;
                    this.stepEntity.cameraSnapshotValue = cameraSnapshotValue;
                }
                // 二值化最小值
                var thresholdMin = xml.querySelectorAll('[type="threshold"]>field[name="min"]');
                var thresholdMinValue;
                if (thresholdMin != undefined && thresholdMin.length > 0) {
                    thresholdMinValue = thresholdMin[0].innerHTML;
                    this.stepEntity.thresholdMinValue = thresholdMinValue;
                }
                // 二值化最大值
                var thresholdMax = xml.querySelectorAll('[type="threshold"]>field[name="max"]');
                var thresholdMaxValue;
                if (thresholdMax != undefined && thresholdMax.length > 0) {
                    thresholdMaxValue = thresholdMax[0].innerHTML;
                    this.stepEntity.thresholdMaxValue = thresholdMaxValue;
                }
                // 提取边缘最小值
                var findcontoursMin = xml.querySelectorAll('[type="findcontours"]>field[name="min"]');
                var findcontoursMinValue;
                if (findcontoursMin != undefined && findcontoursMin.length > 0) {
                    findcontoursMinValue = findcontoursMin[0].innerHTML;
                    this.stepEntity.findcontoursMinValue = findcontoursMinValue;
                }
                // 提取边缘最大值
                var findcontoursMax = xml.querySelectorAll('[type="findcontours"]>field[name="max"]');
                var findcontoursMaxValue;
                if (findcontoursMax != undefined && findcontoursMax.length > 0) {
                    findcontoursMaxValue = findcontoursMax[0].innerHTML;
                    this.stepEntity.findcontoursMaxValue = findcontoursMaxValue;
                }
                this.getImages();
            }
            // } else {
            //     this.$message.error('自定义代码错误！请根据上一单元教学内容，拖拽正确的步骤。');
            // }

            this.visible = true;
        },
        // 是否能够提交
        _comitFlag() {
            return true;
        },
        _handleOk() {
            let examData = {
                userId: this.userInfo.id,
                name: '基于机器视觉的工业机器人动态抓取虚拟仿真实验',
                answers: JSON.stringify(this.stepEntity),
                score: '100',
                finishTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            };
            request({
                // url: '/online/cgform/api/form/d191982705574311b9526f0793ee500d',
                url: '/com.soft.gh/chengyiExperimentExamReport/add',
                method: 'POST',
                data: examData
            })
                .then(res => {
                    if (res.success) {
                        this._handleCancel();
                    } else {
                        this.$message.error(res.message);
                    }
                })
                .catch(() => {
                    //   this.requestCodeSuccess = false;
                });
        },
        _handleCancel() {
            this.visible = false;
        },
        _onCodeModalCancel() {
            this.codeVisible = false;
        },
        getLocat() {
            const selectedBlock = this.$refs.codeEditor.selectedBlock;
            if (selectedBlock !== null) {
                if (selectedBlock.getAttribute('type') === 'linearmotion' || selectedBlock.getAttribute('type') === 'curvemovement') {
                    console.log('Unity2JS--camera_snapshot');
                    this.gameInstance.SendMessage('Unity2JS', 'Record');
                } else {
                    this.$message.error(`只能给直线运动或曲线运动代码块赋值`, 2);
                }
            } else {
                this.$message.error(`请点击需要赋值的代码块`, 2);
            }
        },
        _getRawInstructions(xml) {
            const result = [];
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, 'text/xml');
            const blocks = doc.getElementsByTagName('block');
            for (let i = 0; i < blocks.length; i++) {
                const type = blocks[i].getAttribute('type');
                if (type === 'linearmotion' || type === 'curvemovement') {
                    const element = blocks[i];
                    let position = {};
                    let quaternion = {};
                    for (let j = 0; j < element.children.length; j++) {
                        const node = element.children[j];
                        if (node.nodeName === 'field') {
                            if (node.getAttribute('name') === 'position') {
                                position = JSON.parse(node.innerHTML);
                            } else if (node.getAttribute('name') === 'quaternion') {
                                quaternion = JSON.parse(node.innerHTML);
                            }
                        }
                    }

                    result.push({ type, position, quaternion });
                }
            }

            return result;
        },
        _generateInstructions(rawInstructions) {
            const result = [];

            for (let i = 0; i < rawInstructions.length; ++i) {
                const inst = rawInstructions[i];
                const p = inst.position;
                const q = inst.quaternion;
                result.push(`CONST robtarget P${i} := [[${p.x}, ${p.y}, ${p.z}],[${q.x}, ${q.y}, ${q.z}, ${q.w}],[0,0,0,0],[9E9,9E9,9E9,9E9,9E9,9E9]]`);
            }

            for (let i = 0; i < rawInstructions.length; ++i) {
                const inst = rawInstructions[i];
                const type = inst.type;
                if (type === 'linearmotion') {
                    result.push(`MoveL P${i}, v10, fine, tool1`);
                } else if (type === 'curvemovement') {
                    result.push(`MoveC P${i}, P${i}, v10, fine, tool1`);
                }
            }

            return result;
        },
        _generatedCode() {
            var xml = this.$refs.codeEditor._generateXml();
            const rawInstructions = this._getRawInstructions(this.XML2String(xml));
            const instructions = this._generateInstructions(rawInstructions);
            this.programCode = instructions;
            this.codeVisible = true;
        },
        XML2String(xmlObject) {
            // for IE
            if (window.ActiveXObject) {
                return xmlObject.xml;
            }
            // for other browsers
            else {
                return new XMLSerializer().serializeToString(xmlObject);
            }
        }
    }
};
</script>

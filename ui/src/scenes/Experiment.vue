<template>
    <div id="content">
        <a-layout style="width: 100%; height: 100%">
            <a-row>
                <a-col :span="16" style="text-align: left">
                    <span>当前实验 {{ currentExperiment }} 步骤: {{ currentStep }}</span>
                </a-col>
                <a-col :span="8" style="text-align: right">
                    <a-button type="primary" icon="question" style="margin-left: 16px">帮助</a-button>
                    <a-button type="primary" icon="forward" style="margin-left: 16px">下一步骤实验</a-button>
                </a-col>
            </a-row>
            <a-row style="height: 100%">
                <a-col :span="12" class="codeEditor">
                    <CodeEditor
                        ref="codeEditor"
                        :blocks="blocks"
                        :toolbox="toolbox"
                        :tours="tours"
                        :experiments="experiments"
                        :variables="variables"
                        :eventHandler="eventHandler"
                        :onTourComplete="_onTourComplete"
                        :onExperimentComplete="_onExperimentComplete"
                    />
                </a-col>
                <a-col :span="12" class="vr">VR</a-col>
            </a-row>
        </a-layout>
    </div>
</template>

<style>
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
import CodeEditor from '@/components/codeEditor';

export default {
    name: 'Experiment',
    components: {
        CodeEditor
    },
    data: function() {
        return {
            blocks: [
                {
                    type: 'camera_snapshot',
                    message0: '相机拍照 曝光值： %1 %2',
                    args0: [
                        {
                            type: 'field_number',
                            name: 'exposure',
                            value: 10000,
                            min: 0,
                            max: 20000,
                            precision: 0
                        },
                        {
                            type: 'input_value',
                            name: 'exportion'
                        }
                    ],
                    output: null,
                    colour: 120,
                    tooltip: '相机拍照。',
                    helpUrl: '',
                    javascript: block => {
                        var number_exposure = block.getFieldValue('exposure');
                        var code = `top.window.camera_snapshot(${number_exposure})`;
                        return [code, Blockly.JavaScript.ORDER_NONE];
                    }
                },
                {
                    type: 'wait_for_sensor_signal',
                    message0: '等待传感器信号 %1 %2',
                    args0: [
                        {
                            type: 'field_dropdown',
                            name: 'sensor',
                            options: [['光电传感器', '光电传感器']]
                        },
                        {
                            type: 'input_value',
                            name: 'sensor'
                        }
                    ],
                    previousStatement: null,
                    nextStatement: null,
                    colour: 230,
                    tooltip: '等待指定的传感器信号。',
                    helpUrl: 'http://www.baidu.com',
                    javascript: () => {
                        return 'top.window.wait_for_sensor_signal();\n';
                    }
                }
            ],
            toolbox: Blockly.Xml.textToDom(`<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
                    <block type="wait_for_sensor_signal" id="wait_for_sensor_signal">
                        <field name="sensor">光电传感器</field>
                    </block>
                    <block type="camera_snapshot" id="camera_snapshot"></block>
                    <block type="variables_get" id="variable_image_get">
                        <field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field>
                    </block>
                    <block type="variables_set" id="variable_image_set">
                        <field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field>
                    </block>
                </xml>`),
            tours: [
                [
                    {
                        intro: '<div style="width: 300px; height: 300px">视觉抓取实验介绍</div>'
                    },
                    {
                        intro: '<div style="width: 300px; height: 300px">第一步: 图像采集实验</div>'
                    },
                    {
                        elementId: '[data-id="wait_for_sensor_signal"]',
                        intro: '<div style="width: 300px; height: 300px">拖拽 等待传感器信号 功能块进入编程界面</div>'
                    },
                    {
                        elementId: '[data-id="variable_image_set"]',
                        intro: '<div style="width: 300px; height: 300px">拖拽 设置图片 功能块进入编程界面, 并与 等待传感器信号 功能块连接</div>'
                    },
                    {
                        elementId: '[data-id="camera_snapshot"]',
                        intro: '<div style="width: 300px; height: 300px">拖拽 相机拍照 功能块进入编程界面, 并与 设置图片 功能块连接</div>'
                    },
                    {
                        elementId: '[data-id="run_button"]',
                        intro: '<div style="width: 300px; height: 300px">点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果</div>'
                    }
                ],
                [
                    {
                        intro: '<div style="width: 300px; height: 300px">第二步: 工业相机曝光度实验</div>'
                    },
                    {
                        elementId: '[data-id="camera_snapshot"]',
                        intro: '<div style="width: 300px; height: 300px">设置 相机拍照 功能块曝光值为2000</div>'
                    },
                    {
                        elementId: '[data-id="run_button"]',
                        intro: '<div style="width: 300px; height: 300px">点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果</div>'
                    }
                ]
            ],
            experiments: [
                {
                    name: '图像采集实验',
                    steps: [
                        {
                            name: 'step1',
                            intro: '拖拽 等待传感器信号 功能块进入编程界面',
                            blocks: ['wait_for_sensor_signal'],
                            workspace: '<xml></xml>',
                            expect:
                                '<xml><block type="wait_for_sensor_signal" id="ujxLqORLSTv~h}xDbbEo" x="50" y="110"><field name="sensor">光电传感器</field></block></xml>'
                        },
                        {
                            name: 'step2',
                            intro: '拖拽 设置图片 功能块进入编程界面, 并与 等待传感器信号 功能块连接',
                            blocks: ['variables_set'],
                            workspace: null,
                            expect:
                                '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">图片</variable></variables><block type="wait_for_sensor_signal" id="?-d2,=9U[aKnRjqbr++i" x="30" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="nPZ`r~|}63pU]CikFm#4"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field></block></next></block></xml>'
                        },
                        {
                            name: 'step3',
                            intro: '拖拽 相机拍照 功能块进入编程界面, 并与 设置图片 功能块连接',
                            blocks: ['camera_snapshot'],
                            workspace: null,
                            expect:
                                '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">图片</variable></variables><block type="wait_for_sensor_signal" id="cm+9:4Bm_)|X^4NER|!+" x="30" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="8,I|d$U#:BKj-z3+Y95#"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field><value name="VALUE"><block type="camera_snapshot" id="6,rX@2g(?q5S77-N2gKW"><field name="exposure">10000</field></block></value></block></next></block></xml>'
                        },
                        {
                            name: 'step4',
                            intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                            buttons: ['run_button'],
                            workspace: null,
                            expect: () => true
                        }
                    ]
                },
                {
                    name: '工业相机曝光度实验',
                    steps: [
                        {
                            name: 'step1',
                            intro: '设置 相机拍照 功能块曝光值为2000',
                            blocks: ['wait_for_sensor_signal'],
                            workspace:
                                '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">图片</variable></variables><block type="wait_for_sensor_signal" id="cm+9:4Bm_)|X^4NER|!+" x="30" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="8,I|d$U#:BKj-z3+Y95#"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field><value name="VALUE"><block type="camera_snapshot" id="6,rX@2g(?q5S77-N2gKW"><field name="exposure">10000</field></block></value></block></next></block></xml>',
                            expect:
                                '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">图片</variable></variables><block type="wait_for_sensor_signal" id="cm+9:4Bm_)|X^4NER|!+" x="30" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="8,I|d$U#:BKj-z3+Y95#"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field><value name="VALUE"><block type="camera_snapshot" id="6,rX@2g(?q5S77-N2gKW"><field name="exposure">2000</field></block></value></block></next></block></xml>'
                        },
                        {
                            name: 'step2',
                            intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                            buttons: ['run_button'],
                            workspace: null,
                            expect: () => true
                        }
                    ]
                }
            ],
            variables: [
                { name: '图片', id: 'inspector_variable_image1' },
                { name: '图片', id: 'inspector_variable_image2' },
                { name: '图片', id: 'inspector_variable_image3' },
                { name: '图片', id: 'inspector_variable_image4' },
                { name: '图片', id: 'inspector_variable_image5' },
                { name: '图片', id: 'inspector_variable_image6' }
            ],
            eventHandler: {
                startExperiment: experiment => {
                    this.currentExperiment = this.experiments[experiment.experiment].name;
                    this.currentStep = this.experiments[experiment.experiment].steps[experiment.step].intro;
                },
                experimentComplete: () => {
                    this.currentStep = null;
                }
            },
            currentExperiment: null,
            currentStep: null
        };
    },
    mounted() {
        top.window.camera_snapshot = function(exposure) {
            alert(exposure);
        };

        top.window.wait_for_sensor_signal = function() {
            alert('wait_for_sensor_signal');
        };
        top.window.showImage = function() {
            // eslint-disable-next-line no-undef
            const mat = cv.Mat.ones(7, 7, cv.CV_8UC1);
            // eslint-disable-next-line no-undef
            cv.imshow('inspector_variable_image1', mat);
        };
    },
    methods: {
        _onTourComplete(id) {
            if (id === 0) {
                this.$refs.codeEditor.startExperiment(0);
            } else if (id === 1) {
                this.$refs.codeEditor.startExperiment(1);
            }
        },
        _onExperimentComplete(id) {
            if (id === 0) {
                this.$refs.codeEditor.startTour(1);
            } else if (id === 1) {
                alert('实验完成,请进入实验考核单元');
            }
        }
    }
};
</script>

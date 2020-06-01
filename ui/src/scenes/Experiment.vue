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

export default {
    name: 'Experiment',
    components: {
        CodeEditor
    },
    data: function() {
        return {
            blocks: [
                {
                    type: 'wait_for_sensor_signal',
                    message0: '等待传感器信号: %1',
                    args0: [
                        {
                            type: 'field_dropdown',
                            name: 'sensor',
                            options: [['光电传感器', '光电传感器']]
                        }
                    ],
                    previousStatement: null,
                    nextStatement: null,
                    colour: 230,
                    tooltip: '等待指定的传感器信号',
                    helpUrl: '',
                    javascript: () => {
                        return 'await top.window.wait_for_sensor_signal();\n';
                    }
                },
                {
                    type: 'camera_snapshot',
                    message0: '相机拍照 曝光值: %1',
                    args0: [
                        {
                            type: 'field_number',
                            name: 'exposure',
                            value: 10000,
                            min: 0,
                            max: 20000,
                            precision: 0
                        }
                    ],
                    output: null,
                    colour: 120,
                    tooltip: '相机拍照',
                    helpUrl: '',
                    javascript: block => {
                        const number_exposure = block.getFieldValue('exposure');
                        const code = `await top.window.camera_snapshot(${number_exposure})`;
                        return [code, Blockly.JavaScript.ORDER_NONE];
                    }
                },
                {
                    type: 'threshold',
                    message0: '二值化 图片: %1 %2 最小值: %3 %4 最大值: %5',
                    args0: [
                        {
                            type: 'field_variable',
                            name: 'image',
                            variable: '图片'
                        },
                        {
                            type: 'input_dummy'
                        },
                        {
                            type: 'field_number',
                            name: 'min',
                            value: 0,
                            min: 0,
                            max: 255,
                            precision: 0
                        },
                        {
                            type: 'input_dummy'
                        },
                        {
                            type: 'field_number',
                            name: 'max',
                            value: 255,
                            min: 0,
                            max: 255,
                            precision: 0
                        }
                    ],
                    inputsInline: false,
                    output: null,
                    colour: 120,
                    tooltip: '二值化',
                    helpUrl: '',
                    javascript: block => {
                        const image = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('image'), Blockly.Variables.NAME_TYPE);
                        const min = block.getFieldValue('min');
                        const max = block.getFieldValue('max');
                        const code = `await top.window.threshold(${image}, ${min}, ${max})`;
                        return [code, Blockly.JavaScript.ORDER_NONE];
                    }
                },
                {
                    type: 'findcontours',
                    message0: '提取边缘 图片: %1 %2 最小值: %3 %4 最大值: %5',
                    args0: [
                        {
                            type: 'field_variable',
                            name: 'image',
                            variable: '预处理图片'
                        },
                        {
                            type: 'input_dummy'
                        },
                        {
                            type: 'field_number',
                            name: 'min',
                            value: 0,
                            min: 0,
                            max: 255,
                            precision: 0
                        },
                        {
                            type: 'input_dummy'
                        },
                        {
                            type: 'field_number',
                            name: 'max',
                            value: 255,
                            min: 0,
                            max: 255,
                            precision: 0
                        }
                    ],
                    inputsInline: false,
                    output: null,
                    colour: 120,
                    tooltip: '提取边缘',
                    helpUrl: '',
                    javascript: block => {
                        const image = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('image'), Blockly.Variables.NAME_TYPE);
                        const min = block.getFieldValue('min');
                        const max = block.getFieldValue('max');
                        const code = `await top.window.findcontours(${image}, ${min}, ${max})`;
                        return [code, Blockly.JavaScript.ORDER_NONE];
                    }
                },
                {
                    type: 'findcenter',
                    message0: '提取中心点 边缘: %1, 图片: %2',
                    args0: [
                        {
                            type: 'field_variable',
                            name: 'contours',
                            variable: '边缘'
                        },
                        {
                            type: 'field_variable',
                            name: 'image',
                            variable: '图片'
                        }
                    ],
                    inputsInline: false,
                    output: null,
                    colour: 120,
                    tooltip: '提取中心点',
                    helpUrl: '',
                    javascript: block => {
                        const contours = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('contours'), Blockly.Variables.NAME_TYPE);
                        const image = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('image'), Blockly.Variables.NAME_TYPE);
                        const code = `await top.window.findcenter(${contours}, ${image})`;
                        return [code, Blockly.JavaScript.ORDER_NONE];
                    }
                },
                {
                    type: 'shapedetect',
                    message0: '形状识别 边缘: %1, 图片: %2',
                    args0: [
                        {
                            type: 'field_variable',
                            name: 'contours',
                            variable: '边缘'
                        },
                        {
                            type: 'field_variable',
                            name: 'image',
                            variable: '图片'
                        }
                    ],
                    inputsInline: false,
                    output: null,
                    colour: 120,
                    tooltip: '形状识别',
                    helpUrl: '',
                    javascript: block => {
                        const contours = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('contours'), Blockly.Variables.NAME_TYPE);
                        const image = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('image'), Blockly.Variables.NAME_TYPE);
                        const code = `await top.window.shapedetect(${contours}, ${image})`;
                        return [code, Blockly.JavaScript.ORDER_NONE];
                    }
                },
                {
                    type: 'grab',
                    message0: '机器人抓取 工件类型: %1 %2 中心点: %3',
                    args0: [
                        {
                            type: 'field_variable',
                            name: 'type',
                            variable: '工件类型'
                        },
                        {
                            type: 'input_dummy'
                        },
                        {
                            type: 'field_variable',
                            name: 'center',
                            variable: '中心点'
                        }
                    ],
                    inputsInline: false,
                    previousStatement: null,
                    nextStatement: null,
                    colour: 120,
                    tooltip: '机器人抓取',
                    helpUrl: '',
                    javascript: block => {
                        const type = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('type'), Blockly.Variables.NAME_TYPE);
                        const center = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('center'), Blockly.Variables.NAME_TYPE);
                        const code = `await top.window.grab(${type}, ${center});\n`;
                        return code;
                    }
                }
            ],
            toolbox: Blockly.Xml.textToDom(`<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
                    <block type="wait_for_sensor_signal" id="wait_for_sensor_signal">
                        <field name="sensor">光电传感器</field>
                    </block>
                    <block type="camera_snapshot" id="camera_snapshot"></block>
                    <block type="threshold" id="threshold"></block>
                    <block type="findcontours" id="findcontours"></block>
                    <block type="findcenter" id="findcenter"></block>
                    <block type="shapedetect" id="shapedetect"></block>
                    <block type="grab" id="grab"></block>
                    <block type="variables_set" id="variable_image_set">
                        <field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field>
                    </block>
                    <block type="variables_set" id="variable_preprocess_image_set">
                        <field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">预处理图片</field>
                    </block>
                    <block type="variables_set" id="variable_contour_set">
                        <field name="VAR" id="]i17utjfOMJY=.sIUx1m">边缘</field>
                    </block>
                    <block type="variables_set" id="variable_center_set">
                        <field name="VAR" id="82jjstjfOMJY=.s1123c">中心点</field>
                    </block>
                    <block type="variables_set" id="variable_sharp_set">
                        <field name="VAR" id="bgehjfOMJY=.s11o5al1">工件类型</field>
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
                ],
                [
                    {
                        intro: '<div style="width: 300px; height: 300px">第三步: 图像预处理实验</div>'
                    },
                    {
                        elementId: '[data-id="variable_preprocess_image_set"]',
                        intro: '<div style="width: 300px; height: 300px">拖拽 设置预处理图片 功能块进入编程界面, 并与 设置图片 功能块连接</div>'
                    },
                    {
                        elementId: '[data-id="threshold"]',
                        intro: '<div style="width: 300px; height: 300px">拖拽 二值化 功能块进入编程界面, 并与 设置预处理图片 功能块连接</div>'
                    },
                    {
                        elementId: '[data-id="run_button"]',
                        intro: '<div style="width: 300px; height: 300px">点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果</div>'
                    }
                ],
                [
                    {
                        intro: '<div style="width: 300px; height: 300px">第四步: 二值化调整阈值实验</div>'
                    },
                    {
                        elementId: '[data-id="threshold"]',
                        intro: '<div style="width: 300px; height: 300px">设置 二值化 功能块最小值为50, 最大值为100</div>'
                    },
                    {
                        elementId: '[data-id="run_button"]',
                        intro: '<div style="width: 300px; height: 300px">点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果</div>'
                    }
                ],
                [
                    {
                        intro: '<div style="width: 300px; height: 300px">第五步: 提取边缘实验</div>'
                    },
                    {
                        elementId: '[data-id="variable_contour_set"]',
                        intro: '<div style="width: 300px; height: 300px">拖拽 设置边缘 功能块进入编程界面, 并与 设置预处理图片 功能块连接</div>'
                    },
                    {
                        elementId: '[data-id="findcontours"]',
                        intro: '<div style="width: 300px; height: 300px">拖拽 提取边缘 功能块进入编程界面, 并与 设置边缘 功能块连接</div>'
                    },
                    {
                        elementId: '[data-id="run_button"]',
                        intro: '<div style="width: 300px; height: 300px">点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果</div>'
                    }
                ],
                [
                    {
                        intro: '<div style="width: 300px; height: 300px">第六步: 提取边缘调整阈值实验</div>'
                    },
                    {
                        elementId: '[data-id="findcontours"]',
                        intro: '<div style="width: 300px; height: 300px">设置 提取边缘 功能块最小值为10, 最大值为30</div>'
                    },
                    {
                        elementId: '[data-id="run_button"]',
                        intro: '<div style="width: 300px; height: 300px">点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果</div>'
                    }
                ],
                [
                    {
                        intro: '<div style="width: 300px; height: 300px">第七步: 提取中心点实验</div>'
                    },
                    {
                        elementId: '[data-id="variable_center_set"]',
                        intro: '<div style="width: 300px; height: 300px">拖拽 设置中心点 功能块进入编程界面, 并与 设置边缘 功能块连接</div>'
                    },
                    {
                        elementId: '[data-id="findcenter"]',
                        intro: '<div style="width: 300px; height: 300px">拖拽 提取中心点 功能块进入编程界面, 并与 设置中心点 功能块连接</div>'
                    },
                    {
                        elementId: '[data-id="run_button"]',
                        intro: '<div style="width: 300px; height: 300px">点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果</div>'
                    }
                ],
                [
                    {
                        intro: '<div style="width: 300px; height: 300px">第八步: 形状识别实验</div>'
                    },
                    {
                        elementId: '[data-id="variable_sharp_set"]',
                        intro: '<div style="width: 300px; height: 300px">拖拽 设置工件类型 功能块进入编程界面, 并与 设置中心点 功能块连接</div>'
                    },
                    {
                        elementId: '[data-id="shapedetect"]',
                        intro: '<div style="width: 300px; height: 300px">拖拽 形状识别 功能块进入编程界面, 并与 设置工件类型 功能块连接</div>'
                    },
                    {
                        elementId: '[data-id="run_button"]',
                        intro: '<div style="width: 300px; height: 300px">点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果</div>'
                    }
                ],
                [
                    {
                        intro: '<div style="width: 300px; height: 300px">第九步: 机器人抓取实验</div>'
                    },
                    {
                        elementId: '[data-id="grab"]',
                        intro: '<div style="width: 300px; height: 300px">拖拽 机器人抓取 功能块进入编程界面, 并与 设置工件类型 功能块连接</div>'
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
                            blocks: ['variable_image_set'],
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
                            expect: async () => {
                                while (this.runFlag && typeof this.$refs.codeEditor.getVariable('inspector_variable_image1') === 'undefined') {
                                    await sleep(1000);
                                }

                                return true;
                            }
                        }
                    ]
                },
                {
                    name: '工业相机曝光度实验',
                    steps: [
                        {
                            name: 'step1',
                            intro: '设置 相机拍照 功能块曝光值为2000',
                            blocks: [],
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
                            expect: async () => {
                                while (this.runFlag && typeof this.$refs.codeEditor.getVariable('inspector_variable_image1') === 'undefined') {
                                    await sleep(1000);
                                }

                                return true;
                            }
                        }
                    ]
                },
                {
                    name: '图像预处理实验',
                    steps: [
                        {
                            name: 'step1',
                            intro: '拖拽 设置预处理图片 功能块进入编程界面, 并与 设置图片 功能块连接',
                            blocks: ['variable_preprocess_image_set'],
                            workspace:
                                '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">图片</variable></variables><block type="wait_for_sensor_signal" id="cm+9:4Bm_)|X^4NER|!+" x="30" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="8,I|d$U#:BKj-z3+Y95#"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field><value name="VALUE"><block type="camera_snapshot" id="6,rX@2g(?q5S77-N2gKW"><field name="exposure">2000</field></block></value></block></next></block></xml>',
                            expect:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field></block></next></block></next></block></xml>'
                        },
                        {
                            name: 'step2',
                            intro: '拖拽 二值化 功能块进入编程界面, 并与 设置预处理图片 功能块连接',
                            blocks: ['threshold'],
                            workspace: null,
                            expect:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">0</field><field name="max">255</field></block></value></block></next></block></next></block></xml>'
                        },
                        {
                            name: 'step3',
                            intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                            buttons: ['run_button'],
                            workspace: null,
                            expect: async () => {
                                while (this.runFlag && typeof this.$refs.codeEditor.getVariable('inspector_variable_image2') === 'undefined') {
                                    await sleep(1000);
                                }

                                return true;
                            }
                        }
                    ]
                },
                {
                    name: '二值化调整阈值实验',
                    steps: [
                        {
                            name: 'step1',
                            intro: '设置 二值化 功能块最小值为50, 最大值为100',
                            blocks: [],
                            workspace:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">0</field><field name="max">255</field></block></value></block></next></block></next></block></xml>',
                            expect:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value></block></next></block></next></block></xml>'
                        },
                        {
                            name: 'step2',
                            intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                            buttons: ['run_button'],
                            workspace: null,
                            expect: async () => {
                                while (this.runFlag && typeof this.$refs.codeEditor.getVariable('inspector_variable_image2') === 'undefined') {
                                    await sleep(1000);
                                }

                                return true;
                            }
                        }
                    ]
                },
                {
                    name: '提取边缘实验',
                    steps: [
                        {
                            name: 'step1',
                            intro: '拖拽 设置边缘 功能块进入编程界面, 并与 设置预处理图片 功能块连接',
                            blocks: ['variable_contour_set'],
                            workspace:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value></block></next></block></next></block></xml>',
                            expect:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="PkD/zC*z$W?+u=xeypj7">边缘</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="2LGi|)M~RCo=skkRJ:[{"><field name="VAR" id="PkD/zC*z$W?+u=xeypj7">边缘</field></block></next></block></next></block></next></block></xml>'
                        },
                        {
                            name: 'step2',
                            intro: '拖拽 提取边缘 功能块进入编程界面, 并与 设置边缘 功能块连接',
                            blocks: ['findcontours'],
                            workspace: null,
                            expect:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">0</field><field name="max">255</field></block></value></block></next></block></next></block></next></block></xml>'
                        },
                        {
                            name: 'step3',
                            intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                            buttons: ['run_button'],
                            workspace: null,
                            expect: async () => {
                                while (this.runFlag && typeof this.$refs.codeEditor.getVariable('inspector_variable_image3') === 'undefined') {
                                    await sleep(1000);
                                }

                                return true;
                            }
                        }
                    ]
                },
                {
                    name: '提取边缘调整阈值实验',
                    steps: [
                        {
                            name: 'step1',
                            intro: '设置 提取边缘 功能块最小值为10, 最大值为30',
                            blocks: [],
                            workspace:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">0</field><field name="max">255</field></block></value></block></next></block></next></block></next></block></xml>',
                            expect:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">10</field><field name="max">30</field></block></value></block></next></block></next></block></next></block></xml>'
                        },
                        {
                            name: 'step2',
                            intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                            buttons: ['run_button'],
                            workspace: null,
                            expect: async () => {
                                while (this.runFlag && typeof this.$refs.codeEditor.getVariable('inspector_variable_image3') === 'undefined') {
                                    await sleep(1000);
                                }

                                return true;
                            }
                        }
                    ]
                },
                {
                    name: '提取中心点实验',
                    steps: [
                        {
                            name: 'step1',
                            intro: '拖拽 设置中心点 功能块进入编程界面, 并与 设置边缘 功能块连接',
                            blocks: ['variable_center_set'],
                            workspace:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">10</field><field name="max">30</field></block></value></block></next></block></next></block></next></block></xml>',
                            expect:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable><variable id="(Uam!xsmGR+*mO!fEc~h">中心点</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">10</field><field name="max">30</field></block></value><next><block type="variables_set" id="zVAyF7xr,={!aZl,7x]l"><field name="VAR" id="(Uam!xsmGR+*mO!fEc~h">中心点</field></block></next></block></next></block></next></block></next></block></xml>'
                        },
                        {
                            name: 'step2',
                            intro: '拖拽 提取中心点 功能块进入编程界面, 并与 设置中心点 功能块连接',
                            blocks: ['findcenter'],
                            workspace: null,
                            expect:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable><variable id="ngGsJ|]W6|4*;S=B$V5t">中心点</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">10</field><field name="max">30</field></block></value><next><block type="variables_set" id="NJQrl{iE7F]5wA$86b,Q"><field name="VAR" id="ngGsJ|]W6|4*;S=B$V5t">中心点</field><value name="VALUE"><block type="findcenter" id=",/Q06oI8k{MdjLT`9pn;"><field name="contours" id="01nW-U)u6HfpH,E[QV,m">边缘</field><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field></block></value></block></next></block></next></block></next></block></next></block></xml>'
                        },
                        {
                            name: 'step3',
                            intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                            buttons: ['run_button'],
                            workspace: null,
                            expect: async () => {
                                while (this.runFlag && typeof this.$refs.codeEditor.getVariable('inspector_variable_image4') === 'undefined') {
                                    await sleep(1000);
                                }

                                return true;
                            }
                        }
                    ]
                },
                {
                    name: '形状识别实验',
                    steps: [
                        {
                            name: 'step1',
                            intro: '拖拽 设置工件类型 功能块进入编程界面, 并与 设置中心点 功能块连接',
                            blocks: ['variable_sharp_set'],
                            workspace:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable><variable id="ngGsJ|]W6|4*;S=B$V5t">中心点</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">10</field><field name="max">30</field></block></value><next><block type="variables_set" id="NJQrl{iE7F]5wA$86b,Q"><field name="VAR" id="ngGsJ|]W6|4*;S=B$V5t">中心点</field><value name="VALUE"><block type="findcenter" id=",/Q06oI8k{MdjLT`9pn;"><field name="contours" id="01nW-U)u6HfpH,E[QV,m">边缘</field><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field></block></value></block></next></block></next></block></next></block></next></block></xml>',
                            expect:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable><variable id="ngGsJ|]W6|4*;S=B$V5t">中心点</variable><variable id="9/|0Ekydm$}$zhqi02a$">工件类型</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">10</field><field name="max">30</field></block></value><next><block type="variables_set" id="NJQrl{iE7F]5wA$86b,Q"><field name="VAR" id="ngGsJ|]W6|4*;S=B$V5t">中心点</field><value name="VALUE"><block type="findcenter" id=",/Q06oI8k{MdjLT`9pn;"><field name="contours" id="01nW-U)u6HfpH,E[QV,m">边缘</field><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field></block></value><next><block type="variables_set" id="hd0a^HIA|7yBWdTG.Il("><field name="VAR" id="9/|0Ekydm$}$zhqi02a$">工件类型</field></block></next></block></next></block></next></block></next></block></next></block></xml>'
                        },
                        {
                            name: 'step2',
                            intro: '拖拽 形状识别 功能块进入编程界面, 并与 设置工件类型 功能块连接',
                            blocks: ['shapedetect'],
                            workspace: null,
                            expect:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable><variable id="ngGsJ|]W6|4*;S=B$V5t">中心点</variable><variable id="BjY+_k6qc`DvCq#D6ak|">工件类型</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">10</field><field name="max">30</field></block></value><next><block type="variables_set" id="NJQrl{iE7F]5wA$86b,Q"><field name="VAR" id="ngGsJ|]W6|4*;S=B$V5t">中心点</field><value name="VALUE"><block type="findcenter" id=",/Q06oI8k{MdjLT`9pn;"><field name="contours" id="01nW-U)u6HfpH,E[QV,m">边缘</field><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field></block></value><next><block type="variables_set" id="v)O#A+,Ll+7gTQFn^gQT"><field name="VAR" id="BjY+_k6qc`DvCq#D6ak|">工件类型</field><value name="VALUE"><block type="shapedetect" id="3y_lzy!6U0D^l%C`-^Tx"><field name="contours" id="01nW-U)u6HfpH,E[QV,m">边缘</field><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field></block></value></block></next></block></next></block></next></block></next></block></next></block></xml>'
                        },
                        {
                            name: 'step3',
                            intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                            buttons: ['run_button'],
                            workspace: null,
                            expect: async () => {
                                while (this.runFlag && typeof this.$refs.codeEditor.getVariable('inspector_variable_image5') === 'undefined') {
                                    await sleep(1000);
                                }

                                return true;
                            }
                        }
                    ]
                },
                {
                    name: '机器人抓取实验',
                    steps: [
                        {
                            name: 'step1',
                            intro: '拖拽 机器人抓取 功能块进入编程界面, 并与 设置工件类型 功能块连接',
                            blocks: ['grab'],
                            workspace:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable><variable id="ngGsJ|]W6|4*;S=B$V5t">中心点</variable><variable id="BjY+_k6qc`DvCq#D6ak|">工件类型</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">10</field><field name="max">30</field></block></value><next><block type="variables_set" id="NJQrl{iE7F]5wA$86b,Q"><field name="VAR" id="ngGsJ|]W6|4*;S=B$V5t">中心点</field><value name="VALUE"><block type="findcenter" id=",/Q06oI8k{MdjLT`9pn;"><field name="contours" id="01nW-U)u6HfpH,E[QV,m">边缘</field><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field></block></value><next><block type="variables_set" id="v)O#A+,Ll+7gTQFn^gQT"><field name="VAR" id="BjY+_k6qc`DvCq#D6ak|">工件类型</field><value name="VALUE"><block type="shapedetect" id="3y_lzy!6U0D^l%C`-^Tx"><field name="contours" id="01nW-U)u6HfpH,E[QV,m">边缘</field><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field></block></value></block></next></block></next></block></next></block></next></block></next></block></xml>',
                            expect:
                                '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable><variable id="ngGsJ|]W6|4*;S=B$V5t">中心点</variable><variable id="BjY+_k6qc`DvCq#D6ak|">工件类型</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">10</field><field name="max">30</field></block></value><next><block type="variables_set" id="NJQrl{iE7F]5wA$86b,Q"><field name="VAR" id="ngGsJ|]W6|4*;S=B$V5t">中心点</field><value name="VALUE"><block type="findcenter" id=",/Q06oI8k{MdjLT`9pn;"><field name="contours" id="01nW-U)u6HfpH,E[QV,m">边缘</field><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field></block></value><next><block type="variables_set" id="v)O#A+,Ll+7gTQFn^gQT"><field name="VAR" id="BjY+_k6qc`DvCq#D6ak|">工件类型</field><value name="VALUE"><block type="shapedetect" id="3y_lzy!6U0D^l%C`-^Tx"><field name="contours" id="01nW-U)u6HfpH,E[QV,m">边缘</field><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field></block></value><next><block type="grab" id="cb5V(=WdDnvY@3cqo):6"><field name="type" id="BjY+_k6qc`DvCq#D6ak|">工件类型</field><field name="center" id="ngGsJ|]W6|4*;S=B$V5t">中心点</field></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>'
                        },
                        {
                            name: 'step2',
                            intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                            buttons: ['run_button'],
                            workspace: null,
                            expect: async () => true
                        }
                    ]
                }
            ],
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

<template>
    <div id="content">
        <a-layout style="width: 100%; height: 100%">
            <a-row style="text-align: left">
                <a-button type="primary" icon="right-square" style="margin-left: 16px">运行</a-button>
                <a-button type="primary" icon="question" style="margin-left: 16px">帮助</a-button>
                <a-button type="primary" icon="forward" style="margin-left: 16px">下一步骤实验</a-button>
            </a-row>
            <a-row style="height: 100%">
                <a-col :span="12" class="codeEditor">
                    <CodeEditor :blocks="this.blocks" :toolbox="this.toolbox" :tours="this.tours" />
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
                        var code = `camera_snapshot(${number_exposure})`;
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
                        return 'wait_for_sensor_signal();\n';
                    }
                }
            ],
            toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
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
            </xml>`,
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
                        intro: '<div style="width: 300px; height: 300px">Hello</div>'
                    },
                    {
                        elementId: '[data-id="camera_snapshot"]',
                        intro: 'step2'
                    }
                ]
            ],
            experiments: [
                [
                    {
                        name: 'step1',
                        blocks: ['wait_for_sensor_signal'],
                        workspace: '<xml></xml>',
                        expect:
                            '<xml><block type="wait_for_sensor_signal" id="ujxLqORLSTv~h}xDbbEo" x="50" y="110"><field name="sensor">光电传感器</field></block></xml>'
                    }
                ],
                [
                    {
                        name: 'step1',
                        blocks: ['variables_set', 'camera_snapshot'],
                        workspace:
                            '<xml><block type="wait_for_sensor_signal" id="ujxLqORLSTv~h}xDbbEo" x="50" y="110"><field name="sensor">光电传感器</field></block></xml>',
                        expect:
                            '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!`6">图片</variable></variables><block type="wait_for_sensor_signal" id="ujxLqORLSTv~h}xDbbEo" x="50" y="110"><field name="sensor">光电传感器</field><next><block type="variables_set" id="E3y~Xq*QhO]-!Mn)f];r"><field name="VAR" id="]BMrwz6fOMJY=.sIU!`6">图片</field><value name="VALUE"><block type="camera_snapshot" id="`9~=nQ|JjkL()S/]7R8."><field name="exposure">10000</field></block></value></block></next></block></xml>'
                    }
                ]
            ]
        };
    }
};
</script>

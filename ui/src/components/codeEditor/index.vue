<template>
    <a-layout>
        <a-row type="flex">代码编辑器</a-row>
        <a-row type="flex" style="flex-grow: 1">
            <div id="editor" style="width: 100%; height: 100%" />
        </a-row>
        <a-row type="flex" align="bottom" style="height: 200px">
            <div id="inspector">inspector</div>
            <button @click="initializeTours()">start</button>
        </a-row>
    </a-layout>
</template>

<script>
import Blockly from 'blockly';
import 'blockly/blocks';
import 'blockly/javascript';
import * as Zh from 'blockly/msg/zh-hans';

export default {
    name: 'CodeEditor',
    data: function() {
        return {
            workspace: null,
            toolbox: null,
            eventHandler: null,
            storybook: {},
            storybookMode: false,
            storybookStep: null
        };
    },
    mounted: function() {
        this.initialize('editor', 'toolbox', {
            startStage: function() {
                alert('stage start');
            },
            stopStage: function() {
                alert('stage over');
            },
            startStep: function() {
                alert('step start');
            }
        });
    },
    methods: {
        initialize(container, toolbox, eventHandler) {
            Blockly.setLocale(Zh);
            Blockly.defineBlocksWithJsonArray([
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
                    helpUrl: ''
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
                    helpUrl: 'http://www.baidu.com'
                }
            ]);

            Blockly.JavaScript['camera_snapshot'] = function(block) {
                const number_exposure = block.getFieldValue('exposure');
                const code = `camera_snapshot(${number_exposure})`;
                return [code, Blockly.JavaScript.ORDER_NONE];
            };

            Blockly.JavaScript['wait_for_sensor_signal'] = function() {
                const code = 'wait_for_sensor_signal();\n';
                return code;
            };

            this.toolbox = `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
                    <block type="wait_for_sensor_signal" id="wait_for_sensor_signal">
                        <field name="sensor">光电传感器</field>
                    </block>
                    <block type="camera_snapshot" id="camera_snapshot"></block>
                    <block type="variables_get">
                        <field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field>
                    </block>
                    <block type="variables_set">
                        <field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field>
                    </block>
                </xml>`;

            this.eventHandler = eventHandler;

            const options = {
                toolbox: this.toolbox,
                collapse: false,
                comments: true,
                disable: false,
                maxBlocks: Infinity,
                trashcan: true,
                horizontalLayout: false,
                toolboxPosition: 'start',
                css: true,
                media: 'media/',
                rtl: false,
                scrollbars: true,
                sounds: true,
                oneBasedIndex: true,
                grid: {
                    spacing: 20,
                    length: 1,
                    colour: '#888',
                    snap: true
                },
                zoom: {
                    controls: true,
                    wheel: true,
                    startScale: 1,
                    maxScale: 3,
                    minScale: 0.3,
                    scaleSpeed: 1.2
                }
            };

            this.workspace = Blockly.inject(container, options);
            // this.workspace.addChangeListener(this._eventHandler.bind(this));
        },
        initializeTours() {
            this.$intro()
                .setOptions({
                    tooltipPosition: 'auto',
                    steps: [
                        {
                            intro: 'Hello world!'
                        },
                        {
                            element: document.querySelectorAll('[data-id="wait_for_sensor_signal"]')[0],
                            intro: '<div style="width: 300px; height: 300px">Hello</div>'
                        },
                        {
                            element: document.querySelectorAll('[data-id="camera_snapshot"]')[0],
                            intro: 'step2'
                        }
                    ]
                })
                .start();
        }
    }
};
</script>

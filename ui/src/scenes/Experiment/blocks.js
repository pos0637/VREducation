import Blockly from 'blockly';

export const blocks = [
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
];

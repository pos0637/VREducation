import Blockly from 'blockly';

export const blocks = [
    {
        type: 'get_altitude',
        message0: '获取高度传感器数据: %1',
        args0: [
            {
                type: 'field_dropdown',
                name: 'sensor',
                options: [['高度传感器', '高度传感器']]
            }
        ],
        output: null,
        colour: 230,
        tooltip: '获取高度传感器数据',
        helpUrl: '',
        javascript: () => {
            const code = `await top.window.get_altitude()`;
            return [code, Blockly.JavaScript.ORDER_NONE];
        }
    },
    {
        type: 'proportional',
        message0: '比例计算 参数: %1',
        args0: [
            {
                type: 'field_number',
                name: 'proportional_value',
                value: 0,
                precision: 0.1
            }
        ],
        output: null,
        colour: 120,
        tooltip: '比例计算',
        helpUrl: '',
        javascript: block => {
            const proportional_value = block.getFieldValue('proportional_value');
            const code = `await top.window.proportional(${proportional_value})`;
            return [code, Blockly.JavaScript.ORDER_NONE];
        }
    },
    {
        type: 'integral',
        message0: '积分计算 参数: %1 误差: %2',
        args0: [
            {
                type: 'field_number',
                name: 'integral_value',
                value: 0,
                precision: 0.1
            },
            {
                type: 'field_variable',
                name: 'error',
                variable: '误差'
            }
        ],
        inputsInline: false,
        output: null,
        colour: 120,
        tooltip: '积分计算',
        helpUrl: '',
        javascript: block => {
            const error = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('error'), Blockly.Variables.NAME_TYPE);
            const integral_value = block.getFieldValue('integral_value');
            const code = `await top.window.integral(${integral_value}, ${error})`;
            return [code, Blockly.JavaScript.ORDER_NONE];
        }
    },
    {
        type: 'derivative',
        message0: '微分计算 参数: %1 误差: %2',
        args0: [
            {
                type: 'field_number',
                name: 'derivative_value',
                value: 0,
                precision: 0.1
            },
            {
                type: 'field_variable',
                name: 'error',
                variable: '误差'
            }
        ],
        inputsInline: false,
        output: null,
        colour: 120,
        tooltip: '微分计算',
        helpUrl: '',
        javascript: block => {
            const error = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('error'), Blockly.Variables.NAME_TYPE);
            const derivative_value = block.getFieldValue('derivative_value');
            const code = `await top.window.derivative(${derivative_value}, ${error})`;
            return [code, Blockly.JavaScript.ORDER_NONE];
        }
    },
    {
        type: 'speed',
        message0: '设置转速: %1',
        args0: [
            {
                type: 'input_value',
                name: 'speed'
            }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: '设置转速',
        helpUrl: '',
        javascript: block => {
            var value_speed = Blockly.JavaScript.valueToCode(block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
            const code = `await top.window.speed(${value_speed});`;
            return code;
        }
    }
];

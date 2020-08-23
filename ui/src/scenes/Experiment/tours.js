export const tours = [
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="speed" id="speed"></block>
            <block type="math_number" id="math_number">
                <field name="NUM">0</field>
            </block>
        </xml>`,
        steps: [
            {
                intro: '<iframe frameborder="0" style="width: 500px; height: 600px; magin: 10px;" scrolling="auto" src="guides/experiment.html"></iframe>'
            },
            {
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/speed.html"></iframe>'
            },
            {
                elementId: '[data-id="speed"]',
                intro: '拖拽 设置转速 功能块进入编程界面'
            },
            {
                elementId: '[data-id="math_number"]',
                intro: '设置转速为0.7'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与实时曲线中的实验结果'
            }
        ]
    },
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="get_altitude" id="get_altitude">
                <field name="sensor">高度传感器</field>
            </block>
            <block type="proportional" id="proportional"></block>
            <block type="variables_get" id="variable_altitude_get">
                <field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field>
            </block>
            <block type="variables_set" id="variable_altitude_set">
                <field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field>
            </block>
            <block type="variables_get" id="variable_current_altitude_get">
                <field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field>
            </block>
            <block type="variables_set" id="variable_current_altitude_set">
                <field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field>
            </block>
            <block type="variables_get" id="variable_error_get">
                <field name="VAR" id="]i17utjfOMJY=.sIUx1m">误差</field>
            </block>
            <block type="variables_set" id="variable_error_set">
                <field name="VAR" id="]i17utjfOMJY=.sIUx1m">误差</field>
            </block>
            <block type="speed" id="speed"></block>
            <block type="math_number" id="math_number">
                <field name="NUM">0</field>
            </block>
            <block type="math_arithmetic" id="math_arithmetic">
                <field name="OP">ADD</field>
                <value name="A">
                </value>
                <value name="B">
                </value>
            </block>
        </xml>`,
        steps: [
            {
                intro: '<iframe frameborder="0" style="width: 500px; height: 600px; magin: 10px;" scrolling="auto" src="guides/experiment.html"></iframe>'
            },
            {
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/proportional.html"></iframe>'
            },
            {
                elementId: '[data-id="variable_altitude_set"]',
                intro: '拖拽 设置预期高度 功能块进入编程界面, 并设置预期高度为50'
            },
            {
                elementId: '[data-id="variable_current_altitude_set"]',
                intro: '拖拽 设置当前高度 功能块进入编程界面'
            },
            {
                elementId: '[data-id="get_altitude"]',
                intro: '拖拽 获取高度传感器数据 功能块进入编程界面, 并与 设置当前高度 功能块连接'
            },
            {
                elementId: '[data-id="variable_error_set"]',
                intro: '拖拽 设置误差 功能块进入编程界面, 误差为 预期高度 - 当前高度'
            },
            {
                elementId: '[data-id="speed"]',
                intro: '拖拽 设置转速 功能块进入编程界面'
            },
            {
                elementId: '[data-id="proportional"]',
                intro: '拖拽 比例计算 功能块进入编程界面, 并与 误差 功能块相乘, 将结果与 设置转速 功能块连接'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与实时曲线中的实验结果'
            }
        ]
    },
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="get_altitude" id="get_altitude">
                <field name="sensor">高度传感器</field>
            </block>
            <block type="proportional" id="proportional"></block>
            <block type="variables_get" id="variable_altitude_get">
                <field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field>
            </block>
            <block type="variables_set" id="variable_altitude_set">
                <field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field>
            </block>
            <block type="variables_get" id="variable_current_altitude_get">
                <field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field>
            </block>
            <block type="variables_set" id="variable_current_altitude_set">
                <field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field>
            </block>
            <block type="variables_get" id="variable_error_get">
                <field name="VAR" id="]i17utjfOMJY=.sIUx1m">误差</field>
            </block>
            <block type="variables_set" id="variable_error_set">
                <field name="VAR" id="]i17utjfOMJY=.sIUx1m">误差</field>
            </block>
            <block type="speed" id="speed"></block>
            <block type="math_number" id="math_number">
                <field name="NUM">0</field>
            </block>
            <block type="math_arithmetic" id="math_arithmetic">
                <field name="OP">ADD</field>
                <value name="A">
                </value>
                <value name="B">
                </value>
            </block>
        </xml>`,
        steps: [
            {
                intro:
                    '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/proportional_value.html"></iframe>'
            },
            {
                elementId: '[data-id="proportional"]',
                intro: '设置 比例控制 功能块参数为0.3'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与实时曲线中的稳态误差对比实验结果'
            }
        ]
    },
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="integral" id="integral"></block>
            <block type="variables_get" id="variable_error_get">
                <field name="VAR" id="]i17utjfOMJY=.sIUx1m">误差</field>
            </block>
            <block type="math_arithmetic" id="math_arithmetic">
                <field name="OP">ADD</field>
                <value name="A">
                </value>
                <value name="B">
                </value>
            </block>
        </xml>`,
        steps: [
            {
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/integral.html"></iframe>'
            },
            {
                elementId: '[data-id="integral"]',
                intro: '拖拽 积分控制 功能块进入编程界面'
            },
            {
                elementId: '[data-id="math_arithmetic"]',
                intro: '与 误差 功能块相加后连接'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与实时曲线中的实验结果'
            }
        ]
    },
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="integral" id="integral"></block>
            <block type="variables_get" id="variable_error_get">
                <field name="VAR" id="]i17utjfOMJY=.sIUx1m">误差</field>
            </block>
            <block type="math_arithmetic" id="math_arithmetic">
                <field name="OP">ADD</field>
                <value name="A">
                </value>
                <value name="B">
                </value>
            </block>
        </xml>`,
        steps: [
            {
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/integral_value.html"></iframe>'
            },
            {
                elementId: '[data-id="integral"]',
                intro: '设置 积分控制 功能块参数为0.5'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与实时曲线中的实验结果'
            }
        ]
    },
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="derivative" id="derivative"></block>
            <block type="variables_get" id="variable_error_get">
                <field name="VAR" id="]i17utjfOMJY=.sIUx1m">误差</field>
            </block>
            <block type="math_arithmetic" id="math_arithmetic">
                <field name="OP">ADD</field>
                <value name="A">
                </value>
                <value name="B">
                </value>
            </block>
        </xml>`,
        steps: [
            {
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/derivative.html"></iframe>'
            },
            {
                elementId: '[data-id="derivative"]',
                intro: '拖拽 微分控制 功能块进入编程界面'
            },
            {
                elementId: '[data-id="math_arithmetic"]',
                intro: '与 误差 功能块相加后连接'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与实时曲线中的实验结果'
            }
        ]
    }
];

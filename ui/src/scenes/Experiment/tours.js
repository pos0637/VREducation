export const tours = [
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="wait_for_sensor_signal" id="wait_for_sensor_signal">
                <field name="sensor">光电传感器</field>
            </block>
            <block type="camera_snapshot" id="camera_snapshot"></block>
            <block type="variables_set" id="variable_image_set">
                <field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field>
            </block>
        </xml>`,
        steps: [
            {
                intro: '<div style="width: 300px; height: 300px">视觉抓取实验介绍</div>'
            },
            {
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px;" scrolling="no" src="guides/snapshot.html"></iframe>'
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
        ]
    },
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="wait_for_sensor_signal" id="wait_for_sensor_signal">
                <field name="sensor">光电传感器</field>
            </block>
            <block type="camera_snapshot" id="camera_snapshot"></block>
            <block type="variables_set" id="variable_image_set">
                <field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field>
            </block>
        </xml>`,
        steps: [
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
    },
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="threshold" id="threshold"></block>
            <block type="variables_set" id="variable_preprocess_image_set">
                <field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">预处理图片</field>
            </block>
        </xml>`,
        steps: [
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
        ]
    },
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="threshold" id="threshold"></block>
            <block type="variables_set" id="variable_preprocess_image_set">
                <field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">预处理图片</field>
            </block>
        </xml>`,
        steps: [
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
        ]
    },
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="findcontours" id="findcontours"></block>
            <block type="variables_set" id="variable_contour_set">
                <field name="VAR" id="]i17utjfOMJY=.sIUx1m">边缘</field>
            </block>
        </xml>`,
        steps: [
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
        ]
    },
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="findcontours" id="findcontours"></block>
            <block type="variables_set" id="variable_contour_set">
                <field name="VAR" id="]i17utjfOMJY=.sIUx1m">边缘</field>
            </block>
        </xml>`,
        steps: [
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
        ]
    },
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="findcenter" id="findcenter"></block>
            <block type="variables_set" id="variable_center_set">
                <field name="VAR" id="82jjstjfOMJY=.s1123c">中心点</field>
            </block>
        </xml>`,
        steps: [
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
        ]
    },
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
                <block type="shapedetect" id="shapedetect"></block>
                <block type="variables_set" id="variable_sharp_set">
                <field name="VAR" id="bgehjfOMJY=.s11o5al1">工件类型</field>
            </block>
        </xml>`,
        steps: [
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
        ]
    },
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="grab" id="grab"></block>
        </xml>`,
        steps: [
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
    }
];

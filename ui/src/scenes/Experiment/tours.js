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
                intro: '<iframe frameborder="0" style="width: 500px; height: 600px; magin: 10px;" scrolling="auto" src="guides/introduction.html"></iframe>'
            },
            {
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/snapshot.html"></iframe>'
            },
            {
                elementId: '[data-id="wait_for_sensor_signal"]',
                intro: '拖拽 等待传感器信号 功能块进入编程界面'
            },
            {
                elementId: '[data-id="variable_image_set"]',
                intro: '拖拽 设置图片 功能块进入编程界面, 并与 等待传感器信号 功能块连接'
            },
            {
                elementId: '[data-id="camera_snapshot"]',
                intro: '拖拽 相机拍照 功能块进入编程界面, 并与 设置图片 功能块连接'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果'
            },
            {
                elementId: '[data-id="inspector_variable_image1"]',
                intro: '观察三维仿真与探查器界面中的实验结果'
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
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/exposure.html"></iframe>'
            },
            {
                elementId: '[data-id="camera_snapshot"]',
                intro: '设置 相机拍照 功能块曝光值为2000'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果'
            },
            {
                elementId: '[data-id="inspector_variable_image1"]',
                intro: '观察三维仿真与探查器界面中的实验结果'
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
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/preprocess.html"></iframe>'
            },
            {
                elementId: '[data-id="variable_preprocess_image_set"]',
                intro: '拖拽 设置预处理图片 功能块进入编程界面, 并与 设置图片 功能块连接'
            },
            {
                elementId: '[data-id="threshold"]',
                intro: '拖拽 二值化 功能块进入编程界面, 并与 设置预处理图片 功能块连接'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果'
            },
            {
                elementId: '[data-id="inspector_variable_image2"]',
                intro: '观察三维仿真与探查器界面中的实验结果'
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
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/threshold.html"></iframe>'
            },
            {
                elementId: '[data-id="threshold"]',
                intro: '设置 二值化 功能块最小值为50, 最大值为100'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果'
            },
            {
                elementId: '[data-id="inspector_variable_image2"]',
                intro: '观察三维仿真与探查器界面中的实验结果'
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
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/findcontours.html"></iframe>'
            },
            {
                elementId: '[data-id="variable_contour_set"]',
                intro: '拖拽 设置边缘 功能块进入编程界面, 并与 设置预处理图片 功能块连接'
            },
            {
                elementId: '[data-id="findcontours"]',
                intro: '拖拽 提取边缘 功能块进入编程界面, 并与 设置边缘 功能块连接'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果'
            },
            {
                elementId: '[data-id="inspector_variable_image3"]',
                intro: '观察三维仿真与探查器界面中的实验结果'
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
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/canny.html"></iframe>'
            },
            {
                elementId: '[data-id="findcontours"]',
                intro: '设置 提取边缘 功能块最小值为10, 最大值为30'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果'
            },
            {
                elementId: '[data-id="inspector_variable_image3"]',
                intro: '观察三维仿真与探查器界面中的实验结果'
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
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/findcenter.html"></iframe>'
            },
            {
                elementId: '[data-id="variable_center_set"]',
                intro: '拖拽 设置中心点 功能块进入编程界面, 并与 设置边缘 功能块连接'
            },
            {
                elementId: '[data-id="findcenter"]',
                intro: '拖拽 提取中心点 功能块进入编程界面, 并与 设置中心点 功能块连接'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果'
            },
            {
                elementId: '[data-id="inspector_variable_image4"]',
                intro: '观察三维仿真与探查器界面中的实验结果'
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
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/sharpdetect.html"></iframe>'
            },
            {
                elementId: '[data-id="variable_sharp_set"]',
                intro: '拖拽 设置工件类型 功能块进入编程界面, 并与 设置中心点 功能块连接'
            },
            {
                elementId: '[data-id="shapedetect"]',
                intro: '拖拽 形状识别 功能块进入编程界面, 并与 设置工件类型 功能块连接'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果'
            },
            {
                elementId: '[data-id="inspector_variable_image5"]',
                intro: '观察三维仿真与探查器界面中的实验结果'
            }
        ]
    },
    {
        toolbox: `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
            <block type="grab" id="grab"></block>
        </xml>`,
        steps: [
            {
                intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/grab.html"></iframe>'
            },
            {
                elementId: '[data-id="grab"]',
                intro: '拖拽 机器人抓取 功能块进入编程界面, 并与 设置工件类型 功能块连接'
            },
            {
                elementId: '[data-id="run_button"]',
                intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果'
            }
        ]
    }
];

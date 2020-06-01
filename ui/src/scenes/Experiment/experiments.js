import { sleep } from '@/miscs/coroutine';

export function buildExperiments(sender) {
    return [
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
                    expect:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">图片</variable></variables><block type="wait_for_sensor_signal" id="?-d2,=9U[aKnRjqbr++i" x="30" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="nPZ`r~|}63pU]CikFm#4"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field></block></next></block></xml>'
                },
                {
                    name: 'step3',
                    intro: '拖拽 相机拍照 功能块进入编程界面, 并与 设置图片 功能块连接',
                    blocks: ['camera_snapshot'],
                    expect:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">图片</variable></variables><block type="wait_for_sensor_signal" id="cm+9:4Bm_)|X^4NER|!+" x="30" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="8,I|d$U#:BKj-z3+Y95#"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field><value name="VALUE"><block type="camera_snapshot" id="6,rX@2g(?q5S77-N2gKW"><field name="exposure">10000</field></block></value></block></next></block></xml>'
                },
                {
                    name: 'step4',
                    intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                    buttons: ['run_button'],
                    expect: async () => {
                        while (sender.runFlag && typeof sender.$refs.codeEditor.getVariable('inspector_variable_image1') === 'undefined') {
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
                    workspace:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">图片</variable></variables><block type="wait_for_sensor_signal" id="cm+9:4Bm_)|X^4NER|!+" x="30" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="8,I|d$U#:BKj-z3+Y95#"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field><value name="VALUE"><block type="camera_snapshot" id="6,rX@2g(?q5S77-N2gKW"><field name="exposure">10000</field></block></value></block></next></block></xml>',
                    expect:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">图片</variable></variables><block type="wait_for_sensor_signal" id="cm+9:4Bm_)|X^4NER|!+" x="30" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="8,I|d$U#:BKj-z3+Y95#"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">图片</field><value name="VALUE"><block type="camera_snapshot" id="6,rX@2g(?q5S77-N2gKW"><field name="exposure">2000</field></block></value></block></next></block></xml>'
                },
                {
                    name: 'step2',
                    intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                    buttons: ['run_button'],
                    expect: async () => {
                        while (sender.runFlag && typeof sender.$refs.codeEditor.getVariable('inspector_variable_image1') === 'undefined') {
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
                    expect:
                        '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">0</field><field name="max">255</field></block></value></block></next></block></next></block></xml>'
                },
                {
                    name: 'step3',
                    intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                    buttons: ['run_button'],
                    expect: async () => {
                        while (sender.runFlag && typeof sender.$refs.codeEditor.getVariable('inspector_variable_image2') === 'undefined') {
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
                    workspace:
                        '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">0</field><field name="max">255</field></block></value></block></next></block></next></block></xml>',
                    expect:
                        '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value></block></next></block></next></block></xml>'
                },
                {
                    name: 'step2',
                    intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                    buttons: ['run_button'],
                    expect: async () => {
                        while (sender.runFlag && typeof sender.$refs.codeEditor.getVariable('inspector_variable_image2') === 'undefined') {
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
                    expect:
                        '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">0</field><field name="max">255</field></block></value></block></next></block></next></block></next></block></xml>'
                },
                {
                    name: 'step3',
                    intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                    buttons: ['run_button'],
                    expect: async () => {
                        while (sender.runFlag && typeof sender.$refs.codeEditor.getVariable('inspector_variable_image3') === 'undefined') {
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
                    workspace:
                        '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">0</field><field name="max">255</field></block></value></block></next></block></next></block></next></block></xml>',
                    expect:
                        '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">10</field><field name="max">30</field></block></value></block></next></block></next></block></next></block></xml>'
                },
                {
                    name: 'step2',
                    intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                    buttons: ['run_button'],
                    expect: async () => {
                        while (sender.runFlag && typeof sender.$refs.codeEditor.getVariable('inspector_variable_image3') === 'undefined') {
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
                    expect:
                        '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable><variable id="ngGsJ|]W6|4*;S=B$V5t">中心点</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">10</field><field name="max">30</field></block></value><next><block type="variables_set" id="NJQrl{iE7F]5wA$86b,Q"><field name="VAR" id="ngGsJ|]W6|4*;S=B$V5t">中心点</field><value name="VALUE"><block type="findcenter" id=",/Q06oI8k{MdjLT`9pn;"><field name="contours" id="01nW-U)u6HfpH,E[QV,m">边缘</field><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field></block></value></block></next></block></next></block></next></block></next></block></xml>'
                },
                {
                    name: 'step3',
                    intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                    buttons: ['run_button'],
                    expect: async () => {
                        while (sender.runFlag && typeof sender.$refs.codeEditor.getVariable('inspector_variable_image4') === 'undefined') {
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
                    expect:
                        '<xml><variables><variable id="{)P=9w8zgSzZtQ7]Y`P8">图片</variable><variable id="YELasm^mOp;=P?(h{q}+">预处理图片</variable><variable id="01nW-U)u6HfpH,E[QV,m">边缘</variable><variable id="ngGsJ|]W6|4*;S=B$V5t">中心点</variable><variable id="BjY+_k6qc`DvCq#D6ak|">工件类型</variable></variables><block type="wait_for_sensor_signal" id="0Y2+p}_WmktjG[I`Yo,M" x="10" y="30"><field name="sensor">光电传感器</field><next><block type="variables_set" id="G;wL1U@MU*(7.!+_B0c7"><field name="VAR" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><value name="VALUE"><block type="camera_snapshot" id="0YkFZh^!bpNABU5ZZ5md"><field name="exposure">2000</field></block></value><next><block type="variables_set" id="^N1C,sd+$7QlhJm.ve]!"><field name="VAR" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><value name="VALUE"><block type="threshold" id="(Nj$ZiilybQH88;:4a6~"><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field><field name="min">50</field><field name="max">100</field></block></value><next><block type="variables_set" id="uPX*W1$sk6ZI%J[nXBx)"><field name="VAR" id="01nW-U)u6HfpH,E[QV,m">边缘</field><value name="VALUE"><block type="findcontours" id="doo,v/NjmWf8sp).j_nv"><field name="image" id="YELasm^mOp;=P?(h{q}+">预处理图片</field><field name="min">10</field><field name="max">30</field></block></value><next><block type="variables_set" id="NJQrl{iE7F]5wA$86b,Q"><field name="VAR" id="ngGsJ|]W6|4*;S=B$V5t">中心点</field><value name="VALUE"><block type="findcenter" id=",/Q06oI8k{MdjLT`9pn;"><field name="contours" id="01nW-U)u6HfpH,E[QV,m">边缘</field><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field></block></value><next><block type="variables_set" id="v)O#A+,Ll+7gTQFn^gQT"><field name="VAR" id="BjY+_k6qc`DvCq#D6ak|">工件类型</field><value name="VALUE"><block type="shapedetect" id="3y_lzy!6U0D^l%C`-^Tx"><field name="contours" id="01nW-U)u6HfpH,E[QV,m">边缘</field><field name="image" id="{)P=9w8zgSzZtQ7]Y`P8">图片</field></block></value></block></next></block></next></block></next></block></next></block></next></block></xml>'
                },
                {
                    name: 'step3',
                    intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果',
                    buttons: ['run_button'],
                    expect: async () => {
                        while (sender.runFlag && typeof sender.$refs.codeEditor.getVariable('inspector_variable_image5') === 'undefined') {
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
                    expect: async () => true
                }
            ]
        }
    ];
}

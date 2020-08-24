export function buildExperiments() {
    return [
        {
            name: '上升速度控制实验',
            steps: [
                {
                    name: 'step1',
                    intro: '拖拽 设置转速 功能块进入编程界面, 并设置转速为0.7',
                    blocks: ['speed', 'math_number'],
                    workspace: '<xml></xml>',
                    expect:
                        '<xml><block type="speed" id="WUiqVfX^Biv9n`?`.}c$" x="150" y="230"><value name="speed"><block type="math_number" id="U!7}$rIkV@Wp5(wK~lH|"><field name="NUM">0.7</field></block></value></block></xml>'
                },
                {
                    name: 'step2',
                    intro: '点击 运行 按钮, 观察三维仿真与实时曲线中的实验结果',
                    buttons: ['run_button'],
                    expect: async () => {
                        return true;
                    }
                }
            ]
        },
        {
            name: '比例控制实验',
            steps: [
                {
                    name: 'step1',
                    intro: '拖拽 设置预期高度 功能块进入编程界面, 并设置预期高度为50',
                    blocks: ['variable_altitude_set', 'math_number'],
                    workspace: '<xml></xml>',
                    expect:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">预期高度</variable></variables><block type="variables_set" id="|r@pVg;tos#m0q0ru=OC" x="230" y="170"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field><value name="VALUE"><block type="math_number" id=";u.Ffzln:H@?h_;?v,J/"><field name="NUM">50</field></block></value></block></xml>'
                },
                {
                    name: 'step2',
                    intro: '拖拽 设置当前高度 功能块进入编程界面, 拖拽 获取高度传感器数据 功能块进入编程界面, 并与 设置当前高度 功能块连接',
                    blocks: ['variable_current_altitude_set', 'get_altitude'],
                    expect:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">预期高度</variable><variable id="]i1rwz6fOMJY=.sIU!g3">当前高度</variable></variables><block type="variables_set" id=".[q,R,#:Xz:C3DK17a%N" x="170" y="110"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field><value name="VALUE"><block type="math_number" id="x#q-r+aLykd.VW.HAvR4"><field name="NUM">50</field></block></value><next><block type="variables_set" id="^2oy5-,,mBR=#``Nej+8"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field><value name="VALUE"><block type="get_altitude" id="~}/d08rIoqBqW#;_-q%#"><field name="sensor">高度传感器</field></block></value></block></next></block></xml>'
                },
                {
                    name: 'step3',
                    intro: '拖拽 设置误差 功能块进入编程界面, 误差为 预期高度 - 当前高度',
                    blocks: ['variable_error_set', 'math_arithmetic', 'variable_altitude_get', 'variable_current_altitude_get'],
                    expect:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">预期高度</variable><variable id="]i1rwz6fOMJY=.sIU!g3">当前高度</variable><variable id="YN=HD(iBZFpAKW%91M=l">误差</variable></variables><block type="variables_set" id=".[q,R,#:Xz:C3DK17a%N" x="170" y="110"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field><value name="VALUE"><block type="math_number" id="x#q-r+aLykd.VW.HAvR4"><field name="NUM">50</field></block></value><next><block type="variables_set" id="^2oy5-,,mBR=#``Nej+8"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field><value name="VALUE"><block type="get_altitude" id="~}/d08rIoqBqW#;_-q%#"><field name="sensor">高度传感器</field></block></value><next><block type="variables_set" id="zy7fF9D1=~|Wf5``@9.%"><field name="VAR" id="YN=HD(iBZFpAKW%91M=l">误差</field><value name="VALUE"><block type="math_arithmetic" id="CrBhFYO1^`61q,{$,MM/"><field name="OP">MINUS</field><value name="A"><block type="variables_get" id="VtA2~Qc3vibH8:QCN*;%"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field></block></value><value name="B"><block type="variables_get" id="*Htq{Ek5gs10@*`OvbP!"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field></block></value></block></value></block></next></block></next></block></xml>'
                },
                {
                    name: 'step4',
                    intro: '拖拽 设置转速 功能块进入编程界面, 拖拽 比例计算 功能块进入编程界面, 并与 误差 功能块相乘, 将结果与 设置转速 功能块连接',
                    blocks: ['speed', 'math_arithmetic', 'proportional', 'variable_error_get'],
                    expect:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">预期高度</variable><variable id="]i1rwz6fOMJY=.sIU!g3">当前高度</variable><variable id="YN=HD(iBZFpAKW%91M=l">误差</variable></variables><block type="variables_set" id=".[q,R,#:Xz:C3DK17a%N" x="170" y="110"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field><value name="VALUE"><block type="math_number" id="x#q-r+aLykd.VW.HAvR4"><field name="NUM">50</field></block></value><next><block type="variables_set" id="^2oy5-,,mBR=#``Nej+8"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field><value name="VALUE"><block type="get_altitude" id="~}/d08rIoqBqW#;_-q%#"><field name="sensor">高度传感器</field></block></value><next><block type="variables_set" id="zy7fF9D1=~|Wf5``@9.%"><field name="VAR" id="YN=HD(iBZFpAKW%91M=l">误差</field><value name="VALUE"><block type="math_arithmetic" id="CrBhFYO1^`61q,{$,MM/"><field name="OP">MINUS</field><value name="A"><block type="variables_get" id="VtA2~Qc3vibH8:QCN*;%"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field></block></value><value name="B"><block type="variables_get" id="*Htq{Ek5gs10@*`OvbP!"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field></block></value></block></value><next><block type="speed" id=".hUHi}up+oR_KZcpz[$t"><value name="speed"><block type="math_arithmetic" id="P.w5qrn.?3ng[S.3%{P;"><field name="OP">MULTIPLY</field><value name="A"><block type="proportional" id="tuW!CeiApNVj!9F/Oz3="><field name="proportional_value">0.1</field></block></value><value name="B"><block type="variables_get" id="jetCUfq~}?184C!6_X=`"><field name="VAR" id="YN=HD(iBZFpAKW%91M=l">误差</field></block></value></block></value></block></next></block></next></block></next></block></xml>'
                },
                {
                    name: 'step5',
                    intro: '点击 运行 按钮, 观察三维仿真与实时曲线中的实验结果',
                    buttons: ['run_button'],
                    expect: async () => {
                        return true;
                    }
                }
            ]
        },
        {
            name: '稳态误差调节实验',
            steps: [
                {
                    name: 'step1',
                    intro: '设置 比例控制 功能块参数为0.3',
                    workspace:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">预期高度</variable><variable id="]i1rwz6fOMJY=.sIU!g3">当前高度</variable><variable id="YN=HD(iBZFpAKW%91M=l">误差</variable></variables><block type="variables_set" id=".[q,R,#:Xz:C3DK17a%N" x="170" y="110"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field><value name="VALUE"><block type="math_number" id="x#q-r+aLykd.VW.HAvR4"><field name="NUM">50</field></block></value><next><block type="variables_set" id="^2oy5-,,mBR=#``Nej+8"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field><value name="VALUE"><block type="get_altitude" id="~}/d08rIoqBqW#;_-q%#"><field name="sensor">高度传感器</field></block></value><next><block type="variables_set" id="zy7fF9D1=~|Wf5``@9.%"><field name="VAR" id="YN=HD(iBZFpAKW%91M=l">误差</field><value name="VALUE"><block type="math_arithmetic" id="CrBhFYO1^`61q,{$,MM/"><field name="OP">MINUS</field><value name="A"><block type="variables_get" id="VtA2~Qc3vibH8:QCN*;%"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field></block></value><value name="B"><block type="variables_get" id="*Htq{Ek5gs10@*`OvbP!"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field></block></value></block></value><next><block type="speed" id=".hUHi}up+oR_KZcpz[$t"><value name="speed"><block type="math_arithmetic" id="P.w5qrn.?3ng[S.3%{P;"><field name="OP">MULTIPLY</field><value name="A"><block type="proportional" id="tuW!CeiApNVj!9F/Oz3="><field name="proportional_value">0.1</field></block></value><value name="B"><block type="variables_get" id="jetCUfq~}?184C!6_X=`"><field name="VAR" id="YN=HD(iBZFpAKW%91M=l">误差</field></block></value></block></value></block></next></block></next></block></next></block></xml>',
                    expect:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">预期高度</variable><variable id="]i1rwz6fOMJY=.sIU!g3">当前高度</variable><variable id="YN=HD(iBZFpAKW%91M=l">误差</variable></variables><block type="variables_set" id=".[q,R,#:Xz:C3DK17a%N" x="170" y="110"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field><value name="VALUE"><block type="math_number" id="x#q-r+aLykd.VW.HAvR4"><field name="NUM">50</field></block></value><next><block type="variables_set" id="^2oy5-,,mBR=#``Nej+8"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field><value name="VALUE"><block type="get_altitude" id="~}/d08rIoqBqW#;_-q%#"><field name="sensor">高度传感器</field></block></value><next><block type="variables_set" id="zy7fF9D1=~|Wf5``@9.%"><field name="VAR" id="YN=HD(iBZFpAKW%91M=l">误差</field><value name="VALUE"><block type="math_arithmetic" id="CrBhFYO1^`61q,{$,MM/"><field name="OP">MINUS</field><value name="A"><block type="variables_get" id="VtA2~Qc3vibH8:QCN*;%"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field></block></value><value name="B"><block type="variables_get" id="*Htq{Ek5gs10@*`OvbP!"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field></block></value></block></value><next><block type="speed" id=".hUHi}up+oR_KZcpz[$t"><value name="speed"><block type="math_arithmetic" id="P.w5qrn.?3ng[S.3%{P;"><field name="OP">MULTIPLY</field><value name="A"><block type="proportional" id="tuW!CeiApNVj!9F/Oz3="><field name="proportional_value">0.3</field></block></value><value name="B"><block type="variables_get" id="jetCUfq~}?184C!6_X=`"><field name="VAR" id="YN=HD(iBZFpAKW%91M=l">误差</field></block></value></block></value></block></next></block></next></block></next></block></xml>'
                },
                {
                    name: 'step2',
                    intro: '点击 运行 按钮, 观察三维仿真与实时曲线中的稳态误差对比实验结果',
                    buttons: ['run_button'],
                    expect: async () => {
                        return true;
                    }
                }
            ]
        },
        {
            name: '积分控制实验',
            steps: [
                {
                    name: 'step1',
                    intro: '拖拽 积分控制 功能块进入编程界面, 并与 误差 功能块相加后连接',
                    blocks: ['integral', 'math_arithmetic'],
                    workspace:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">预期高度</variable><variable id="]i1rwz6fOMJY=.sIU!g3">当前高度</variable><variable id="YN=HD(iBZFpAKW%91M=l">误差</variable></variables><block type="variables_set" id=".[q,R,#:Xz:C3DK17a%N" x="170" y="110"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field><value name="VALUE"><block type="math_number" id="x#q-r+aLykd.VW.HAvR4"><field name="NUM">50</field></block></value><next><block type="variables_set" id="^2oy5-,,mBR=#``Nej+8"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field><value name="VALUE"><block type="get_altitude" id="~}/d08rIoqBqW#;_-q%#"><field name="sensor">高度传感器</field></block></value><next><block type="variables_set" id="zy7fF9D1=~|Wf5``@9.%"><field name="VAR" id="YN=HD(iBZFpAKW%91M=l">误差</field><value name="VALUE"><block type="math_arithmetic" id="CrBhFYO1^`61q,{$,MM/"><field name="OP">MINUS</field><value name="A"><block type="variables_get" id="VtA2~Qc3vibH8:QCN*;%"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field></block></value><value name="B"><block type="variables_get" id="*Htq{Ek5gs10@*`OvbP!"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field></block></value></block></value><next><block type="speed" id=".hUHi}up+oR_KZcpz[$t"><value name="speed"><block type="math_arithmetic" id="P.w5qrn.?3ng[S.3%{P;"><field name="OP">MULTIPLY</field><value name="A"><block type="proportional" id="tuW!CeiApNVj!9F/Oz3="><field name="proportional_value">0.1</field></block></value><value name="B"><block type="variables_get" id="jetCUfq~}?184C!6_X=`"><field name="VAR" id="YN=HD(iBZFpAKW%91M=l">误差</field></block></value></block></value></block></next></block></next></block></next></block></xml>',
                    expect:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">预期高度</variable><variable id="]i1rwz6fOMJY=.sIU!g3">当前高度</variable><variable id="KaJG}7yB,7MkNE{eun~+">误差</variable></variables><block type="variables_set" id="3U!WTEbQ,O:G#]XY?@]f" x="90" y="110"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field><value name="VALUE"><block type="math_number" id="D@+f,vQc63tky?)t[$bQ"><field name="NUM">50</field></block></value><next><block type="variables_set" id="!tFlaVUv;#L|$W%HSIxc"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field><value name="VALUE"><block type="get_altitude" id="5|PQ|gfo{:_K-NfC_)j:"><field name="sensor">高度传感器</field></block></value><next><block type="variables_set" id="`R#PKiJmIZ+_}|%eKQ|d"><field name="VAR" id="KaJG}7yB,7MkNE{eun~+">误差</field><value name="VALUE"><block type="math_arithmetic" id="FW)47;p?9HyCd,.2A,$t"><field name="OP">MINUS</field><value name="A"><block type="variables_get" id="vun9lrb2UT?qSu8nCL`J"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field></block></value><value name="B"><block type="variables_get" id="a(XMB@5e/:lB|`)+a8MJ"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field></block></value></block></value><next><block type="speed" id="uMnRX3PI|oA?0OlfxrFt"><value name="speed"><block type="math_arithmetic" id="R[K/7Cj67+*]nmYm@y!m"><field name="OP">MULTIPLY</field><value name="A"><block type="proportional" id="ci?QeDC.WfC)^7[6`V?G"><field name="proportional_value">0.1</field></block></value><value name="B"><block type="math_arithmetic" id="c2cS;5j;#8`~Gbtc08,c"><field name="OP">ADD</field><value name="A"><block type="variables_get" id="TbzhO~;bH5dT#ZxUY(iz"><field name="VAR" id="KaJG}7yB,7MkNE{eun~+">误差</field></block></value><value name="B"><block type="integral" id="ihe+.}czV?l{qB2RA7CZ"><field name="integral_value">0.1</field><field name="error" id="KaJG}7yB,7MkNE{eun~+">误差</field></block></value></block></value></block></value></block></next></block></next></block></next></block></xml>'
                },
                {
                    name: 'step2',
                    intro: '点击 运行 按钮, 观察三维仿真与实时曲线中的实验结果',
                    buttons: ['run_button'],
                    expect: async () => {
                        return true;
                    }
                }
            ]
        },
        {
            name: '超调量调节实验',
            steps: [
                {
                    name: 'step1',
                    intro: '设置 积分控制 功能块参数为0.5',
                    workspace:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">预期高度</variable><variable id="]i1rwz6fOMJY=.sIU!g3">当前高度</variable><variable id="KaJG}7yB,7MkNE{eun~+">误差</variable></variables><block type="variables_set" id="3U!WTEbQ,O:G#]XY?@]f" x="90" y="110"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field><value name="VALUE"><block type="math_number" id="D@+f,vQc63tky?)t[$bQ"><field name="NUM">50</field></block></value><next><block type="variables_set" id="!tFlaVUv;#L|$W%HSIxc"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field><value name="VALUE"><block type="get_altitude" id="5|PQ|gfo{:_K-NfC_)j:"><field name="sensor">高度传感器</field></block></value><next><block type="variables_set" id="`R#PKiJmIZ+_}|%eKQ|d"><field name="VAR" id="KaJG}7yB,7MkNE{eun~+">误差</field><value name="VALUE"><block type="math_arithmetic" id="FW)47;p?9HyCd,.2A,$t"><field name="OP">MINUS</field><value name="A"><block type="variables_get" id="vun9lrb2UT?qSu8nCL`J"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field></block></value><value name="B"><block type="variables_get" id="a(XMB@5e/:lB|`)+a8MJ"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field></block></value></block></value><next><block type="speed" id="uMnRX3PI|oA?0OlfxrFt"><value name="speed"><block type="math_arithmetic" id="R[K/7Cj67+*]nmYm@y!m"><field name="OP">MULTIPLY</field><value name="A"><block type="proportional" id="ci?QeDC.WfC)^7[6`V?G"><field name="proportional_value">0.1</field></block></value><value name="B"><block type="math_arithmetic" id="c2cS;5j;#8`~Gbtc08,c"><field name="OP">ADD</field><value name="A"><block type="variables_get" id="TbzhO~;bH5dT#ZxUY(iz"><field name="VAR" id="KaJG}7yB,7MkNE{eun~+">误差</field></block></value><value name="B"><block type="integral" id="ihe+.}czV?l{qB2RA7CZ"><field name="integral_value">0.1</field><field name="error" id="KaJG}7yB,7MkNE{eun~+">误差</field></block></value></block></value></block></value></block></next></block></next></block></next></block></xml>',
                    expect:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">预期高度</variable><variable id="]i1rwz6fOMJY=.sIU!g3">当前高度</variable><variable id="KaJG}7yB,7MkNE{eun~+">误差</variable></variables><block type="variables_set" id="3U!WTEbQ,O:G#]XY?@]f" x="90" y="110"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field><value name="VALUE"><block type="math_number" id="D@+f,vQc63tky?)t[$bQ"><field name="NUM">50</field></block></value><next><block type="variables_set" id="!tFlaVUv;#L|$W%HSIxc"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field><value name="VALUE"><block type="get_altitude" id="5|PQ|gfo{:_K-NfC_)j:"><field name="sensor">高度传感器</field></block></value><next><block type="variables_set" id="`R#PKiJmIZ+_}|%eKQ|d"><field name="VAR" id="KaJG}7yB,7MkNE{eun~+">误差</field><value name="VALUE"><block type="math_arithmetic" id="FW)47;p?9HyCd,.2A,$t"><field name="OP">MINUS</field><value name="A"><block type="variables_get" id="vun9lrb2UT?qSu8nCL`J"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field></block></value><value name="B"><block type="variables_get" id="a(XMB@5e/:lB|`)+a8MJ"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field></block></value></block></value><next><block type="speed" id="uMnRX3PI|oA?0OlfxrFt"><value name="speed"><block type="math_arithmetic" id="R[K/7Cj67+*]nmYm@y!m"><field name="OP">MULTIPLY</field><value name="A"><block type="proportional" id="ci?QeDC.WfC)^7[6`V?G"><field name="proportional_value">0.1</field></block></value><value name="B"><block type="math_arithmetic" id="c2cS;5j;#8`~Gbtc08,c"><field name="OP">ADD</field><value name="A"><block type="variables_get" id="TbzhO~;bH5dT#ZxUY(iz"><field name="VAR" id="KaJG}7yB,7MkNE{eun~+">误差</field></block></value><value name="B"><block type="integral" id="ihe+.}czV?l{qB2RA7CZ"><field name="integral_value">0.5</field><field name="error" id="KaJG}7yB,7MkNE{eun~+">误差</field></block></value></block></value></block></value></block></next></block></next></block></next></block></xml>'
                },
                {
                    name: 'step2',
                    intro: '点击 运行 按钮, 观察三维仿真与实时曲线中的超调量对比实验结果',
                    buttons: ['run_button'],
                    expect: async () => {
                        return true;
                    }
                }
            ]
        },
        {
            name: '微分控制实验',
            steps: [
                {
                    name: 'step1',
                    intro: '拖拽 微分控制 功能块进入编程界面, 并与 误差 功能块相加后连接',
                    blocks: ['derivative', 'math_arithmetic'],
                    workspace:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">预期高度</variable><variable id="]i1rwz6fOMJY=.sIU!g3">当前高度</variable><variable id="KaJG}7yB,7MkNE{eun~+">误差</variable></variables><block type="variables_set" id="3U!WTEbQ,O:G#]XY?@]f" x="90" y="110"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field><value name="VALUE"><block type="math_number" id="D@+f,vQc63tky?)t[$bQ"><field name="NUM">50</field></block></value><next><block type="variables_set" id="!tFlaVUv;#L|$W%HSIxc"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field><value name="VALUE"><block type="get_altitude" id="5|PQ|gfo{:_K-NfC_)j:"><field name="sensor">高度传感器</field></block></value><next><block type="variables_set" id="`R#PKiJmIZ+_}|%eKQ|d"><field name="VAR" id="KaJG}7yB,7MkNE{eun~+">误差</field><value name="VALUE"><block type="math_arithmetic" id="FW)47;p?9HyCd,.2A,$t"><field name="OP">MINUS</field><value name="A"><block type="variables_get" id="vun9lrb2UT?qSu8nCL`J"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field></block></value><value name="B"><block type="variables_get" id="a(XMB@5e/:lB|`)+a8MJ"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field></block></value></block></value><next><block type="speed" id="uMnRX3PI|oA?0OlfxrFt"><value name="speed"><block type="math_arithmetic" id="R[K/7Cj67+*]nmYm@y!m"><field name="OP">MULTIPLY</field><value name="A"><block type="proportional" id="ci?QeDC.WfC)^7[6`V?G"><field name="proportional_value">0.1</field></block></value><value name="B"><block type="math_arithmetic" id="c2cS;5j;#8`~Gbtc08,c"><field name="OP">ADD</field><value name="A"><block type="variables_get" id="TbzhO~;bH5dT#ZxUY(iz"><field name="VAR" id="KaJG}7yB,7MkNE{eun~+">误差</field></block></value><value name="B"><block type="integral" id="ihe+.}czV?l{qB2RA7CZ"><field name="integral_value">0.1</field><field name="error" id="KaJG}7yB,7MkNE{eun~+">误差</field></block></value></block></value></block></value></block></next></block></next></block></next></block></xml>',
                    expect:
                        '<xml><variables><variable id="]BMrwz6fOMJY=.sIU!a6">预期高度</variable><variable id="]i1rwz6fOMJY=.sIU!g3">当前高度</variable><variable id="KaJG}7yB,7MkNE{eun~+">误差</variable></variables><block type="variables_set" id=",-l+SF#]Z/R=oBYUdV/m" x="-170" y="10"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field><value name="VALUE"><block type="math_number" id="oT6c_YgaZ`yCS:zul5U{"><field name="NUM">50</field></block></value><next><block type="variables_set" id="eB%cRK#NfOF.tpP:-1k("><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field><value name="VALUE"><block type="get_altitude" id="0apArNZ$:l;)=VUt.~k7"><field name="sensor">高度传感器</field></block></value><next><block type="variables_set" id="Q0L@[goL!0c3nXL^e$)("><field name="VAR" id="KaJG}7yB,7MkNE{eun~+">误差</field><value name="VALUE"><block type="math_arithmetic" id="ciqRkVI#f9#(JC[CIiD3"><field name="OP">MINUS</field><value name="A"><block type="variables_get" id="qP0mQr)uju[xhtg7mU[Y"><field name="VAR" id="]BMrwz6fOMJY=.sIU!a6">预期高度</field></block></value><value name="B"><block type="variables_get" id="2G_EQ|TNJ~`D1s/+GF(^"><field name="VAR" id="]i1rwz6fOMJY=.sIU!g3">当前高度</field></block></value></block></value><next><block type="speed" id="T#sD0*hH)-?A.3!y6;j9"><value name="speed"><block type="math_arithmetic" id="]HNTC2S4+~yNau**L+Rs"><field name="OP">MULTIPLY</field><value name="A"><block type="proportional" id="7#s:@H94D,CY)}=vg_%P"><field name="proportional_value">0.1</field></block></value><value name="B"><block type="math_arithmetic" id="nvCk}./16{;@R_n$M96+"><field name="OP">ADD</field><value name="A"><block type="variables_get" id="!GmY)K/;}(,*O-DcQk/7"><field name="VAR" id="KaJG}7yB,7MkNE{eun~+">误差</field></block></value><value name="B"><block type="math_arithmetic" id="Qvv2p7*_Qq.e_[E*=McW"><field name="OP">ADD</field><value name="A"><block type="integral" id="V2zSVlU?Jqrr:)]A[HDZ"><field name="integral_value">0.1</field><field name="error" id="KaJG}7yB,7MkNE{eun~+">误差</field></block></value><value name="B"><block type="derivative" id="NnrLTwu5oFxD*oJhqi8|"><field name="derivative_value">0.1</field><field name="error" id="KaJG}7yB,7MkNE{eun~+">误差</field></block></value></block></value></block></value></block></value></block></next></block></next></block></next></block></xml>'
                },
                {
                    name: 'step2',
                    intro: '点击 运行 按钮, 观察三维仿真与实时曲线中的实验结果',
                    buttons: ['run_button'],
                    expect: async () => {
                        return true;
                    }
                }
            ]
        }
    ];
}

export function buildExperiments() {
    return [
        {
            name: '机器人抓取实验',
            expect:
                '<xml><variables><variable id="siD^_}(L[9P5Iw!vC+y~">图片</variable><variable id="uyVOKwx4h.c$2rb@O/$x">预处理图片</variable><variable id="JM?NfF7|X@;UdGID|:6b">边缘</variable><variable id="6TOI,QlQ`zTH2ZRdGYvM">中心点</variable><variable id="yZ]IrYR,sK|jWA(l)ycN">工件类型</variable></variables><block type="wait_for_sensor_signal" id="WvOtXHmix.:#:5lsMTk6" x="50" y="50"><field name="sensor">光电传感器</field><next><block type="variables_set" id="C:VR!V/W4j#/6TNKAz?7"><field name="VAR" id="siD^_}(L[9P5Iw!vC+y~">图片</field><value name="VALUE"><block type="camera_snapshot" id="rsdp+rR?!Y+LQ0.12fct"><field name="exposure">([0-9]\\d*)</field></block></value><next><block type="variables_set" id="XTPeDY3T/l|}EQMYCm$d"><field name="VAR" id="uyVOKwx4h.c$2rb@O/$x">预处理图片</field><value name="VALUE"><block type="threshold" id="3r7#o7FG`~AL!YuV]#c)"><field name="image" id="siD^_}(L[9P5Iw!vC+y~">图片</field><field name="min">([0-9]\\d*)</field><field name="max">([0-9]\\d*)</field></block></value><next><block type="variables_set" id="koWo7Ly!dZtg}.IPn=v^"><field name="VAR" id="JM?NfF7|X@;UdGID|:6b">边缘</field><value name="VALUE"><block type="findcontours" id="{1x1r63o3vru7]Zdd.LE"><field name="image" id="uyVOKwx4h.c$2rb@O/$x">预处理图片</field><field name="min">([0-9]\\d*)</field><field name="max">([0-9]\\d*)</field></block></value><next><block type="variables_set" id="?W.A$8cMFS~Rkk:CmlQ:"><field name="VAR" id="6TOI,QlQ`zTH2ZRdGYvM">中心点</field><value name="VALUE"><block type="findcenter" id="SpL0FQ-9N;b37do-fRvC"><field name="contours" id="JM?NfF7|X@;UdGID|:6b">边缘</field><field name="image" id="siD^_}(L[9P5Iw!vC+y~">图片</field></block></value><next><block type="variables_set" id="Qb_q~jBye!VyZJJXK3}g"><field name="VAR" id="yZ]IrYR,sK|jWA(l)ycN">工件类型</field><value name="VALUE"><block type="shapedetect" id="ftaGV3x863Pe.|,i(B{T"><field name="contours" id="JM?NfF7|X@;UdGID|:6b">边缘</field><field name="image" id="siD^_}(L[9P5Iw!vC+y~">图片</field></block></value><next><block type="grab" id="{z4X.R#dI~Cs+u}oxumr"><field name="type" id="yZ]IrYR,sK|jWA(l)ycN">工件类型</field><field name="center" id="6TOI,QlQ`zTH2ZRdGYvM">中心点</field></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
            comments: {
                cameraSnapshot: {
                    valueRange: [
                        [0, 1000],
                        [1001, 1500],
                        [1501, 2500],
                        [2501, 3000],
                        [3000, 10000],
                        [10001, 20000]
                    ],
                    comment: ['你设的值太小了', '这个值勉强可以', '这个值设置的不错', '这个值勉强可以', '你设的值有点大了', '瞎搞，到底有没有认真上课']
                },
                thresholdMin: {
                    valueRange: [
                        [0, 10],
                        [11, 40],
                        [41, 60],
                        [61, 100],
                        [101, 110],
                        [111, 255]
                    ],
                    comment: ['你设的值太小了', '这个值勉强可以', '这个值设置的不错', '这个值勉强可以', '你设的值有点大了', '瞎搞，到底有没有认真上课']
                },
                thresholdMax: {
                    valueRange: [
                        [0, 40],
                        [41, 90],
                        [91, 110],
                        [111, 160],
                        [161, 200],
                        [201, 255]
                    ],
                    comment: ['你设的值太小了', '这个值勉强可以', '这个值设置的不错', '这个值勉强可以', '你设的值有点大了', '瞎搞，到底有没有认真上课']
                },
                findcontoursMin: {
                    valueRange: [
                        [0, 10],
                        [11, 20],
                        [21, 40],
                        [41, 50],
                        [51, 60],
                        [61, 255]
                    ],
                    comment: ['你设的值太小了', '这个值勉强可以', '这个值设置的不错', '这个值勉强可以', '你设的值有点大了', '瞎搞，到底有没有认真上课']
                },
                findcontoursMax: {
                    valueRange: [
                        [0, 30],
                        [31, 40],
                        [41, 60],
                        [61, 70],
                        [71, 100],
                        [101, 255]
                    ],
                    comment: ['你设的值太小了', '这个值勉强可以', '这个值设置的不错', '这个值勉强可以', '你设的值有点大了', '瞎搞，到底有没有认真上课']
                }
            }
        }
    ];
}

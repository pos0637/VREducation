export function buildSteps() {
    return [
        {
            steps: [
                {
                    intro: '<iframe frameborder="0" style="width: 500px; height: 400px; magin: 10px;" scrolling="auto" src="guides/exam.html"></iframe>'
                },
                {
                    intro: '在开放实验空间中完成视觉抓取程序编写'
                },
                {
                    element: document.querySelectorAll('[data-id="run_button"]')[0],
                    intro: '点击 运行 按钮, 观察三维仿真与探查器界面中的实验结果'
                },
                {
                    element: document.querySelectorAll('[data-id="exam_button"]')[0],
                    intro: '提交实验考核结果，查看实验报告'
                }
            ]
        }
    ];
}

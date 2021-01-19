<template>
    <div class="content">
        <!-- 头部 -->
        <a-table :columns="columns" :data-source="scoreData" :pagination="false">
            <span slot="experimentScore"></span>
            <span slot="reportScore"></span>
            <span slot="totalScore"></span>
        </a-table>
        <!-- 实验目的 -->
        <div class="item">
            <a-row type="flex" align="middle" style="background-color:#107dce; border: 1px solid #107dce;">
                <a-col :span="6" style="text-align: center; color:white; border: 1px solid #107dce;">
                    实验目的
                </a-col>
                <a-col :span="18" class="line-left" style="background-color:white; border-color:white;">
                    <div style="height:100%;">
                        1、了解机器视觉图像获取及色彩空间原理。<br />
                        2、掌握多种常见滤波算法的使用场景与效果。<br />
                        3、掌握图像坐标到世界坐标的转换。<br />
                        4、掌握机器人末端执行器姿态的控制。<br />
                        5、了解并掌握图形化编程的方法及技巧。
                    </div>
                </a-col>
            </a-row>
        </div>
        <!-- 实验原理 -->
        <div class="item">
            <a-row type="flex" align="middle" style="background-color:#107dce; border: 1px solid #107dce;">
                <a-col :span="6" style="text-align: center; color:white; border: 1px solid #107dce;">
                    实验原理
                </a-col>
                <a-col :span="18" class="line-left" style="background-color:white; border-color:white;">
                    <div style="height:100%;">
                        基于机器视觉的工业机器人动态抓取虚拟仿真实验通过三维仿真和在线ide编程，完成机器视觉图像获取、图像滤波与二值化、坐标转换、不同物体角度计算及几何中心定位等，最后建立视觉系统与机器人的通信连接，完成机器人抓取物体及控制机器人末端执行器进行各种操作。该虚拟仿真实验项目涵盖了机器人运动控制、机器人视觉、图形图像处理以及最优控制等多方面全方位的实训训练。
                    </div>
                </a-col>
            </a-row>
        </div>
        <!-- 实验内容 -->
        <div class="item">
            <a-row type="flex" align="middle" style="background-color:#107dce; border: 1px solid #107dce;">
                <a-col :span="6" style="text-align: center; color:white; border: 1px solid #107dce;">
                    实验内容
                </a-col>
                <a-col :span="18" class="line-left" style="background-color:white; border-color:white;">
                    <div style="height:100%;">
                        （1）机器人机构简介及视觉工作站拆装<br />
                        （2）图像采集实验<br />
                        （3）暴光图实验<br />
                        （4）图像预处理实验<br />
                        （5）二值化调整阈值实验<br />
                        （6）提取边缘实验<br />
                        （7）提取边缘调整阈值实验<br />
                        （8）提取中心点实验<br />
                        （9）形状识别实验<br />
                        （10）机器人抓取实验
                    </div>
                </a-col>
            </a-row>
        </div>
        <!-- 实验数据处理 -->
        <div class="item">
            <a-row type="flex" align="middle" class="line-right line-top line-left" style="background-color:#107dce; border: 1px solid #107dce;">
                <a-col :span="6" style="text-align: center; color:white; border: 1px solid #107dce;">
                    实验数据处理
                </a-col>
                <a-col :span="18" class="line-left" style="border:none;">
                    <div style="text-align:center; color:white; font-size:18px; font-weight:500;">实验数据</div>
                    <div style="min-height:100px; text-align:center; background-color:white;">
                        <a-row>
                            <a-col :span="4" class="data-title">数据类型\参数</a-col>
                            <a-col :span="4" class="data-title">曝光值</a-col>
                            <a-col :span="4" class="data-title">二值化最小值</a-col>
                            <a-col :span="4" class="data-title">二值化最大值</a-col>
                            <a-col :span="4" class="data-title">提取边缘最小值</a-col>
                            <a-col :span="4" class="data-title">提取边缘最大值</a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="4" class="data-title">推荐数据</a-col>
                            <a-col :span="4" class="data-item">2000</a-col>
                            <a-col :span="4" class="data-item">50</a-col>
                            <a-col :span="4" class="data-item">100</a-col>
                            <a-col :span="4" class="data-item">30</a-col>
                            <a-col :span="4" class="data-item">50</a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="4" class="data-title line-bottom">实验数据</a-col>
                            <a-col :span="4" class="data-item">{{ examData.cameraSnapshotValue != undefined ? examData.cameraSnapshotValue : 0 }}</a-col>
                            <a-col :span="4" class="data-item">{{ examData.thresholdMinValue != undefined ? examData.thresholdMinValue : 0 }}</a-col>
                            <a-col :span="4" class="data-item">{{ examData.thresholdMaxValue != undefined ? examData.thresholdMaxValue : 0 }}</a-col>
                            <a-col :span="4" class="data-item">{{ examData.findcontoursMinValue != undefined ? examData.findcontoursMinValue : 0 }}</a-col>
                            <a-col :span="4" class="data-item">{{ examData.findcontoursMaxValue != undefined ? examData.findcontoursMaxValue : 0 }}</a-col>
                        </a-row>
                    </div>
                    <div style="text-align:center; color:white; font-size:18px; font-weight:500;">实验结果</div>
                    <div style="min-height:100px; background-color:white;">
                        <a-row type="flex" align="middle" :gutter="1">
                            <a-col v-for="imageItem in base64Images" :key="imageItem.id" :span="6" style="text-align:center;">
                                <div>{{ imageItem.title }}</div>
                                <img :src="imageItem.url" :width="'90%'" height="170px;" />
                            </a-col>
                        </a-row>
                    </div>
                </a-col>
            </a-row>
        </div>
        <!-- 实验结论及分析 -->
        <div class="item">
            <a-row type="flex" align="middle" class="line-right line-top line-left" style="background-color:#107dce; border: 1px solid #107dce;">
                <a-col :span="6" style="text-align: center; color:white; border: 1px solid #107dce;">
                    实验结论及分析
                </a-col>
                <a-col :span="18" class="line-left" style="border:none;">
                    <div style="height:100%; text-align:center;">
                        <a-row type="flex" align="middle" style="min-height:40px;" class="data-title">
                            <a-col :span="6">步骤</a-col>
                            <a-col :span="18" style="min-height: 40px; line-height: 40px; border-left: 1px solid white;">对结果的影响</a-col>
                        </a-row>
                        <a-row type="flex" align="middle" class="data-title">
                            <a-col :span="6">曝光</a-col>
                            <a-col :span="18" style="border-left: 1px solid white;"><a-textarea v-model="examData.cameraSnapshotTips" :disabled="_checkEditState()" placeholder="输入您的答案" :rows="2"></a-textarea></a-col>
                        </a-row>
                        <a-row type="flex" align="middle" class="data-title">
                            <a-col :span="6">二值化</a-col>
                            <a-col :span="18" style="border-left: 1px solid white;"><a-textarea v-model="examData.thresholdTips" :disabled="_checkEditState()" placeholder="输入您的答案" :rows="2"></a-textarea></a-col>
                        </a-row>
                        <a-row type="flex" align="middle" class="data-title">
                            <a-col :span="6">多边形提取</a-col>
                            <a-col :span="18" style="border-left: 1px solid white;"><a-textarea v-model="examData.findcontoursTips" :disabled="_checkEditState()" placeholder="输入您的答案" :rows="2"></a-textarea></a-col>
                        </a-row>
                    </div>
                </a-col>
            </a-row>
        </div>
        <!-- 心得体会 -->
        <div class="item">
            <a-row type="flex" align="middle" class="line-right line-top line-left" style="background-color:#107dce; border: 1px solid #107dce;">
                <a-col :span="6" style="text-align: center; color:white; border: 1px solid #107dce;">
                    心得体会
                </a-col>
                <a-col :span="18" class="line-left" style="background-color:white; border-color:white;">
                    <a-textarea :disabled="_checkEditState()" v-model="examData.totalTips" placeholder="请输入心得体会" :auto-size="{ minRows: 3 }" />
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<style scoped>
.content {
    position: relative;
    width: 100%;
    height: 100%;
}

.ant-table-thead > tr > th {
    background-color: #107dce;
    color: white;
}

.item {
    margin-top: 1%;
}

.data-title {
    border-top: 1px solid white;
    border-left: 1px solid white;
    background-color: #107dce;
    color: white;
}

.data-item {
    background-color: white;
    border-bottom: 1px solid lightgrey;
    border-right: 1px solid lightgray;
    border-left: 1px solid lightgray;
}

.line-bottom {
    border-bottom: 0.5px solid white;
}

.line-right {
    border-right: 1px solid white;
}

.row {
    border: 1px solid;
}

.col {
    border: 1px solid;
    height: 20vh;
}

.line-left {
    border-left: 1px solid;
}

.line-top {
    border-top: 1px solid;
}

.base-message {
    border-right: 1px solid;
    font-size: 2.5vh;
}

.base-title {
    font-weight: 650;
}
</style>

<script>
import { buildExperiments } from './examReport';

export default {
    name: 'ExamReport',
    components: {},
    props: {
        info: Object,
        base64Images: Array
    },
    data: function() {
        return {
            columns: [
                {
                    title: '实验操作得分（50%）',
                    dataIndex: 'experimentScore',
                    key: 'experimentScore',
                    width: '33%',
                    textAlign: 'center'
                },
                {
                    title: '实验报告得分（50%）',
                    dataIndex: 'reportScore',
                    key: 'reportScore',
                    width: '33%'
                },
                {
                    title: '实验总成绩',
                    dataIndex: 'totalScore',
                    key: 'totalScore',
                    width: '33%'
                }
            ],
            scoreData: [
                {
                    experimentScore: '未完成实验',
                    reportScore: '等待老师评分',
                    totalScore: '0'
                }
            ],
            examData: null,
            experiments: buildExperiments()
        };
    },
    created() {
        this.examData = this.info;
    },
    mounted() {},
    methods: {
        _checkEditState() {
            return typeof this.info.checkFlag !== 'undefined' && this.info.checkFlag;
        },
        _getCameraSnapshotComment(value) {
            let valueRanges = this.experiments[0].comments.cameraSnapshot.valueRange;
            let comments = this.experiments[0].comments.cameraSnapshot.comment;
            for (let i = 0; i < valueRanges.length; i++) {
                if (value >= valueRanges[i][0] && value <= valueRanges[i][1]) {
                    return comments[i];
                }
            }
        },
        _getThresholdMinComment(value) {
            let valueRanges = this.experiments[0].comments.thresholdMin.valueRange;
            let comments = this.experiments[0].comments.thresholdMin.comment;
            for (let i = 0; i < valueRanges.length; i++) {
                if (value >= valueRanges[i][0] && value <= valueRanges[i][1]) {
                    return comments[i];
                }
            }
        },
        _getThresholdMaxComment(value) {
            let valueRanges = this.experiments[0].comments.thresholdMax.valueRange;
            let comments = this.experiments[0].comments.thresholdMax.comment;
            for (let i = 0; i < valueRanges.length; i++) {
                if (value >= valueRanges[i][0] && value <= valueRanges[i][1]) {
                    return comments[i];
                }
            }
        },
        _getFindcontoursMinComment(value) {
            let valueRanges = this.experiments[0].comments.findcontoursMin.valueRange;
            let comments = this.experiments[0].comments.findcontoursMin.comment;
            for (let i = 0; i < valueRanges.length; i++) {
                if (value >= valueRanges[i][0] && value <= valueRanges[i][1]) {
                    return comments[i];
                }
            }
        },
        _getFindcontoursMaxComment(value) {
            let valueRanges = this.experiments[0].comments.findcontoursMax.valueRange;
            let comments = this.experiments[0].comments.findcontoursMax.comment;
            for (let i = 0; i < valueRanges.length; i++) {
                if (value >= valueRanges[i][0] && value <= valueRanges[i][1]) {
                    return comments[i];
                }
            }
        }
    }
};
</script>

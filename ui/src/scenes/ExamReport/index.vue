<template>
    <div class="content">
        <div style="text-align:center;">
            <div>
                <img style="width:250px;height:60px;position:absolute;left:0;top:auto;" alt="集美大学诚毅学院Logo" src="./../../assets/chengyixueyuan.png" />
                <span style="font-size:5vh;font-weight:700;">集美大学诚毅学院</span>
            </div>
            <h1>工业机器人动态抓取虚拟仿真实验实验报告</h1>
            <a-row type="flex" align="middle" style="border:1px solid;">
                <a-col :span="3" class="line-right base-title">姓名</a-col>
                <a-col :span="3" class="line-right">默认用户</a-col>
                <a-col :span="3" class="line-right base-title">专业</a-col>
                <a-col :span="3" class="line-right">机械工程</a-col>
                <a-col :span="3" class="line-right base-title">班级</a-col>
                <a-col :span="3" class="line-right">1班</a-col>
                <a-col :span="3" class="line-right base-title">学号</a-col>
                <a-col :span="3">190112001</a-col>
            </a-row>
            <h3>实验结果</h3>
            <div>
                <a-row type="flex" align="middle" class="line-right line-top line-left">
                    <a-col :span="6">
                        <div>实验数据</div>
                    </a-col>
                    <a-col :span="8" class="line-left">
                        <div style="height:100%;">
                            <a-row class="line-bottom">曝光值</a-row>
                            <a-row class="line-bottom">二值化最小值</a-row>
                            <a-row class="line-bottom">二值化最大值</a-row>
                            <a-row class="line-bottom">提取边缘最小值</a-row>
                            <a-row>提取边缘最大值</a-row>
                        </div>
                    </a-col>
                    <a-col :span="10" class="line-left">
                        <div>
                            <a-row class="line-bottom">{{ examData.cameraSnapshotValue != undefined ? examData.cameraSnapshotValue : 0 }}</a-row>
                            <a-row class="line-bottom">{{ examData.thresholdMinValue != undefined ? examData.thresholdMinValue : 0 }}</a-row>
                            <a-row class="line-bottom">{{ examData.thresholdMaxValue != undefined ? examData.thresholdMaxValue : 0 }}</a-row>
                            <a-row class="line-bottom">{{ examData.findcontoursMinValue != undefined ? examData.findcontoursMinValue : 0 }}</a-row>
                            <a-row>{{ examData.findcontoursMaxValue != undefined ? examData.findcontoursMaxValue : 0 }}</a-row>
                        </div>
                    </a-col>
                </a-row>
            </div>
            <div>
                <a-row type="flex" align="middle" style="border:1px solid;">
                    <a-col :span="6">
                        <div>推荐数据</div>
                    </a-col>
                    <a-col :span="8" class="line-left">
                        <div style="height:100%;">
                            <a-row class="line-bottom">曝光值</a-row>
                            <a-row class="line-bottom">二值化最小值</a-row>
                            <a-row class="line-bottom">二值化最大值</a-row>
                            <a-row class="line-bottom">提取边缘最小值</a-row>
                            <a-row>提取边缘最大值</a-row>
                        </div>
                    </a-col>
                    <a-col :span="10" class="line-left">
                        <div>
                            <a-row class="line-bottom">2000</a-row>
                            <a-row class="line-bottom">50</a-row>
                            <a-row class="line-bottom">100</a-row>
                            <a-row class="line-bottom">30</a-row>
                            <a-row>50</a-row>
                        </div>
                    </a-col>
                </a-row>
            </div>
            <h3>实验结果与分析</h3>
            <div style="border:1px solid;">
                <a-row type="flex" align="middle" class="line-bottom">
                    <a-col :span="6">拍照</a-col>
                    <a-col :span="18" class="line-left">
                        <div>
                            <div>
                                <a-row type="flex" align="middle">
                                    <a-col :span="8">曝光值</a-col>
                                    <a-col :span="16">
                                        <div class="line-left">
                                            <a-row>
                                                <a-col :span="5" class="line-bottom line-right">实际值</a-col>
                                                <a-col :span="19" class="line-bottom">{{
                                                    examData.cameraSnapshotValue != undefined ? examData.cameraSnapshotValue : 0
                                                }}</a-col>
                                            </a-row>
                                            <a-row>
                                                <a-col :span="5" class="line-right">预期值</a-col>
                                                <a-col :span="19">2000</a-col>
                                            </a-row>
                                        </div>
                                    </a-col>
                                </a-row>
                                <a-row class="line-top line-bottom">
                                    <a-col :span="4" class="line-right">评语</a-col>
                                    <a-col :span="20">{{
                                        _getCameraSnapshotComment(examData.cameraSnapshotValue != undefined ? examData.cameraSnapshotValue : 0)
                                    }}</a-col>
                                </a-row>
                            </div>
                            <a-row type="flex" align="middle">
                                <a-col :span="4">心得体会</a-col>
                                <a-col :span="20" class="line-left" style="margin-left: -1px;">
                                    <a-textarea
                                        :disabled="_checkEditState()"
                                        v-model="examData.cameraSnapshotTips"
                                        placeholder="请输入心得体会"
                                        :auto-size="{ minRows: 3 }"
                                    />
                                </a-col>
                            </a-row>
                        </div>
                    </a-col>
                </a-row>
                <a-row type="flex" align="middle" class="line-bottom">
                    <a-col :span="6">预处理</a-col>
                    <a-col :span="18" class="line-left">
                        <div>
                            <div>
                                <a-row type="flex" align="middle">
                                    <a-col :span="8">二值化最小值</a-col>
                                    <a-col :span="16">
                                        <div class="line-left">
                                            <a-row>
                                                <a-col :span="5" class="line-bottom line-right">实际值</a-col>
                                                <a-col :span="19" class="line-bottom">{{
                                                    examData.thresholdMinValue != undefined ? examData.thresholdMinValue : 0
                                                }}</a-col>
                                            </a-row>
                                            <a-row>
                                                <a-col :span="5" class="line-right">预期值</a-col>
                                                <a-col :span="19">50</a-col>
                                            </a-row>
                                        </div>
                                    </a-col>
                                </a-row>
                                <a-row class="line-top line-bottom">
                                    <a-col :span="4" class="line-right">评语</a-col>
                                    <a-col :span="20">{{
                                        _getThresholdMinComment(examData.thresholdMinValue != undefined ? examData.thresholdMinValue : 0)
                                    }}</a-col>
                                </a-row>
                            </div>
                            <div>
                                <a-row type="flex" align="middle">
                                    <a-col :span="8">二值化最大值</a-col>
                                    <a-col :span="16">
                                        <div class="line-left">
                                            <a-row>
                                                <a-col :span="5" class="line-bottom line-right">实际值</a-col>
                                                <a-col :span="19" class="line-bottom">{{
                                                    examData.thresholdMaxValue != undefined ? examData.thresholdMaxValue : 0
                                                }}</a-col>
                                            </a-row>
                                            <a-row>
                                                <a-col :span="5" class="line-right">预期值</a-col>
                                                <a-col :span="19">100</a-col>
                                            </a-row>
                                        </div>
                                    </a-col>
                                </a-row>
                                <a-row class="line-top line-bottom">
                                    <a-col :span="4" class="line-right">评语</a-col>
                                    <a-col :span="20">{{
                                        _getThresholdMaxComment(examData.thresholdMaxValue != undefined ? examData.thresholdMaxValue : 0)
                                    }}</a-col>
                                </a-row>
                            </div>
                            <a-row type="flex" align="middle">
                                <a-col :span="4">心得体会</a-col>
                                <a-col :span="20" class="line-left" style="margin-left: -1px;">
                                    <a-textarea
                                        :disabled="_checkEditState()"
                                        v-model="examData.thresholdTips"
                                        placeholder="请输入心得体会"
                                        :auto-size="{ minRows: 3 }"
                                    />
                                </a-col>
                            </a-row>
                        </div>
                    </a-col>
                </a-row>
                <a-row type="flex" align="middle">
                    <a-col :span="6">多边形提取</a-col>
                    <a-col :span="18" class="line-left">
                        <div>
                            <div>
                                <a-row type="flex" align="middle">
                                    <a-col :span="8">多边形提取最小值</a-col>
                                    <a-col :span="16">
                                        <div class="line-left">
                                            <a-row>
                                                <a-col :span="5" class="line-bottom line-right">实际值</a-col>
                                                <a-col :span="19" class="line-bottom">{{
                                                    examData.findcontoursMinValue != undefined ? examData.findcontoursMinValue : 0
                                                }}</a-col>
                                            </a-row>
                                            <a-row>
                                                <a-col :span="5" class="line-right">预期值</a-col>
                                                <a-col :span="19">30</a-col>
                                            </a-row>
                                        </div>
                                    </a-col>
                                </a-row>
                                <a-row class="line-top line-bottom">
                                    <a-col :span="4" class="line-right">评语</a-col>
                                    <a-col :span="20">{{
                                        _getFindcontoursMinComment(examData.findcontoursMinValue != undefined ? examData.findcontoursMinValue : 0)
                                    }}</a-col>
                                </a-row>
                            </div>
                            <div>
                                <a-row type="flex" align="middle">
                                    <a-col :span="8">多边形提取最大值</a-col>
                                    <a-col :span="16">
                                        <div class="line-left">
                                            <a-row>
                                                <a-col :span="5" class="line-bottom line-right">实际值</a-col>
                                                <a-col :span="19" class="line-bottom">{{
                                                    examData.findcontoursMaxValue != undefined ? examData.findcontoursMaxValue : 0
                                                }}</a-col>
                                            </a-row>
                                            <a-row>
                                                <a-col :span="5" class="line-right">预期值</a-col>
                                                <a-col :span="19">50</a-col>
                                            </a-row>
                                        </div>
                                    </a-col>
                                </a-row>
                                <a-row class="line-top line-bottom">
                                    <a-col :span="4" class="line-right">评语</a-col>
                                    <a-col :span="20">{{
                                        _getFindcontoursMaxComment(examData.findcontoursMaxValue != undefined ? examData.findcontoursMaxValue : 0)
                                    }}</a-col>
                                </a-row>
                            </div>
                            <a-row type="flex" align="middle">
                                <a-col :span="4">心得体会</a-col>
                                <a-col :span="20" class="line-left" style="margin-left: -1px;">
                                    <a-textarea
                                        :disabled="_checkEditState()"
                                        v-model="examData.findcontoursTips"
                                        placeholder="请输入心得体会"
                                        :auto-size="{ minRows: 3 }"
                                    />
                                </a-col>
                            </a-row>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>
    </div>
</template>

<style scoped>
.content {
    position: relative;
    width: 100%;
    height: 100%;
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

.line-bottom {
    border-bottom: 1px solid;
}

.line-right {
    border-right: 1px solid;
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
        info: Object
    },
    data: function() {
        return {
            examData: null,
            experiments: buildExperiments()
        };
    },
    created() {
        this.examData = this.info;
    },
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

<template>
    <div>
        <div style="background-color: #2f3a59;padding:5px;" class="v-detail">
            <div class="container details-page-header" style="background-color: #2f3a59;padding:5px;">
                <div class="light"></div>
                <div class="details-page-container" style="margin-top:45px;">
                    <div class="details-page-hbox">
                        <div class="details-page-col details-page-info" id="detailsInfo" style="float:left;">
                            <div>
                                <h1 class="details-page-info-title" style="margin-top:5px;color:#ffffff;">基于机器视觉的工业机器人动态抓取虚拟仿真实验</h1>
                                <div class="details-page-info-score" id="infoScore">
                                    <div id="test4" class="layui-inline"></div>
                                </div>
                            </div>
                            <ul class="details-page-info-tags" style="color:#ffffff;opacity:0.5;font-size: 10pt;">
                                <li style="color:#ffffff;opacity:0.5;font-size: 11pt;width: 220px;">所属专业类：{{ experimentInfo.major_category }}</li>
                                <li style="color:#ffffff;opacity:0.5;font-size: 11pt;width: 220px;">对应专业：{{ experimentInfo.major }}</li>
                                <li style="color:#ffffff;opacity:0.5;font-size: 11pt;width: 220px;">学校：{{ experimentInfo.college }}</li>
                                <li style="color:#ffffff;opacity:0.5;font-size: 11pt;width: 220px;">负责人：洪联系</li>
                                <li style="color:#ffffff;opacity:0.5;font-size: 11pt;width: 220px;">试用账号：admin</li>
                                <li style="color:#ffffff;opacity:0.5;font-size: 11pt;width: 220px;">试用密码：123456</li>
                            </ul>
                            <div class="details-page-info-description" style="height: 80px;color:#ffffff">
                                <p style="margin-top: 15px;font-size: 12pt;line-height: 22px;">
                                    {{ experimentInfo.description }}
                                </p>
                            </div>
                            <div class="details-page-info-btns">
                                <a @click="_onChangeScene" href="javascript:void(0);">
                                    <a-button type="primary" id="doBtn">我要做实验</a-button>
                                </a>
                            </div>
                        </div>
                        <div class="details-page-col details-page-thumb" style="padding-top: 0px;">
                            <div style="width: 400px;float:right;margin-top:40px;margin-right: 10px;">
                                <div class="play_videoPlayer_box f_left" style="margin: 0px auto;height: 235px;">
                                    <video src="/VREducation/videos/home.mp4" width="100%" height="100%" preload="auto" controls="controls"></video>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container" style="padding: 5px;">
            <div style="width:80%; background-color: #fff; margin: auto;">
                <a-tabs default-active-key="1" @change="_callback">
                    <a-tab-pane key="1" tab="项目团队">
                        <div v-html="experimentInfo.project_team_content"></div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="项目描述">
                        <div v-html="experimentInfo.project_description_content"></div>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="网络要求">
                        <div v-html="experimentInfo.network_requirements_content"></div>
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="技术架构">
                        <div v-html="experimentInfo.technical_architecture_content"></div>
                    </a-tab-pane>
                    <a-tab-pane key="5" tab="项目特色">
                        <div v-html="experimentInfo.project_characteristics_content"></div>
                    </a-tab-pane>
                    <a-tab-pane key="6" tab="服务计划">
                        <div v-html="experimentInfo.service_plan_content"></div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
    </div>
</template>

<style>
.ant-tabs {
    text-align: left;
}
.v-detail {
    /* background-image: url('../img/back.png'); */
    background-repeat: no-repeat;
    background-size: cover;
}

/* 搜索条件 */
.container {
    padding: 20px 0 5px;
    background-color: whitesmoke;
}

.details-page-header {
    width: 100%;
    min-height: 380px;
    overflow: hidden;
    position: relative;
    background-color: #2f3a59;
}

.details-page-header .light {
    position: absolute;
    width: 1200px;
    height: 100%;
    left: 50%;
    margin-left: -600px;
}

.details-page-header .light:after {
    content: '';
    display: block;
    position: absolute;
    width: 960px;
    height: 580px;
    top: -220px;
    left: -200px;
    background: rgba(116, 69, 103, 1);
    background: -moz-radial-gradient(
        center,
        ellipse cover,
        rgba(116, 69, 103, 1) 0%,
        rgba(116, 69, 103, 1) 22%,
        rgba(106, 65, 102, 1) 35%,
        rgba(86, 60, 93, 1) 46%,
        rgba(47, 58, 89, 1) 66%,
        rgba(47, 58, 89, 1) 100%
    );
    background: -webkit-gradient(
        radial,
        center center,
        0px,
        center center,
        100%,
        color-stop(0%, rgba(116, 69, 103, 1)),
        color-stop(22%, rgba(116, 69, 103, 1)),
        color-stop(35%, rgba(106, 65, 102, 1)),
        color-stop(46%, rgba(86, 60, 93, 1)),
        color-stop(66%, rgba(47, 58, 89, 1)),
        color-stop(100%, rgba(47, 58, 89, 1))
    );
    background: -webkit-radial-gradient(
        center,
        ellipse cover,
        rgba(116, 69, 103, 1) 0%,
        rgba(116, 69, 103, 1) 22%,
        rgba(106, 65, 102, 1) 35%,
        rgba(86, 60, 93, 1) 46%,
        rgba(47, 58, 89, 1) 66%,
        rgba(47, 58, 89, 1) 100%
    );
    background: -o-radial-gradient(
        center,
        ellipse cover,
        rgba(116, 69, 103, 1) 0%,
        rgba(116, 69, 103, 1) 22%,
        rgba(106, 65, 102, 1) 35%,
        rgba(86, 60, 93, 1) 46%,
        rgba(47, 58, 89, 1) 66%,
        rgba(47, 58, 89, 1) 100%
    );
    background: -ms-radial-gradient(
        center,
        ellipse cover,
        rgba(116, 69, 103, 1) 0%,
        rgba(116, 69, 103, 1) 22%,
        rgba(106, 65, 102, 1) 35%,
        rgba(86, 60, 93, 1) 46%,
        rgba(47, 58, 89, 1) 66%,
        rgba(47, 58, 89, 1) 100%
    );
    background: radial-gradient(
        ellipse at center,
        rgba(116, 69, 103, 1) 0%,
        rgba(116, 69, 103, 1) 22%,
        rgba(106, 65, 102, 1) 35%,
        rgba(86, 60, 93, 1) 46%,
        rgba(47, 58, 89, 1) 66%,
        rgba(47, 58, 89, 1) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#744567', endColorstr='#2f3a59', GradientType=1);
}

.details-page-container {
    position: relative;
    width: 1200px;
    height: 100%;
    margin: 0 auto;
}

.details-page-container:before,
.details-page-container:after {
    content: ' ';
    display: table;
    clear: both;
}

.details-page-hbox {
    display: table;
    width: 100%;
    height: 100%;
    border-spacing: 0;
    table-layout: fixed;
}

.details-page-hbox .details-page-col {
    display: table-cell;
    float: none;
    height: 100%;
    vertical-align: top;
    box-sizing: border-box;
    text-align: left;
}

.details-page-info {
    width: 730px;
    color: #fff;
}

.details-page-info-title {
    font-weight: 400;
    font-size: 24px;
    letter-spacing: 1px;
    margin-top: 46px;
    line-height: 1.5;
}

.details-page-info-score {
    display: block;
    color: #fff;
    margin: 10px 0;
}

.details-page-info-score .starbox {
    float: left;
}

.details-page-info-score .starbox span {
    margin-right: 5px;
}

.details-page-info-score .starbox .star {
    /* background: url(../images/sprites.png) no-repeat; */
    width: 16px;
    height: 16px;
    display: inline-block;
    margin-top: 2px;
}

.details-page-info-score .starbox .star.yes {
    background-position: 0 -88px;
}

.details-page-info-score .starbox .star.no {
    background-position: 0 -123px;
    filter: grayscale(100);
    -webkit-filter: grayscale(100);
}

.details-page-info-score .num {
    margin-left: 8px;
    font-size: 12px;
}

.details-page-info-score .num em {
    color: #fff;
}

.details-page-info-tags {
    font-size: 14px;
    display: block;
    width: 100%;
    color: #fff;
    opacity: 0.5;
    margin-left: -18px;
    margin-top: 15px;
    line-height: 20px;
}

.details-page-info-tags > li {
    display: inline-block;
    float: none;
    margin: 0 18px;
}

.details-page-info-description {
    margin-top: 15px;
    font-size: 14px;
    line-height: 22px;
    /*word-break: break-all;*/
}

.details-page-info-btns {
    margin-top: 25px;
    margin-left: -10px;
    width: 100%;
    margin-bottom: 40px;
}

.details-page-info-btns:before,
.details-page-info-btns:after {
    content: ' ';
    display: table;
    clear: both;
}

.details-page-info-btns .btn {
    float: left;
    margin: 0 10px;
}

.details-page-info-do-btn {
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    padding: 14px 42px;
    transition: all 0.3s;
    -webkit-transition: all 0.3s;
}

.details-page-info-do-btn:active {
    transform: scale(0.98) translateY(-2px);
    -webkit-transform: scale(0.98) translateY(-2px);
}

.details-page-thumb {
    padding-top: 69px;
    padding-left: 76px;
    width: 395px;
}

.details-page-thumb-frame {
    width: 100%;
    height: 0;
    position: relative;
    padding-top: 63.29%;
    float: right;
    background-color: #000;
    background-image: url('/images/logo1.png');
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

.details-page-thumb-video {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
</style>

<script>
import Introduction from '@/scenes/Introduction';
import RobotStructural from '@/scenes/RobotStructural';
import VisionSystemStructural from '@/scenes/VisionSystemStructural';
import RobotProgramming from '@/scenes/RobotProgramming';
import Experiment from '@/scenes/Experiment';
import Exam from '@/scenes/Exam';
import ExperimentReports from '@/views/experimentReports';
import { noAuthLogin } from '@/api/login';
import request from '@/miscs/request';

export default {
    name: 'Home',
    data() {
        return {
            experimentInfo: {}
        };
    },
    computed: {
        content() {
            const scene = this.$store.state.scene;
            if (scene === 'introduction') {
                return Introduction;
            } else if (scene === 'robotStructural') {
                return RobotStructural;
            } else if (scene === 'robotProgramming') {
                return RobotProgramming;
            } else if (scene === 'visionSystemStructural') {
                return VisionSystemStructural;
            } else if (scene.startsWith('experiment')) {
                return Experiment;
            } else if (scene === 'exam') {
                return Exam;
            } else if (scene === 'reports') {
                return ExperimentReports;
            } else {
                return Introduction;
            }
        },
        selectedKeys() {
            return [this.$store.state.scene];
        }
    },
    created() {
        this._noAuthLogin();
    },
    methods: {
        _onChangeScene() {
            this.$store.commit('changeScene', { scene: 'splash', stage: null, step: null });
        },
        _callback(key) {
            console.log(key);
        },
        _noAuthLogin() {
            noAuthLogin().then(() => {
                request({
                    url: `/online/cgform/api/getData/da7a7f389af04cc4a8275ebfe3d804a9`,
                    method: 'GET',
                    params: {
                        _t: new Date(),
                        column: 'createTime',
                        order: 'desc',
                        pageNo: 1,
                        pageSize: 10,
                        superQueryMatchType: 'and'
                    }
                })
                    .then(res => {
                        console.log(res);
                        if (typeof res.result.records !== 'undefined') {
                            this.experimentInfo = res.result.records[0];
                        } else {
                            this.experimentInfo = {};
                        }
                    })
                    .catch(() => {
                        this.experimentInfo = {};
                    });
            });
        }
    }
};
</script>

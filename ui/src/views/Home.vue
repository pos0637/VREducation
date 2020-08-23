<template>
    <a-layout id="framework" class="layout">
        <a-layout-header>
            <div class="header-line">
                <img src="@/assets/ding1.png" style="height: 48px; margin-left: 15%" />
            </div>
        </a-layout-header>
        <a-layout class="layout">
            <a-layout-sider style="background-color: #fff;">
                <img src="@/assets/user.png" style="width:65px; float:left" />
                <span class="userinfo">{{ this.userInfo.realname ? this.userInfo.realname : '默认用户' }}</span>
                <span class="logout"><a href="javascrip:void(0);" @click="_logout">退出登录</a></span>
                <a-menu
                    :default-selected-keys="['introduction']"
                    :defaultOpenKeys="['experiment']"
                    :selectedKeys="selectedKeys"
                    class="menu"
                    mode="inline"
                    theme="light"
                    style="background:#292929; font-size: 18px;"
                    @select="_onMenuSelect"
                >
                    <a-menu-item key="introduction">
                        <div>
                            <span>实&nbsp;验&nbsp;简&nbsp;介</span>
                        </div>
                    </a-menu-item>
                    <a-menu-item key="robotStructural">
                        <div>
                            <span>无人机结构简介</span>
                        </div>
                    </a-menu-item>
                    <a-menu-item key="visionSystemStructural">
                        <div>
                            <span>无人机拆装</span>
                        </div>
                    </a-menu-item>
                    <a-sub-menu key="experiment" title="PID控制实验">
                        <a-menu-item key="experiment1">
                            <div>
                                <span>上升速度控制实验</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item key="experiment2">
                            <div>
                                <span>比例控制实验</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item key="experiment3">
                            <div>
                                <span>稳态误差调节实验</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item key="experiment4">
                            <div>
                                <span>积分控制实验</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item key="experiment5">
                            <div>
                                <span>超调量调节实验</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item key="experiment6">
                            <div>
                                <span>微分控制实验</span>
                            </div>
                        </a-menu-item>
                    </a-sub-menu>
                    <a-menu-item key="exam">
                        <div>
                            <span>实&nbsp;验&nbsp;考&nbsp;核</span>
                        </div>
                    </a-menu-item>
                    <a-menu-item key="help">
                        <div>
                            <span>延&nbsp;伸&nbsp;阅&nbsp;读</span>
                        </div>
                    </a-menu-item>
                    <a-menu-item key="reports">
                        <div>
                            <span>历&nbsp;史&nbsp;报&nbsp;告</span>
                        </div>
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>
            <a-layout-content>
                <component v-bind:is="content"></component>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<style>
#framework {
    width: 100%;
    height: 100%;
}

#framework .ant-layout-header {
    height: 24px;
    text-align: left;
    line-height: 24px;
    position: relative;
    background: #ffffff;
    color: #fff;
    padding: 0;
}

#framework .header-line {
    height: 24px;
    border-bottom: 2px solid #bbbb1f;
}

#framework .ant-layout-sider {
    width: 160px !important;
    height: 100%;
    min-width: 160px !important;
    max-width: 160px !important;
    background: #292929;
    color: #fff;
}

#framework .userinfo {
    position: absolute;
    top: 10px;
    left: 60px;
    font-size: 14px;
    color: #dada28;
}

#framework .logout {
    position: absolute;
    top: 40px;
    left: 60px;
    font-size: 8px;
    color: dodgerblue;
    cursor: pointer;
}

.menu {
    background-color: #292929;
    margin-top: 20px;
}

.menu li {
    background-color: #ffffff !important;
    margin-top: 20px;
    height: auto !important;
}

.ant-menu-item-selected div {
    border-bottom: 2px solid #dada28;
}

.ant-menu {
    background-color: #ffffff !important;
}

.ant-menu-dark .ant-menu-inline.ant-menu-sub {
    box-shadow: 0 2px 8px #292929 inset !important;
}

#framework .ant-layout-content {
    width: 100%;
    height: 100%;
    padding-top: 26px;
    background-color: #ffffff;
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
import { getUserInfo } from '@/miscs/auth';
import { logout } from '@/api/login';

export default {
    name: 'Home',
    data() {
        return {
            userInfo: {}
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
        this.userInfo = getUserInfo();
    },
    methods: {
        _onMenuSelect(item) {
            if (item.key.startsWith('experiment')) {
                this.$store.commit('changeScene', { scene: item.key, stage: parseInt(item.key.substring('experiment'.length)) - 1, step: null });
            } else {
                this.$store.commit('changeScene', { scene: item.key, stage: null, step: null });
            }
        },
        _logout() {
            logout()
                .then(() => {
                    this.$store.commit('changeScene', { scene: 'introduce', stage: null, step: null });
                    location.reload();
                })
                .catch(() => {
                    this.$message.error('请求失败，请重试');
                });
        }
    }
};
</script>

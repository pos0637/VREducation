<template>
    <a-layout id="framework" class="layout">
        <a-layout-header>
            <div class="header-line">
                <img src="@/assets/ding.png" style="height: 48px; margin-left: 15%" />
            </div>
        </a-layout-header>
        <a-layout class="layout">
            <a-layout-sider>
                <img src="@/assets/user.png" style="width:65px; float:left" />
                <span class="userinfo">{{ this.userName }}</span>
                <a-menu
                    :default-selected-keys="['introduction']"
                    :defaultOpenKeys="['experiment']"
                    :selectedKeys="selectedKeys"
                    class="menu"
                    mode="inline"
                    theme="dark"
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
                            <span>机器人结构简介</span>
                        </div>
                    </a-menu-item>
                    <a-menu-item key="robotProgramming">
                        <div>
                            <span>机器人示教原理</span>
                        </div>
                    </a-menu-item>
                    <a-menu-item key="visionSystemStructural">
                        <div>
                            <span>视觉工作站拆装</span>
                        </div>
                    </a-menu-item>
                    <a-sub-menu key="experiment" title="视觉抓取实验">
                        <a-menu-item key="experiment1">
                            <div>
                                <span>图像采集实验</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item key="experiment2">
                            <div>
                                <span>曝光度实验</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item key="experiment3">
                            <div>
                                <span>图像预处理实验</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item key="experiment4">
                            <div>
                                <span>二值化调整阈值</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item key="experiment5">
                            <div>
                                <span>提取边缘实验</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item key="experiment6">
                            <div>
                                <span>提取边缘阈值</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item key="experiment7">
                            <div>
                                <span>提取中心点实验</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item key="experiment8">
                            <div>
                                <span>形状识别实验</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item key="experiment9">
                            <div>
                                <span>机器人抓取实验</span>
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
    background: #292929;
    color: #fff;
    padding: 0;
}

#framework .header-line {
    height: 24px;
    border-bottom: 2px solid #a7a726;
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
    top: 20px;
    left: 60px;
    font-size: 14px;
    color: #dada28;
}

.menu {
    background-color: #292929;
    margin-top: 20px;
}

.menu li {
    background-color: #292929 !important;
    margin-top: 20px;
    height: auto !important;
}

.ant-menu-item-selected div {
    border-bottom: 2px solid #dada28;
}

.ant-menu {
    background-color: #292929 !important;
}

.ant-menu-dark .ant-menu-inline.ant-menu-sub {
    box-shadow: 0 2px 8px #292929 inset !important;
}

#framework .ant-layout-content {
    width: 100%;
    height: 100%;
    padding-top: 26px;
    background-color: #292929;
}
</style>

<script>
import Introduction from '@/scenes/Introduction';
import RobotStructural from '@/scenes/RobotStructural';
import VisionSystemStructural from '@/scenes/VisionSystemStructural';
import RobotProgramming from '@/scenes/RobotProgramming';
import Experiment from '@/scenes/Experiment';
import Exam from '@/scenes/Exam';

export default {
    name: 'Home',
    data() {
        return {
            userName: '默认用户'
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
            } else {
                return Introduction;
            }
        },
        selectedKeys() {
            return [this.$store.state.scene];
        }
    },
    methods: {
        _onMenuSelect(item) {
            if (item.key.startsWith('experiment')) {
                this.$store.commit('changeScene', { scene: item.key, stage: parseInt(item.key.substring('experiment'.length)) - 1, step: null });
            } else {
                this.$store.commit('changeScene', { scene: item.key, stage: null, step: null });
            }
        }
    }
};
</script>

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
                    :selectedKeys="selectedKeys"
                    class="menu"
                    mode="inline"
                    theme="dark"
                    style="background:#292929; font-size: 18px"
                    :selectable="false"
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
                    <a-menu-item key="experiment">
                        <div>
                            <span>视觉抓取实验</span>
                        </div>
                    </a-menu-item>
                    <a-menu-item key="exam">
                        <div>
                            <span>实&nbsp;验&nbsp;考&nbsp;核</span>
                        </div>
                    </a-menu-item>
                    <a-menu-item key="experiment3">
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
            } else if (scene === 'experiment') {
                return Experiment;
            } else if (scene === 'exam') {
                return Exam;
            } else {
                return Introduction;
            }
        },
        selectedKeys() {
            console.debug([this.$store.state.scene]);
            return [this.$store.state.scene];
        }
    },
    methods: {
        _onMenuSelect(item) {
            this.$store.commit('changeScene', item.key, null, null);
        }
    }
};
</script>

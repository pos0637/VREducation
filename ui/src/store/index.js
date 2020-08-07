import Vue from 'vue';
import Vuex from 'vuex';
import { getToken, removeToken } from '@/miscs/auth';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 场景
        scene: 'introduce',
        // scene: 'splash',

        // 阶段
        stage: null,

        // 步骤
        step: null,

        // 身份信息：token
        token: getToken()
    },
    mutations: {
        /**
         * 改变场景
         *
         * @param {*} state 状态
         * @param {*} data 数据
         */
        changeScene(state, data) {
            state.scene = data.scene;
            state.stage = data.stage;
            state.step = data.step;
        },

        /**
         * 改变阶段
         *
         * @param {*} state 状态
         *@param {*} data 数据
         */
        changeStage(state, data) {
            state.stage = data.stage;
            state.step = data.step;
        },

        /**
         * 设值token
         */
        setToken: (state, token) => {
            state.token = token;
        },

        /**
         * 注销
         */
        fedLogout() {
            this.commit('setToken', '');
            removeToken();
        }
    },
    actions: {},
    modules: {}
});

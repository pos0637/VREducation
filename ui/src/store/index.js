import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 场景
        scene: 'splash',

        // 阶段
        stage: null,

        // 步骤
        step: null
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
        }
    },
    actions: {},
    modules: {}
});

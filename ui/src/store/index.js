import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 场景
        scene: 'introduction',

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
         * @param {*} scene 场景
         * @param {*} stage 阶段
         * @param {*} step 步骤
         */
        changeScene(state, scene, stage, step) {
            state.scene = scene;
            state.stage = stage;
            state.step = step;
        },

        /**
         * 改变阶段
         *
         * @param {*} state 状态
         * @param {*} scene 场景
         * @param {*} stage 阶段
         */
        changeStage(state, stage, step) {
            state.stage = stage;
            state.step = step;
        }
    },
    actions: {},
    modules: {}
});

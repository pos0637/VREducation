import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import VueResize from 'vue-resize';
import 'vue-resize/dist/vue-resize.css';
import VueIntro from 'vue-introjs';
import 'intro.js/introjs.css';

Vue.config.productionTip = false;

Vue.use(Antd);
Vue.use(VueResize);
Vue.use(VueIntro);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

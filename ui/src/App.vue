<template>
    <div id="app">
        <component v-bind:is="content"></component>
        <UnityContainer :visiable="true" />
    </div>
</template>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
}
</style>

<script>
import UnityContainer from '@/components/unityContainer';
import Splash from '@/views/Splash';
import Home from '@/views/Home';

export default {
    name: 'app',
    components: {
        UnityContainer
    },
    computed: {
        content() {
            const scene = this.$store.state.scene;
            if (scene === 'splash') {
                return Splash;
            } else {
                return Home;
            }
        }
    },
    methods: {
        onChangeScene() {
            this.$store.commit('changeScene', 'about', null, null);
        }
    }
};
</script>

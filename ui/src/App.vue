<template>
    <div id="app">
        <div id="nav">
            <component v-bind:is="content"></component>
        </div>
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

#nav {
    width: 100%;
    height: 100%;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
</style>

<script>
import Home from '@/views/Home';
import Experiment from '@/scenes/Experiment';

export default {
    name: 'app',
    computed: {
        content() {
            const scene = this.$store.state.scene;
            if (scene === 'splash') {
                return Experiment;
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

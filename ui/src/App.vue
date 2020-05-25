<template>
    <div id="app">
        <div id="nav">
            <component v-bind:is="content"></component>
        </div>
        <button @click="onChangeScene">变换</button>
    </div>
</template>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
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
import About from '@/views/About';

export default {
    name: 'app',
    computed: {
        content() {
            const scene = this.$store.state.scene;
            if (scene === 'splash') {
                return Home;
            } else {
                return About;
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

<template>
    <div class="container" style="background-image: url(splash/images/background.jpg)">
        <div class="header">
            <img src="splash/images/title.png" width="1199px" height="277px" />
        </div>
        <div class="progress">
            <span style="font-size: 1.6rem; color: white;">正在加载, 请稍等......</span>
            <a-progress
                :stroke-color="{
                    '0%': '#108ee9',
                    '100%': '#87d068'
                }"
                :percent="progress"
            />
        </div>
    </div>
</template>

<style scoped>
.container {
    position: relative;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: top center;
}

.header {
    margin: 0 auto;
    padding: 0;
}

.progress {
    position: absolute;
    width: 70%;
    margin: 0 auto;
    padding: 0;
    left: 0px;
    right: 0px;
    bottom: 200px;
}
</style>

<script>
export default {
    data: function() {
        return { progress: 0 };
    },
    mounted() {
        top.window.onUnityProgress = (sender, progress) => {
            this.progress = progress * 100;
        };

        top.window.onUnityInitialized = () => {
            this.$store.commit('changeScene', 'introduction', null, null);
        };
    },
    beforeDestroy() {
        top.window.onUnityInitialized = null;
    }
};
</script>

<template>
    <div class="spin" v-if="visiable"><a-spin style="position: absolute; top: 50%; left:50%; transform: translate(-50%,-50%);" size="large" :tip="tip" /></div>
</template>

<style scoped>
.spin {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 50%;
    z-index: 999;
}
</style>

<script>
export default {
    name: 'loading',
    props: {
        visiable: Boolean,
        tip: String
    }
};
</script>

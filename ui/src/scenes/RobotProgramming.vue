<template>
    <div class="content">
        <a-layout style="width: 100%; height: 100%; background-color: #292929;">
            <a-row style="padding: 8px;">
                <a-col :span="12" style="text-align: left">
                    <span style="font-size: 1.4rem; color: white;">机器人示教原理</span>
                </a-col>
                <a-col :span="12" style="text-align: right">
                    <a-button type="primary" icon="forward" style="margin-left: 8px;" @click="_nextUnit">下一单元</a-button>
                </a-col>
            </a-row>
        </a-layout>
    </div>
</template>

<style scoped>
.content {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #292929;
}
</style>

<script>
export default {
    name: 'RobotProgramming',
    methods: {
        _nextUnit() {
            this.$store.commit('changeScene', 'visionSystemStructural', null, null);
        }
    }
};
</script>

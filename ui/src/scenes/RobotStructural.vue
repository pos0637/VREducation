<template>
    <div id="robotstructural_container" style="widrh: 100%; height: 100%">
        <iframe id="robotstructural_frame" frameborder="0" scrolling="auto" src="unity/index.html"></iframe>
    </div>
</template>

<script>
export default {
    name: 'RobotStructural',
    mounted() {
        const container = document.getElementById('robotstructural_container');
        const frame = document.getElementById('robotstructural_frame');
        frame.style.width = container.clientWidth + 'px';
        frame.style.height = container.clientHeight + 'px';
    }
};
</script>

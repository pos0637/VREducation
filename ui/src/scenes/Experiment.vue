<template>
    <div id="framework">
        <div id="content">
            <a-layout style="width: 100%; height: 100%">
                <a-row style="text-align: left">
                    <a-button type="primary" icon="right-square" style="margin-left: 16px">运行</a-button>
                    <a-button type="primary" icon="question" style="margin-left: 16px">帮助</a-button>
                    <a-button type="primary" icon="forward" style="margin-left: 16px">下一步骤实验</a-button>
                </a-row>
                <a-row style="height: 100%">
                    <a-col :span="12" class="codeEditor">
                        <CodeEditor />
                    </a-col>
                    <a-col :span="12" class="vr">VR</a-col>
                </a-row>
            </a-layout>
        </div>
        <div id="hint">hint</div>
    </div>
</template>

<style>
#framework {
    width: 100%;
    height: 100%;
}

#content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

#content .codeEditor {
    display: flex;
    flex-direction: column;
    height: 100%;
}

#content .vr {
    display: flex;
    flex-direction: column;
    height: 100%;
}

#hint {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
}
</style>

<script>
import CodeEditor from '@/components/codeEditor';

export default {
    name: 'Experiment',
    components: {
        CodeEditor
    },
    data: function() {
        return {};
    }
};
</script>

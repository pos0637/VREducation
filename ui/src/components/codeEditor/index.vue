<template>
    <a-layout>
        <a-row type="flex">
            代码编辑器
            <a-button type="primary" icon="right-square" style="margin-left: 16px" v-bind:disabled="buttons.run_button" @click="_runCode()">运行</a-button>
            <button @click="_generateXml()">dump</button>
            <button @click="_generateCode()">generate</button>
            <button @click="_runCode()">run</button>
        </a-row>
        <a-row type="flex" style="flex-grow: 1">
            <div id="editor" style="width: 100%; height: 100%" />
        </a-row>
        <a-row type="flex" align="bottom" style="height: 20px">
            <a-col v-for="item in inspectorVariables" :key="item.id" :span="24 / inspectorVariables.length" class="inspector_variable_name">{{
                item.name
            }}</a-col>
        </a-row>
        <a-row type="flex" align="bottom" style="height: 120px">
            <a-col v-for="(item, index) in inspectorVariables" :key="item.id" :span="24 / inspectorVariables.length" class="inspector_variable_data">
                <canvas
                    v-if="item.id !== null"
                    :ref="inspectorVariables[index].id"
                    :id="inspectorVariables[index].id"
                    :data-name="item.name"
                    class="inspector_variable_image"
                    @click="_onImageInspectorClick"
                />
            </a-col>
        </a-row>
        <a-modal v-model="imageInspectorVisiable" :title="imageInspectorTitle">
            <template slot="footer">
                <span />
            </template>
            <img :src="this.imageInspectorData" class="image_inspector" />
        </a-modal>
    </a-layout>
</template>

<style>
.introjs-tooltip {
    min-width: 500px !important;
    min-height: 400px !important;
}
</style>

<style scoped>
.inspector_variable_name {
    text-align: middle;
}

.inspector_variable_data {
    height: 100%;
    text-align: left;
}

.inspector_variable_image {
    width: 100%;
    height: 100%;
}

.image_inspector {
    width: 100%;
    height: 100%;
    margin-top: 32px;
}
</style>

<script>
import Blockly from 'blockly';
import 'blockly/blocks';
import 'blockly/javascript';
import * as Zh from 'blockly/msg/zh-hans';
import { sleep } from '@/miscs/coroutine';

export default {
    name: 'CodeEditor',
    props: {
        blocks: Array,
        toolbox: String,
        tours: Array,
        experiments: Array,
        inspectorVariables: Array,
        eventHandler: Object
    },
    data: function() {
        return {
            workspace: null,
            toolboxData: null,
            experimentMode: false,
            experiment: null,
            variables: {},
            imageInspectorVisiable: false,
            imageInspectorTitle: null,
            imageInspectorData: null,
            buttons: {
                run_button: false
            }
        };
    },
    mounted: function() {
        this.initialize(document.getElementById('editor'));
    },
    methods: {
        initialize(container) {
            Blockly.setLocale(Zh);
            Blockly.defineBlocksWithJsonArray(this.blocks);

            for (const item of this.blocks) {
                if (typeof item.javascript !== 'undefined') {
                    Blockly.JavaScript[item.type] = block => item.javascript(block);
                }
            }

            this.toolboxData = Blockly.Xml.textToDom(this.toolbox);
            const options = {
                toolbox: this.toolboxData,
                collapse: false,
                comments: true,
                disable: false,
                maxBlocks: Infinity,
                trashcan: true,
                horizontalLayout: false,
                toolboxPosition: 'start',
                css: true,
                media: 'media/',
                rtl: false,
                scrollbars: true,
                sounds: true,
                oneBasedIndex: true,
                grid: {
                    spacing: 20,
                    length: 1,
                    colour: '#888',
                    snap: true
                },
                zoom: {
                    controls: true,
                    wheel: false,
                    startScale: 1,
                    maxScale: 3,
                    minScale: 0.3,
                    scaleSpeed: 1.2
                }
            };

            this.workspace = Blockly.inject(container, options);
            this.workspace.addChangeListener(this._eventHandler.bind(this));
            Blockly.svgResize(this.workspace);
            setTimeout(() => {
                Blockly.svgResize(this.workspace);
            }, 1);

            // 高亮显示执行代码块与调试模式下减速执行
            Blockly.JavaScript.STATEMENT_PREFIX = 'top.window.highlightBlock(%1);\n';
            Blockly.JavaScript.STATEMENT_SUFFIX = 'await top.window.delay();\n';
            Blockly.JavaScript.addReservedWords('top.window.highlightBlock');
            Blockly.JavaScript.addReservedWords('top.window.delay');
            top.window.highlightBlock = id => {
                this.workspace.highlightBlock(id);
            };
            top.window.delay = async () => {
                if (this.experimentMode) {
                    await sleep(500);
                }
            };
        },
        startTour(id) {
            const tour = this.tours[id];
            typeof tour.initialize !== 'undefined' && tour.initialize();
            typeof tour.workspace !== 'undefined' && this._loadXml(tour.workspace);
            if (typeof tour.toolbox !== 'undefined') {
                this.toolboxData = Blockly.Xml.textToDom(tour.toolbox);
                this.workspace.updateToolbox(this.toolboxData);
            }

            for (const step of this.tours[id].steps) {
                if (typeof step.elementId !== 'undefined') {
                    step.element = document.querySelectorAll(step.elementId)[0];
                }
            }

            const options = {
                nextLabel: '<span style="font-size: 1.0rem">下一步</span>',
                prevLabel: '<span style="font-size: 1.0rem">上一步</span>',
                skipLabel: '<span style="font-size: 1.0rem">跳过</span>',
                doneLabel: '<span style="font-size: 1.0rem; color: blue">开始实验</span>',
                tooltipPosition: 'auto',
                tooltipClass: 'introjs-tooltip',
                exitOnEsc: false,
                exitOnOverlayClick: false
            };

            this.$intro()
                .setOptions(Object.assign(options, { steps: this.tours[id].steps }))
                .onexit(() => this._onTourComplete(id))
                .start();
        },
        startExperiment(experimentId, stepId = 0) {
            if (stepId >= this.experiments[experimentId].steps.length) {
                return false;
            }

            if (this.experiment !== null && experimentId === this.experiment.experiment && stepId === this.experiment.step) {
                return true;
            }

            const step = this.experiments[experimentId].steps[stepId];
            typeof step.initialize !== 'undefined' && step.initialize();
            typeof step.workspace !== 'undefined' && this._loadXml(step.workspace);
            if (typeof step.toolbox !== 'undefined') {
                this.toolboxData = Blockly.Xml.textToDom(step.toolbox);
                this.workspace.updateToolbox(this.toolboxData);
            }

            this._disableAllBlocks();
            this._enableBlocks(step.blocks);
            this._disableAllButtons();
            this._enableButtons(step.buttons);

            this.experimentMode = true;
            this.experiment = { experiment: experimentId, step: stepId, _step: step };
            this.eventHandler && this.eventHandler['onStartExperimentStep'] && this.eventHandler['onStartExperimentStep'](this.experiment);

            return true;
        },
        nextExperimentStep() {
            return this.startExperiment(this.experiment.experiment, this.experiment.step + 1);
        },
        getVariable(id) {
            return this.variables[id];
        },
        setVariable(id, value) {
            this.variables[id] = value;
            // eslint-disable-next-line no-undef
            cv.imshow(id, value);
        },
        _enableBlocks(blocks) {
            if (typeof blocks === 'undefined' || blocks === null) {
                return;
            }

            for (let i = 0; i < this.toolboxData.children.length; i++) {
                if (blocks.indexOf(this.toolboxData.children[i].getAttribute('id')) >= 0) {
                    this.toolboxData.children[i].setAttribute('disabled', false);
                    continue;
                }

                const category = this.toolboxData.children[i];
                for (let j = 0; j < category.children.length; j++) {
                    if (blocks.indexOf(category.children[j].getAttribute('id')) >= 0) {
                        category.children[j].setAttribute('disabled', false);
                    }
                }
            }
            this.workspace.updateToolbox(this.toolboxData);
            console.debug(this.toolboxData);
        },
        _disableAllBlocks() {
            for (let i = 0; i < this.toolboxData.children.length; i++) {
                this.toolboxData.children[i].setAttribute('disabled', true);
                const category = this.toolboxData.children[i];
                for (let j = 0; j < category.children.length; j++) {
                    category.children[j].setAttribute('disabled', true);
                }
            }
            this.workspace.updateToolbox(this.toolboxData);
            console.debug(this.toolboxData);
        },
        _enableButtons(buttons) {
            if (typeof buttons === 'undefined' || buttons === null) {
                return;
            }

            for (const button of buttons) {
                this.buttons[button] = false;
            }
        },
        _disableAllButtons() {
            for (const button in this.buttons) {
                this.buttons[button] = true;
            }
        },
        _clearVariables() {
            this.variables = {};
            for (const variable of this.inspectorVariables) {
                if (variable.id !== null) {
                    const canvas = this.$refs[variable.id][0];
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        },
        _generateXml() {
            const xml = Blockly.Xml.workspaceToDom(this.workspace);
            console.debug(xml);
            return xml;
        },
        _compareXml(xml) {
            if (typeof xml !== 'string' || xml === null) {
                return false;
            }

            const reg = xml
                .replace(/\//g, '\\/')
                .replace(/id="([^"]*)"/g, 'id="([^\\"]*)"')
                .replace(/x="([^"]*)"/g, 'x="([^\\"]*)"')
                .replace(/y="([^"]*)"/g, 'y="([^\\"]*)"');
            const src = this._generateXml().outerHTML;
            const pos = src.search(new RegExp(reg));
            console.debug(pos);
            return pos === 0;
        },
        _loadXml(xml) {
            const dom = typeof xml === 'string' ? Blockly.Xml.textToDom(xml) : xml;
            Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, this.workspace);
        },
        _generateCode() {
            const code = Blockly.JavaScript.workspaceToCode(this.workspace);
            console.debug(code);
            return code;
        },
        async _runCode() {
            try {
                this.buttons.run_button = true;
                this._clearVariables();
                this.$message.success(`开始运行`, 2);

                await eval(`(async () => { ${this._generateCode()} })()`);
                if (this.experimentMode && this.experiment !== null) {
                    if (this.experiment._step.expect && (await this.experiment._step.expect())) {
                        this._onExperimentStepComplete(this.experiment);
                    }
                }

                this.$message.success(`运行结束`, 2);
            } catch (e) {
                console.debug(e);
                this.$message.fail(`运行失败: ${e}`, 2);
            } finally {
                this.buttons.run_button = false;
            }
        },
        _eventHandler(event) {
            console.debug(event);
            if (this.experimentMode && this.experiment !== null) {
                if (event.element === 'field' || event.element === 'dragStop') {
                    if (this._compareXml(this.experiment._step.expect)) {
                        this._onExperimentStepComplete(this.experiment);
                    }
                }
            }
        },
        _onTourComplete(id) {
            console.debug(`tour complete: ${id}`);
            this.eventHandler && this.eventHandler['onTourComplete'] && this.eventHandler['onTourComplete'](id);
        },
        _onExperimentStepComplete(experiment) {
            console.debug(`experiment step complete: ${experiment.experiment}, ${experiment.step}`);
            this.eventHandler && this.eventHandler['onExperimentStepComplete'] && this.eventHandler['onExperimentStepComplete'](experiment);
            if (!this.nextExperimentStep()) {
                this._onExperimentComplete(experiment);
                this.eventHandler && this.eventHandler['onExperimentComplete'] && this.eventHandler['onExperimentComplete'](experiment);
            }
        },
        _onExperimentComplete(experiment) {
            console.debug(`experiment complete: ${experiment.experiment}`);
            this.experimentMode = false;
        },
        _onImageInspectorClick(event) {
            this.imageInspectorTitle = event.target.getAttribute('data-name');
            this.imageInspectorData = event.target.toDataURL('image/png');
            this.imageInspectorVisiable = true;
        }
    }
};
</script>

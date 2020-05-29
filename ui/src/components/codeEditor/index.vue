<template>
    <a-layout>
        <a-row type="flex">
            代码编辑器
            <a-button type="primary" icon="right-square" style="margin-left: 16px" v-bind:disabled="buttons.run_button" @click="_runCode()">运行</a-button>
            <button @click="startTour(0)">start</button>
            <button @click="_generateXml()">dump</button>
            <button @click="_generateCode()">generate</button>
            <button @click="_test()">test</button>
        </a-row>
        <a-row type="flex" style="flex-grow: 1">
            <div id="editor" style="width: 100%; height: 100%" />
        </a-row>
        <a-row type="flex" align="bottom" style="height: 20px">
            <a-col :span="4" class="inspector_variable_name">{{ variables[0].name }}</a-col>
            <a-col :span="4" class="inspector_variable_name">{{ variables[1].name }}</a-col>
            <a-col :span="4" class="inspector_variable_name">{{ variables[2].name }}</a-col>
            <a-col :span="4" class="inspector_variable_name">{{ variables[3].name }}</a-col>
            <a-col :span="4" class="inspector_variable_name">{{ variables[4].name }}</a-col>
            <a-col :span="4" class="inspector_variable_name">{{ variables[5].name }}</a-col>
        </a-row>
        <a-row type="flex" align="bottom" style="height: 200px">
            <a-col :span="4" class="inspector_variable_data">
                <canvas :id="variables[0].id" />
            </a-col>
            <a-col :span="4" class="inspector_variable_data">
                <canvas :id="variables[1].id" />
            </a-col>
            <a-col :span="4" class="inspector_variable_data">
                <canvas :id="variables[2].id" />
            </a-col>
            <a-col :span="4" class="inspector_variable_data">
                <canvas :id="variables[3].id" />
            </a-col>
            <a-col :span="4" class="inspector_variable_data">
                <canvas :id="variables[4].id" />
            </a-col>
            <a-col :span="4" class="inspector_variable_data">
                <canvas :id="variables[5].id" />
            </a-col>
        </a-row>
    </a-layout>
</template>

<style scoped>
.inspector_variable_name {
    text-align: middle;
}

.inspector_variable_data {
    height: 100%;
    text-align: left;
}
</style>

<script>
import Blockly from 'blockly';
import 'blockly/blocks';
import 'blockly/javascript';
import * as Zh from 'blockly/msg/zh-hans';

export default {
    name: 'CodeEditor',
    props: {
        blocks: Array,
        toolbox: Element,
        tours: Array,
        experiments: Array,
        variables: Array,
        eventHandler: Object,
        onTourComplete: Function,
        onExperimentComplete: Function
    },
    data: function() {
        return {
            workspace: null,
            experimentMode: false,
            experiment: null,
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

            const options = {
                toolbox: this.toolbox,
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
                    wheel: true,
                    startScale: 1,
                    maxScale: 3,
                    minScale: 0.3,
                    scaleSpeed: 1.2
                }
            };

            this.workspace = Blockly.inject(container, options);
            this.workspace.addChangeListener(this._eventHandler.bind(this));
            setTimeout(() => {
                Blockly.svgResize(this.workspace);
            }, 1);
        },
        startTour(id) {
            for (const step of this.tours[id]) {
                if (typeof step.elementId !== 'undefined') {
                    step.element = document.querySelectorAll(step.elementId)[0];
                }
            }

            const options = {
                nextLabel: '下一步',
                prevLabel: '上一步',
                skipLabel: '跳过',
                doneLabel: '开始实验',
                tooltipPosition: 'auto',
                exitOnEsc: false,
                exitOnOverlayClick: false
            };

            this.$intro()
                .setOptions(Object.assign(options, { steps: this.tours[id] }))
                .onexit(() => this._onTourComplete(id))
                .start();
        },
        startExperiment(experimentId, stepId = 0) {
            if (stepId >= this.experiments[experimentId].steps.length) {
                return false;
            }

            const step = this.experiments[experimentId].steps[stepId];
            this._disableAllBlocks();
            this._enableBlocks(step.blocks);
            this._disableAllButtons();
            this._enableButtons(step.buttons);
            step.workspace && this._loadXml(step.workspace);
            this.experimentMode = true;
            this.experiment = { experiment: experimentId, step: stepId, _step: step };
            this.eventHandler && this.eventHandler['startExperiment'] && this.eventHandler['startExperiment'](this.experiment);

            return true;
        },
        nextexperiment() {
            return this.startExperiment(this.experiment.experiment, ++this.experiment.step);
        },
        _enableBlocks(blocks) {
            if (typeof blocks === 'undefined' || blocks === null) {
                return;
            }

            for (let i = 0; i < this.toolbox.children.length; i++) {
                if (blocks.indexOf(this.toolbox.children[i].getAttribute('type')) >= 0) {
                    this.toolbox.children[i].setAttribute('disabled', false);
                    continue;
                }

                const category = this.toolbox.children[i];
                for (let j = 0; j < category.children.length; j++) {
                    if (blocks.indexOf(category.children[j].getAttribute('type')) >= 0) {
                        category.children[j].setAttribute('disabled', false);
                    }
                }
            }
            this.workspace.updateToolbox(this.toolbox);
            console.debug(this.toolbox);
        },
        _disableAllBlocks() {
            for (let i = 0; i < this.toolbox.children.length; i++) {
                this.toolbox.children[i].setAttribute('disabled', true);
                const category = this.toolbox.children[i];
                for (let j = 0; j < category.children.length; j++) {
                    category.children[j].setAttribute('disabled', true);
                }
            }
            this.workspace.updateToolbox(this.toolbox);
            console.debug(this.toolbox);
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
        _generateXml() {
            const xml = Blockly.Xml.workspaceToDom(this.workspace);
            console.debug(xml);
            return xml;
        },
        _compareXml(xml) {
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
        _runCode() {
            try {
                eval(this._generateCode());
                if (this.experimentMode && this.experiment !== null) {
                    if (this.experiment._step.expect && this.experiment._step.expect()) {
                        this._onExperimentStepComplete(this.experiment);
                    }
                }
            } catch (e) {
                console.debug(e);
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
            this.onTourComplete && this.onTourComplete(id);
        },
        _onExperimentStepComplete(experiment) {
            console.debug(`experiment step complete: ${experiment.experiment}, ${experiment.step}`);
            this.eventHandler && this.eventHandler['experimentStepComplete'] && this.eventHandler['experimentStepComplete'](experiment);
            if (!this.nextexperiment()) {
                this.eventHandler && this.eventHandler['experimentComplete'] && this.eventHandler['experimentComplete'](experiment);
                this._onExperimentComplete(experiment);
            }
        },
        _onExperimentComplete(experiment) {
            console.debug(`experiment complete: ${experiment.experiment}`);
            this.experimentMode = false;
            this.onExperimentComplete && this.onExperimentComplete(experiment.experiment);
        },
        _test() {
            top.window.showImage();
        }
    }
};
</script>

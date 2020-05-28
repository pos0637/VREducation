<template>
    <a-layout>
        <a-row type="flex">代码编辑器</a-row>
        <a-row type="flex" style="flex-grow: 1">
            <div id="editor" style="width: 100%; height: 100%" />
        </a-row>
        <a-row type="flex" align="bottom" style="height: 200px">
            <div id="inspector">inspector</div>
            <button @click="startTour(0)">start</button>
            <button @click="_generateCode()">generate</button>
        </a-row>
    </a-layout>
</template>

<script>
import Blockly from 'blockly';
import 'blockly/blocks';
import 'blockly/javascript';
import * as Zh from 'blockly/msg/zh-hans';

export default {
    name: 'CodeEditor',
    props: {
        blocks: Array,
        toolbox: String,
        tours: Array,
        experiments: Array
    },
    data: function() {
        return {
            container: null,
            workspace: null,
            eventHandler: null,
            experimentMode: false,
            experimentStep: null
        };
    },
    mounted: function() {
        this.initialize(document.getElementById('editor'), {
            startStage: function() {
                alert('stage start');
            },
            stopStage: function() {
                alert('stage over');
            },
            startStep: function() {
                alert('step start');
            }
        });
    },
    methods: {
        initialize(container, eventHandler) {
            Blockly.setLocale(Zh);
            Blockly.defineBlocksWithJsonArray(this.blocks);

            for (const item of this.blocks) {
                if (typeof item.javascript !== 'undefined') {
                    Blockly.JavaScript[item.type] = block => item.javascript(block);
                }
            }

            this.container = container;
            this.eventHandler = eventHandler;

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
                tooltipPosition: 'auto'
            };

            this.$intro()
                .setOptions(Object.assign(options, { steps: this.tours[id] }))
                .onexit(() => this._onTourComplete(id))
                .start();
        },
        startExperiment(id) {
            const step = this.experiments[id];
            this._disableAllBlocks();
            this._enableBlocks(step.blocks);
            this._loadXml(step.workspace);
            this.eventHandler && this.eventHandler['startStep'] && this.eventHandler['startStep'](step);
        },
        _enableBlocks(blocks) {
            for (let i = 0; i < this.toolbox.children.length; i++) {
                const category = this.toolbox.children[i];
                for (let j = 0; j < category.children.length; j++) {
                    if (blocks.indexOf(category.children[j].getAttribute('type')) >= 0) {
                        category.children[j].setAttribute('disabled', false);
                    }
                }
            }
            this.workspace.updateToolbox(this.toolbox);
            console.log(this.toolbox);
        },
        _disableAllBlocks() {
            for (let i = 0; i < this.toolbox.children.length; i++) {
                const category = this.toolbox.children[i];
                for (let j = 0; j < category.children.length; j++) {
                    category.children[j].setAttribute('disabled', true);
                }
            }
            this.workspace.updateToolbox(this.toolbox);
            console.log(this.toolbox);
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
            } catch (e) {
                console.debug(e);
            }
        },
        _eventHandler(event) {
            console.log(event);
            if (this.experimentMode && this.experimentStep !== null) {
                if (event.element === 'dragStop') {
                    if (this._compareXml(this.experimentStep._step.expect)) {
                        this.eventHandler && this.eventHandler['stopStep'] && this.eventHandler['stopStep'](this.experimentStep);
                    }
                }
            }
        },
        _onTourComplete(id) {
            console.debug(`tour complete: ${id}`);
        }
    }
};
</script>

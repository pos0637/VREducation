<template>
    <a-layout>
        <a-row type="flex">代码编辑器</a-row>
        <a-row type="flex" style="flex-grow: 1">
            <div id="editor" style="width: 100%; height: 100%" />
        </a-row>
        <a-row type="flex" align="bottom" style="height: 200px">
            <div id="inspector">inspector</div>
            <button @click="initializeTours()">start</button>
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
        tours: Array
    },
    data: function() {
        return {
            workspace: null,
            eventHandler: null,
            storybook: {},
            storybookMode: false,
            storybookStep: null
        };
    },
    mounted: function() {
        this.initialize('editor', 'toolbox', {
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
        initialize(container, toolbox, eventHandler) {
            Blockly.setLocale(Zh);
            Blockly.defineBlocksWithJsonArray(this.blocks);

            for (const item of this.blocks) {
                if (typeof item.javascript !== 'undefined') {
                    Blockly.JavaScript[item.type] = block => item.javascript(block);
                }
            }

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
        },
        initializeTours() {
            this.$intro()
                .setOptions(this.tours[0])
                .start();
        },
        _enableBlocks(blocks) {
            for (var i = 0; i < this.toolbox.children.length; i++) {
                var category = this.toolbox.children[i];
                for (var j = 0; j < category.children.length; j++) {
                    if (blocks.indexOf(category.children[j].getAttribute('type')) >= 0) {
                        category.children[j].setAttribute('disabled', false);
                    }
                }
            }
            this.workspace.updateToolbox(this.toolbox);
            console.log(this.toolbox);
        },
        _disableAllBlocks() {
            for (var i = 0; i < this.toolbox.children.length; i++) {
                var category = this.toolbox.children[i];
                for (var j = 0; j < category.children.length; j++) {
                    category.children[j].setAttribute('disabled', true);
                }
            }
            this.workspace.updateToolbox(this.toolbox);
            console.log(this.toolbox);
        },
        _generateXml() {
            var xml = Blockly.Xml.workspaceToDom(this.workspace);
            console.debug(xml);
            return xml;
        },
        _compareXml(xml) {
            var reg = xml
                .replace(/\//g, '\\/')
                .replace(/id="([^"]*)"/g, 'id="([^\\"]*)"')
                .replace(/x="([^"]*)"/g, 'x="([^\\"]*)"')
                .replace(/y="([^"]*)"/g, 'y="([^\\"]*)"');
            var src = this._generateXml().outerHTML;
            var pos = src.search(new RegExp(reg));
            console.debug(pos);
            return pos === 0;
        },
        _loadXml(xml) {
            var dom = typeof xml === 'string' ? Blockly.Xml.textToDom(xml) : xml;
            Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, this.workspace);
        },
        _generateCode() {
            var code = Blockly.JavaScript.workspaceToCode(this.workspace);
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
            if (this.storybookMode && this.storybookStep !== null) {
                if (event.element === 'dragStop') {
                    if (this._compareXml(this.storybookStep._step.expect)) {
                        this.eventHandler && this.eventHandler['stopStep'] && this.eventHandler['stopStep'](this.storybookStep);
                    }
                }
            }
        }
    }
};
</script>

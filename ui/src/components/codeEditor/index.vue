<template>
    <a-layout>
        <a-row type="flex" style="padding-top: 8px;">
            <div style="flex-grow: 1; margin: 0px 8px 8px 8px;">
                <div class="hint-background">{{ this.hint }}</div>
            </div>
            <a-button
                data-id="run_button"
                type="primary"
                icon="right-square"
                style="margin: 0px 8px 0px 8px;"
                v-bind:disabled="buttons.run_button"
                :loading="runFlag"
                @click="_runCode()"
                >运行</a-button
            >
            <button @click="_generateXml()" style="display: none">dump</button>
            <button @click="_generateCode()" style="display: none">generate</button>
            <button @click="_runCode()" style="display: none">run</button>
        </a-row>
        <a-row type="flex" style="flex-grow: 1">
            <div id="editor" style="width: 100%; height: 100%" />
        </a-row>
        <a-row type="flex" align="bottom" style="height: 20px; margin-top: 8px;">
            <a-col v-for="item in inspectorVariables" :key="item.id" :span="24 / inspectorVariables.length" class="inspector_variable_name">
                <div class="title-background">{{ item.name }}</div>
            </a-col>
        </a-row>
        <a-row type="flex" align="bottom" style="height: 120px">
            <a-col v-for="(item, index) in inspectorVariables" :key="item.id" :span="24 / inspectorVariables.length" class="inspector_variable_data">
                <canvas
                    v-if="item.id !== null"
                    :ref="inspectorVariables[index].id"
                    :id="inspectorVariables[index].id"
                    :data-id="inspectorVariables[index].id"
                    :data-name="item.name"
                    class="inspector_variable_image"
                    @click="_onImageInspectorClick(index)"
                />
            </a-col>
        </a-row>
        <a-modal v-model="imageInspectorVisiable" :title="imageInspectorTitle" :width="'60%'">
            <template slot="footer">
                <span />
            </template>
            <img :src="this.imageInspectorData" class="image_inspector" />
        </a-modal>
        <a-modal v-model="testFlag" :title="'图片展示'" :width="'60%'">
            <swiper :options="swiperOption" ref="mySwiper">
                <!-- 轮播内容 -->
                <swiper-slide class="swiper-slide" v-for="imageObject in base64Images" :key="imageObject.id" style="text-align:center;">
                    <div style="font-size: 25px; font-weight:600;">{{ imageObject.title }}</div>
                    <img :src="imageObject.url" />
                </swiper-slide>
                <!-- 轮播组件 -->
                <div class="swiper-button-prev" slot="button-prev" @click="_prev"></div>
                <div class="swiper-button-next" slot="button-next" @click="_next"></div>
                <div class="swiper-pagination" slot="pagination"></div>
                <!-- 轮播组件 end -->
                <!-- 轮播内容 end -->
            </swiper>
            <template slot="footer">
                <a-button key="submit" type="primary" @click="_handleOk">确认</a-button>
            </template>
        </a-modal>
    </a-layout>
</template>

<style>
.introjs-tooltip {
    max-width: unset !important;
}
.ant-modal {
    top: 5%;
}
</style>

<style scoped>
.hint-background {
    width: 100%;
    height: 100%;
    line-height: 32px;
    text-align: center;
    border: 0px;
    border-radius: 25px;
    box-shadow: 1px 1px 1px 1px rgb(170, 170, 170) inset;
    color: white;
    background-color: rgb(255, 204, 0);
}

.title-background {
    width: 100px;
    height: 100%;
    text-align: center;
    margin-left: 16px;
    border: 0px;
    border-radius: 25px;
    color: white;
    background-color: rgb(255, 204, 0);
}

.inspector_variable_name {
    text-align: middle;
}

.inspector_variable_data {
    height: 100%;
    text-align: left;
}

.inspector_variable_image {
    width: 120px;
    height: 120px;
    margin: 0 10px;
    padding: 8px;
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
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

export default {
    name: 'CodeEditor',
    components: { Swiper, SwiperSlide },
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
            // 选中的块
            selectedBlock: null,
            variables: {},
            imageInspectorVisiable: false,
            imageInspectorTitle: null,
            imageInspectorData: null,
            buttons: {
                run_button: false
            },
            hint: '代码编辑器',
            runFlag: false,
            base64Images: [],
            testFlag: false,
            // 轮播参数
            swiperOption: {
                // 开启循环模式
                // loop: true,
                // 显示分页
                pagination: {
                    el: '.swiper-pagination',
                    type: 'bullets',
                    clickable: true,
                    hideOnClick: false
                },
                effect: 'slide',
                // 设置点击箭头
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                direction: 'horizontal',
                grabCursor: true,
                roundLengths: true
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
            this.hint = `当前实验 ${this.experiments[experimentId].name} 步骤: ${this.experiments[experimentId].steps[stepId].intro}`;

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
        updateToolbox() {
            this.workspace.updateToolbox(this.toolboxData);
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
                .replace(/y="([^"]*)"/g, 'y="([^\\"]*)"')
                .replace(/"x":([^"]*),/g, '"x":([^\\"]*),')
                .replace(/"y":([^"]*),/g, '"y":([^\\"]*),')
                .replace(/"z":([^"]*),/g, '"z":([^\\"]*),')
                .replace(/"z":([^"]*)}/g, '"z":([^\\"]*)}')
                .replace(/"w":([^"]*)}/g, '"w":([^\\"]*)}');
            const src = this._generateXml().outerHTML;
            const pos = src.search(new RegExp(reg));
            console.debug(pos);
            return pos === 0;
        },
        _loadXml(xml) {
            // TODO
            const dom = typeof xml === 'string' ? Blockly.Xml.textToDom(xml) : xml;
            Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, this.workspace);
        },
        _generateCode() {
            const code = Blockly.JavaScript.workspaceToCode(this.workspace);
            console.debug('_generateCode:', code);
            return code;
        },
        async _runCode() {
            try {
                this.buttons.run_button = true;
                this.runFlag = true;
                this._clearVariables();
                this.$message.success(`开始运行`, 2);
                this.eventHandler && this.eventHandler['onRunCode'] && (await this.eventHandler['onRunCode']());

                await eval(`(async () => { ${this._generateCode()} })()`);
                if (this.experimentMode && this.experiment !== null) {
                    if (this.experiment._step.expect && typeof this.experiment._step.expect === 'function' && (await this.experiment._step.expect())) {
                        this._onExperimentStepComplete(this.experiment);
                    }
                }

                this.$message.success(`运行结束`, 2);
                top.window.onOver && top.window.onOver();
                this._getImages();
                this.swiperOption.initialSlide = this.base64Images.length - 1;
                this.testFlag = true;
                if (typeof this.$refs.mySwiper !== 'undefined') {
                    this.$refs.mySwiper.$swiper.slideTo(this.base64Images.length - 1);
                }
            } catch (e) {
                this.$message.error(`运行失败: ${e}`, 2);
            } finally {
                this.buttons.run_button = false;
                this.runFlag = false;
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
            // 点击或者选中时，将选中的对象赋值
            if (event.element === 'click' || event.element === 'selected') {
                let source = this._generateXml();
                this.selectedBlock = source.querySelector(`block[id='${event.blockId}']`);
            }
        },
        setBlockFieldText(blockId, fieldName, value) {
            let beforeXml = this._generateXml();
            let block = beforeXml.querySelector(`block[id='${blockId}']`);
            let field = block.querySelector(`field[name='${fieldName}']`);
            field.textContent = value;
            console.debug('after block:', block, beforeXml);
            Blockly.Xml.clearWorkspaceAndLoadFromXml(beforeXml, this.workspace);
        },
        updateWorkspace(sourceXml) {
            Blockly.Xml.clearWorkspaceAndLoadFromXml(sourceXml, this.workspace);
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
        _onImageInspectorClick(index) {
            this._getImages();
            if (index < this.base64Images.length) {
                this.swiperOption.initialSlide = index;
                this.testFlag = true;
                this.$refs.mySwiper.$swiper.slideTo(index);
            }
            // let event = window.event || arguments.callee.caller.arguments[0];
            // let target = event.srcElement || event.target;
            // this.imageInspectorTitle = target.getAttribute('data-name');
            // this.imageInspectorData = target.toDataURL('image/png');
            // this.imageInspectorVisiable = true;
        },
        _getImages() {
            this.base64Images = [];
            for (let index = 0; index < this.inspectorVariables.length; index++) {
                if (this.inspectorVariables[index].id !== null) {
                    const outputCanvas = document.getElementById(this.inspectorVariables[index].id);
                    let base64 = outputCanvas.toDataURL('image/jpeg');
                    if (
                        base64 !=
                        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCACWASwDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k='
                    ) {
                        this.base64Images[index] = {
                            id: this.inspectorVariables[index].id,
                            title: this.inspectorVariables[index].name,
                            url: base64
                        };
                    }
                }
            }
        },
        _prev() {
            this.$refs.mySwiper.$swiper.slidePrev();
        },
        _next() {
            this.$refs.mySwiper.$swiper.slideNext();
        },
        _handleOk() {
            this.testFlag = false;
        }
    }
};
</script>

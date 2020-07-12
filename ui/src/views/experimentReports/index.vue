<template>
    <div style="width:100%; height:100%; background:white; padding-top:20px;">
        <a-form layout="inline" @keyup.enter.native="_searchQuery">
            <a-row :gutter="24">
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                    <a-form-item label="实验名称">
                        <a-input placeholder="请输入实验名称" v-model="queryParam.name"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                    <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                        <a-button type="primary" @click="_searchQuery" icon="search">查询</a-button>
                        <a-button type="primary" @click="_searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                    </span>
                </a-col>
            </a-row>
        </a-form>
        <a-table :columns="columns" :row-key="record => record.id" :data-source="reports" :pagination="pagination" :loading="loading" @change="_onTableChanged">
            <template slot="action" slot-scope="report"><a-button @click="_checkResult(report)"> 查看 </a-button></template>
        </a-table>
        <a-modal
            ref="examReport"
            v-if="visible"
            v-model="visible"
            :title="'实验报告'"
            on-ok="_handleOk"
            :maskClosable="false"
            :mask="true"
            centered
            :width="'80%'"
        >
            <ExamReport :info="stepEntity" />
            <template slot="footer">
                <a-button key="back" @click="_handleCancel">取消</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import { getUserInfo } from '@/miscs/auth';
import ExamReport from '@/scenes/ExamReport';
import request from '@/miscs/request';
import { filterObj } from '@/miscs/helper';

const columns = [
    {
        title: '#',
        key: 'rowIndex',
        width: 60,
        align: 'center',
        customRender: function(t, r, index) {
            return parseInt(index) + 1;
        }
    },
    {
        title: '实验名称',
        align: 'center',
        dataIndex: 'name'
    },
    {
        title: '得分',
        align: 'center',
        dataIndex: 'score'
    },
    {
        title: '完成时间',
        align: 'center',
        dataIndex: 'finishTime',
        customRender: function(text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
        }
    },
    {
        title: '操作',
        align: 'center',
        scopedSlots: { customRender: 'action' }
    }
];

export default {
    name: 'ChengyiExperimentExamReportList',
    components: { ExamReport },
    data() {
        return {
            description: '诚毅学院实验考试报告管理页面',
            // 表头
            columns,
            url: {
                list: '/com.soft.gh/chengyiExperimentExamReport/list',
                delete: '/com.soft.gh/chengyiExperimentExamReport/delete',
                deleteBatch: '/com.soft.gh/chengyiExperimentExamReport/deleteBatch',
                exportXlsUrl: '/com.soft.gh/chengyiExperimentExamReport/exportXls'
            },
            stepEntity: {},
            visible: false,
            reports: [],
            queryParam: {},
            pagination: {},
            loading: false
        };
    },
    mounted() {
        this._initDictConfig();
        this._fetch(
            filterObj({
                ...this.queryParam
            })
        );
    },
    methods: {
        _onTableChanged(pagination, filters, sorter) {
            const pager = { ...this.pagination };
            pager.current = pagination.current;
            pager.pageSize = pagination.pageSize;
            this.pagination = pager;
            this._fetch(
                filterObj({
                    field: this._getQueryField(),
                    pageSize: pagination.pageSize,
                    pageNo: pagination.current,
                    column: sorter.field,
                    order: 'ascend' == sorter.order ? 'asc' : 'desc',
                    ...filters,
                    ...this.queryParam
                })
            );
        },
        _getQueryField() {
            let str = 'id,';
            this.columns.forEach(function(value) {
                str += ',' + value.dataIndex;
            });
            return str;
        },
        _fetch(params = {}) {
            this.loading = true;
            request({
                url: this.url.list,
                method: 'get',
                params: {
                    ...params
                }
            }).then(data => {
                const pagination = { ...this.pagination };
                pagination.total = data.result.total;
                this.loading = false;
                this.reports = data.result.records;
                this.pagination = pagination;
            });
        },
        _initDictConfig() {
            this.userInfo = getUserInfo();
            if (this.userInfo.username === 'admin') {
                this.queryParam.userId = null;
                this._searchQuery();
            } else {
                this.queryParam.userId = this.userInfo.id;
                this._searchQuery();
            }
        },
        // 查看报告
        _checkResult(val) {
            this.visible = true;
            this.stepEntity = JSON.parse(val.answers);
            this.stepEntity.checkFlag = true;
        },
        _handleCancel() {
            this.visible = false;
        },
        _searchQuery() {
            this._fetch(
                filterObj({
                    field: this._getQueryField(),
                    ...this.queryParam
                })
            );
        },
        _searchReset() {
            this.queryParam = {};
            this.loadData(1);
        }
    }
};
</script>

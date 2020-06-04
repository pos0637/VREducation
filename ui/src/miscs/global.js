import Vue from 'vue';

const variables = {
    eventbus: new Vue()
};

/**
 * 获取变量
 *
 * @export
 * @param {*} name 变量名称
 * @returns 变量
 */
export function getVariable(name) {
    return variables[name];
}

/**
 * 设置变量
 *
 * @export
 * @param {*} name 变量名称
 * @param {*} value 变量
 */
export function setVariable(name, value) {
    variables[name] = value;
}

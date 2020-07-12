/**
 * 对象是否为空
 *
 * @param {any} object 对象
 * @returns 是否为空
 */
export function isEmpty(object) {
    return typeof object === 'undefined' || object === null || object === '' || object === 'undefined' || object === 'null';
}

/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
    if (!(typeof obj == 'object')) {
        return;
    }

    for (let key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key) && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
            delete obj[key];
        }
    }

    return obj;
}

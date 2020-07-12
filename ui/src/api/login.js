import request from '@/miscs/request';
import { setToken, setUserInfo } from '@/miscs/auth';
import store from '@/store';

/**
 * 设置公共参数
 *
 * @param {返回参数} response
 */
export function _setCommonParm(response) {
    setToken(response.result.token);
    setUserInfo(response.result.userInfo);
}

// 用户名登录
export function loginByUsername(userInfo) {
    const username = userInfo.username.trim();
    const password = userInfo.password;
    const captcha = userInfo.captcha;
    const checkKey = userInfo.checkKey;
    return new Promise((resolve, reject) => {
        request({
            url: '/sys/login',
            method: 'post',
            data: {
                username,
                password,
                captcha,
                checkKey
            }
        })
            .then(response => {
                store.commit('setToken', response.result.token);
                _setCommonParm(response);
                resolve();
            })
            .catch(error => {
                reject(error);
            });
    });
}

export function noAuthLogin() {
    return new Promise((resolve, reject) => {
        request({
            url: '/sys/login/noauth',
            method: 'post'
        })
            .then(response => {
                store.commit('setToken', response.result.token);
                _setCommonParm(response);
                resolve();
            })
            .catch(error => {
                reject(error);
            });
    });
}

// 登出
export function logout() {
    return new Promise((resolve, reject) => {
        request({
            url: '/sys/logout',
            method: 'GET'
        })
            .then(() => {
                store.commit('fedLogout');
                resolve();
            })
            .catch(error => {
                reject(error);
            });
    });
}

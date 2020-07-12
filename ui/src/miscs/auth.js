import Cookies from 'js-cookie';
import { isEmpty } from './helper';

const TokenKey = 'Admin-Token';

export function getToken() {
    return Cookies.get(TokenKey);
}

export function setToken(token) {
    return Cookies.set(TokenKey, token);
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}

export function setUserInfo(userInfo) {
    if (isEmpty(userInfo)) {
        return;
    }
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

export function getUserInfo() {
    let userInfo = localStorage.getItem('userInfo');
    return isEmpty(userInfo) ? {} : JSON.parse(userInfo);
}

export function clearUserInfo() {
    localStorage.clear();
}

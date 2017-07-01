/**
 * 在webpack中配置resolve.alias app，方便快速引用
 */
import deef from 'deef';
import createHashHistory from 'history/createHashHistory';
import _router from 'deef-router';

export const app = deef();
export const connect = app.connect;
export const history = createHashHistory();
export const router = _router({history});

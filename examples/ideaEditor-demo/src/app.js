/**
* 在webpack中配置resolve.alias app，方便快速引用
*/
import deef from 'deef';

export const app = deef();

// deef plugin
app._event.on('injectCallback', key => {
    if (process.env.NODE_ENV !== 'production' && !/^on[A-Z]/.test(key)) {
        console.error('[代码规范] connect中callbacks的命名必须是`onXXX`的形式，谁写了这个鬼：', key);
    }
});

export const connect = app.connect;

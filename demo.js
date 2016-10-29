import React from 'react';
import deef from './index';

const app = deef();


////////////////////////////////////
// Common Processors

const historyProcessors = {
    historyPush({dispatch}, payload) {
        dispatch({
            type: 'history/push',
            payload
        });
    }
};


////////////////////////////////////
// Count Module

const countModel = {
    namespace: 'count',
    state: {
        num: 0,
        encourage: false
    },
    reducers: {
        setNum(state, {payload}) {
            console.log('init', arguments[1]);
            const next = {...state};
            next.num = payload;
            return next;
        },
        add(state) {
            const next = {...state};
            next.num = next.num + 1;
            return next;
        },
        minus(state) {
            const next = {...state};
            next.num = next.num - 1;
            return next;
        },
        showEncourage(state) {
            console.log('showEncourage');
            const next = {...state};
            next.encourage = true;
            return next;
        },
        hideEncourage(state) {
            const next = {...state};
            next.encourage = false;
            return next;
        }
    }
};

const CountUI = ({processors, num, encourage}) => {
    const {add, minus, historyPush, test} = processors;

    return (
        <div>
            <h2>分数：{num}分</h2>
            <button onClick={add}>+</button>
            <button onClick={minus}>-</button>
            <button onClick={() => historyPush('/test')}>Go to the test page</button>
            <p>{encourage && <small>已获得3分，真棒，继续努力（奖励10分，只奖励首次~）！</small>}</p>
        </div>
    );
};

const countProcessors = {
    // handlers for component
    add({dispatch}) {
        dispatch({type: 'count/add'});
    },
    minus({dispatch}) {
        // 可以利用this在processors全局挂一些东西，注意这个this不是countProcessors，而是在connect时传入的processors
        if (!this._minused) {
            // 第一次点减号的时候，跳转到test
            this._minused = true;
            // 各种hash跳转 集成封装
            dispatch({type: 'history/push', payload: '/test'});
            return;
        }
        dispatch({type: 'count/minus'});
    },
    ...[
        // subscriptions 这些方法都是只运行一次
        function ({dispatch, on}) {
            // 指定初始值
            dispatch({type: 'count/setNum', payload: 10});
        },
        function ({dispatch, getState, on}) {
            // 显示鼓励的时候 再加10分
            let off = on('action', (action) => {
                if (action.type === 'count/showEncourage') {
                    off();
                    dispatch({type: 'count/setNum', payload: getState().count.num + 10});
                }
            });
        },
        function ({dispatch, getState, on}) {
            let previousValue = getState().count.num;
            let off = on('stateChange', () => {
                let currentCount = getState().count.num;
                // 比初始值加得超过3了，显示鼓励的提示
                if (currentCount - previousValue > 3) {
                    off();
                    dispatch({type: 'count/showEncourage'});
                }
            });

            // 从其他页面回来时隐藏鼓励提示
            on('action', ({type, payload}) => {
                if (type === 'app/changeComponent' && payload === 'Count') {
                    dispatch({type: 'count/hideEncourage'});
                }
            });
        }
    ]
};

const Count = app.connect(
    ({count}) => ({...count}),
    {
        // 组合processors是非常容易的
        ...countProcessors,
        ...historyProcessors
    },
    CountUI
);


////////////////////////////////////
// Test Module

const TestUI = ({processors}) =>
    <div>
        <p>第一次点减号的时候，会跳转到Test页面</p>
        <button onClick={() => processors.historyPush('/')}>Back to the count page</button>
    </div>;

const Test = app.connect(
    // mapStateToProps 和 processors都不是必须的，但是存在时，必须返回（是） plan object
    null,
    historyProcessors,
    TestUI
);


////////////////////////////////////
// App Module

const appModel = {
    namespace: 'app',
    state: {
        componentName: ''
    },
    reducers: {
        changeComponent(state, {payload: name}) {
            const next = {...state};
            next.componentName = name;
            return next;
        }
    }
};

const AppUI = ({componentName}) => {
    return <div>
        {componentName === 'Count' && <Count />}
        {componentName === 'Test' && <Test />}
    </div>;
};

const appProcessors = {
    ...[
        // 订阅pathname
        function ({dispatch, on}) {
            // 路由什么的，在订阅里监听history，然后dispatch
            on('history', location => {
                switch (location.pathname) {
                    case '/':
                        dispatch({type: 'app/changeComponent', payload: 'Count'});
                        break;
                    case '/test':
                        dispatch({type: 'app/changeComponent', payload: 'Test'});
                        break;
                }
            });
        }
    ]
};

const App = app.connect(
    ({app}) => {
        return app;
    },
    appProcessors,
    AppUI
);

app.model(appModel);
app.model(countModel);
app.start('#root', App);

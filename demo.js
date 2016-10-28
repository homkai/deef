import React from 'react';
import deef from './index';
import { Link } from './router';

const app = deef();

////////////////////////////////////
// Count Module

const CountModel = {
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
    const {add, minus, goTest} = processors;

    return (
        <div>
            <h2>分数：{num}分</h2>
            <button key="add" onClick={add}>+</button>
            <button key="minus" onClick={minus}>-</button>
            <Link to="/test">Go to the test page</Link>
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
        if (!this._minused) {
            this._minused = true;
            // 各种hash跳转 集成封装
            dispatch({type: 'routing/push', payload: '/test'});
            return;
        }
        dispatch({type: 'count/minus'});
    },
    ...[
        // subscriptions
        function ({dispatch, getState, on}) {
            // 是否玩过这个游戏
            let off = on('action', (action) => {
                if (['count/add', 'count/minus'].indexOf(action.type) > -1) {
                    off();
                    this._played = true;
                }
            });
        },
        function ({dispatch, history}) {
            // 指定初始值
            history.listen(location => {
                if (location.pathname === '/') {
                    if (!this._played) {
                        dispatch({type: 'count/setNum', payload: 10});
                    }
                    else {
                        dispatch({type: 'count/hideEncourage'});
                    }
                }
            });
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
        }
    ]
};

const Count = app.connect(
    ({ count }) => {
        return {
            ...count
        };
    },
    countProcessors,
    CountUI
);

////////////////////////////////////
// Test Module

const Test = () =>
    <Link to="/">Back to the count page</Link>;


////////////////////////////////////
// App Module

const AppModel = {
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
        function ({dispatch, history}) {
            history.listen(location => {
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
    ({app}) => ({...app}),
    appProcessors,
    AppUI
);

app.model(AppModel);
app.model(CountModel);
app.start('#root', App);

import React from 'react';
import deef from 'deef';
import createHashHistory from  'history/createHashHistory';

const app = deef();
const history = createHashHistory();

////////////////////////////////////
// Count Module

const countModel = {
    namespace: 'count',
    state: {
        num: 0,
        encourage: {
            noUse: 'test analyze dep state',
            show: false
        }
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
            next.encourage = {
                ...next.encourage,
                show: true
            };
            return next;
        },
        hideEncourage(state) {
            const next = {...state};
            next.encourage = {
                ...next.encourage,
                show: false
            };
            return next;
        }
    }
};

const CountUI = ({onAdd, onMinus, num, encourage}) => {

    return (
        <div>
            <h2>分数：{num}分</h2>
            <button onClick={onAdd}>+</button>
            <button onClick={onMinus}>-</button>
            <a href="#/test">Go to the test page</a>
            <p>{encourage && <small>已获得3分，真棒，继续努力（奖励10分，只奖励首次~）！</small>}</p>
        </div>
    );
};

const countProcessor = {
    // handlers for component
    onAdd({dispatch}) {
        dispatch({type: 'count/add'});
    },
    onMinus({dispatch}) {
        dispatch({type: 'count/minus'});
    },
    subscriptions: {
        // subscriptions 这些方法都是只运行一次
        init({dispatch, on}) {
            // 指定初始值
            dispatch({type: 'count/setNum', payload: 10});
        },
        encourage({dispatch, getState, on}) {
            let previousValue = getState().count.num;
            let off = on('stateChange', () => {
                let currentCount = getState().count.num;
                // 比初始值加得超过3了，显示鼓励的提示
                if (currentCount - previousValue > 3) {
                    off();
                    dispatch({type: 'count/showEncourage'});
                    // 显示鼓励的时候 再加10分
                    dispatch({type: 'count/setNum', payload: getState().count.num + 10});
                }
            });

            // 从其他页面回来时隐藏鼓励提示
            on('action', ({type, payload}) => {
                if (type === 'app/changeComponent' && payload === 'Count') {
                    dispatch({type: 'count/hideEncourage'});
                }
            });
        }
    }
};

const Count = app.connect(
    ({count, app}) => ({num: count.num, encourage: count.encourage.show}),
    countProcessor
)(CountUI);


////////////////////////////////////
// Test Module

const Test = () =>
    <div>
        <a href="#/">Back to the count page</a>
    </div>;


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

// 路由表 是 rule到action的map，比react-router更灵活
const config = {
    LOCATIONS: {
        '/': {type: 'app/changeComponent', payload: 'Count'},
        '/test': {type: 'app/changeComponent', payload: 'Test'}
    }
};

const appProcessor = {
    subscriptions: {
        // 订阅pathname
        route({dispatch}) {
            // 路由什么的，在订阅里监听history，然后dispatch
            const route = location => {
                const action = config.LOCATIONS[location.pathname];
                action && dispatch(action);
            };
            history.listen(route);
            route(history.location);
        }
    }
};

const App = app.connect(
    ({app, count}) => {
        return {...app};
    },
    appProcessor
)(AppUI);

app.model(appModel);
app.model(countModel);
app.start('#root', App);

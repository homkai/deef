# deef
一个react、redux的简单、纯粹、健壮的框架

代码分为Model、Component、Processors

Model -> Component -> Processors -> Model -> ...

**状态（Model）决定展现（Component），交互就是改状态（Processors）**

编码思路很清晰，状态数据放在model，组件是props的纯函数，
交互处理就是改状态，改状态只能通过dispatch action这个唯一的入口，
然后由model中的reducers处理，reducers是action和state的纯函数
（No side effects. No API calls. No mutations.），
用redux的话说叫状态（state）是可预测的（predictable ）。
再关键的一点，dispatch一般只写在processors中。

这使得代码测试、调试起来很容易：
我们的model和component逻辑很简单，不容易会出错，所以更多只需要关心processors中是否正确地响应了某一交互动作，并dispatch了某个action就行

## Demo

API很少，几乎所有的API都用在demo里了

```bash
$ npm install
$ npm start
```
http://location:8881

参见demo.js

## Usage
```js
    import deef from 'deef';
    
    // 1. Create app
    const app = deef();
    
    // 2. Connect components with model and processors
    const model = {};
    const processors = {};
    const Component = () => {};
    const App = app.connect(mapStateToProps, processors, Component);
    
    // 3. Register models
    app.model(model);
    
    // 4. Start app
    app.start('#root', App);
```
*app.connect在业务代码里非常常用，推荐将const app = deef()等逻辑，放到单独一个模块，方便引用*

## Introduction

### Model
Model是最最纯粹的那种model，存数据（state），以及改数据的方法（reducers）

Model处理数据，与具体业务无关

```js
    const Model = {
        namespace: 'count',
        state: {
            num: 0
        },
        reducers: {
            add(state) {
                return {
                    ...state,
                    num: state.num + 1
                };
            }
        }
    };
```

### Component
Component 是 无状态函数式组件（stateless functional component），props决定了组件的唯一展现

纯粹到类似N年前的模板引擎doT、mustache

Component与状态和交互处理解耦，是可以复用的

```js
    const Component = ({num, processors}) => <div>
        <h1>{num}</h1>
        <button onClick={processors.add}></button>
    <div>;
```

### Processors
Processors是所有交互的处理器

鼠标、键盘事件、路由跳转等等，均由processors响应并处理（dispatch一个action，并交由reducers改状态）

key为number的function是subscriptions，用于订阅数据、监听键盘事件、路由跳转等等

否则为handlers，用于组件的事件响应

processors是plan object——方便组合！方便组合！方便组合！

```js
    const processors = {
        // handlers for component
        add({dispatch}) {
            dispatch({type: 'count/add'});
        },
        // subscriptions 订阅 只执行一次
        ...[
            function ({dispatch, getState, on}) {
                // 显示鼓励的时候 再加10分
                let off = on('action', (action) => {
                    if (action.type === 'count/showEncourage') {
                        off();
                        dispatch({type: 'count/setNum', payload: getState().count.num + 10});
                    }
                });
            }
        ]
    };
```

#### on
支持的有

- action 调用dispatch的hook  等同于redux middleware
- history location跳转的hook
- error processor出错的hook
- stateChange 可以让state和localStorage或者远程的service建立连接
- hmr 热替换

### app.connect
app.connect(mapStateToProps, processors, Component, options)基于react-redux的connect封装

mapStateToProps与react-redux的一致
```js
const modelA = {
    namespace: 'A',
    state: {
        x: 'test'
    }
};
const modelB = {
    namespace: 'B',
    state: {
        y: 'test'
    }
};
const mapStateToProps = (state, ownProps) => {
    return {
        stateX: state.A.x,
        stateY: state.B.y
    }
}; 
```
processors是与当前Component相关的交互处理
```js
const countProcessors = {
    // handlers for component
    add({dispatch}) {
        dispatch({type: 'count/add'});
    }
};
const processors = {
    // 组合processors是非常容易的
    ...countProcessors,
    ...commonProcessors
}
```
Component推荐是纯函数式的组件
```js
    // Component函数的第一个参数就是props，或者stateful Component的this.props
    const Component = ({stateX, stateY, processors}) => {
        return <button onClick={processors.add}>{x}{y}</button>;
    };
    const App = app.connect(mapStateToProps, processors, Component);
    // app.connect传入上面的参数，Component的props为{stateX, stateY, processors}
```

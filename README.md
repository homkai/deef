# deef
一个react、redux的简单、纯粹、健壮的框架

## Concepts
组件化开发：前端页面由若干具备交互处理功能的展现模块组合而成

单向数据流：状态决定展现，交互就是改状态

deef将状态、展现、交互的代码加以约束并更有效地组织起来

代码分为model、UI、connector

model -> (connector) -> UI -> (connector) -> model -> ...

- model：定义展现依赖的状态数据（state）及修改状态的接口（reducer）
- UI：展现组件，输入state和响应交互的callback，输出DOM
- connector：为UI注入依赖的状态（getUIState）及处理所有业务交互（handlers），得到一个可以支持具体业务的独立组件

## Demo

```bash
$ cd examples/xxx
$ npm install
$ npm start
```
http://location:8881

参见 examples文件夹

## Getting Started
```js
import deef from 'deef';

// 1. Create app
const app = deef();

// 2. Register models
const model = {};
app.model(model);

// 3. Connect components with state
const App = app.connect(getUIState, handlers)(Component);

// 4. Start app
app.start('#root', App);
```
*app.connect在业务代码里非常常用，推荐将const app = deef()等逻辑，放到单独一个模块，方便引用*

## Usages

### model
model是最最纯粹的那种model，存数据（state），以及改数据的方法（reducers）

**model处理状态数据，与具体业务无关**

```js
const model = {
    namespace: 'count',
    state: {
        num: 0
    },
    reducers: {
        add(state, action) {
            // reducer里的function是纯函数，输入当前state和action，输出nextState
            return {
                ...state,
                num: state.num + 1
            };
        }
    }
};
```
*所有model里的state会汇集成一个store，以namespace来扁平化组织*
*在任何地方都不可以通过引用直接改当前状态：currentState.stateX=1*

### UI
UI Component 是 无状态函数式组件（stateless functional component），props决定了组件的唯一展现

纯粹到类似N年前的模板引擎doT、mustache

**Component与状态和交互处理解耦，是可以复用的**

```js
const Component = ({num, ...callbacks}) => {
    const {onAdd} = callbacks;
    return (<div>
        <h1>{num}</h1>
        <button onClick={onAdd}></button>
    <div>);
};
```
*UI里不可以直接处理交互，通过callbacks暴露出去*

### connector

#### getUIState 选取依赖的state
```js
const getUIState = (models, ownProps) => {
    return {
        num: models.count.num
    }
};
```
#### handlers 所有交互的处理器

鼠标、键盘事件、路由跳转等等，均由handlers响应并处理（dispatch一个action，并交由reducers改状态）

**handlers是plan object——方便组合！方便组合！方便组合！**

```js
const handlers = {
    // callbacks for component
    onAdd({dispatch, getState}, ...args) {
        // dispatch方法传入action对象，type对应到model的reducer，payload是传给reducer的参数
        // getState可以拿到整个store的状态
        // args是UI组件里调用传入的参数
        dispatch({type: 'count/add'});
    },
    // subscriptions 订阅 在connect的时候执行，且只执行一次
    subscriptions: {
        init({dispatch, getState, on}) {
            // 从其他页面回来时重新计数
            // on用来监听状态改变等
            on('action', ({type, payload}) => {
                if (type === 'app/changeComponent' && payload === 'Count') {
                    dispatch({type: 'count/init', payload: 0});
                }
            });
        }
    }
};
```
*subscriptions是plain object，用于订阅数据、监听键盘事件、路由跳转、初始化等等*

##### on
支持的有

- action 调用dispatch的hook  等同于redux middleware
- error handlers出错的hook
- stateChange 可以让state和localStorage或者远程的service建立连接
- hmr 热替换
*返回off，用来取消on*

### app.connect 连接model与UI，返回一个支持具体业务的组件
```js
app.connect(getUIState, handlers)(Component)
```



# fe-feed前端框架 deef
一个react、redux的简单、纯粹、健壮的框架
Github：https://github.com/homkai/deef

## 用法

### model
model是最最纯粹的那种model，存数据（state），以及改数据的方法（reducers）

**model处理状态数据，与具体业务无关**

```js
const model = {
    namespace: 'count',
    state: {
        num: 0
    },
    reducers: {
        add(state, action) {
            // reducer里的function是纯函数，输入当前state和action，输出nextState
            return {
                ...state,
                num: state.num + 1
            };
        }
    }
};
```
*所有model里的state会汇集成一个store，以namespace来扁平化组织*
*在任何地方都不可以通过引用直接改当前状态：currentState.stateX=1*

### UI
UI Component 是 无状态函数式组件（stateless functional component），props决定了组件的唯一展现

纯粹到类似N年前的模板引擎doT、mustache

**Component与状态和交互处理解耦，是可以复用的**

```js
const Component = ({num, ...callbacks}) => {
    const {onAdd} = callbacks;
    return (<div>
        <h1>{num}</h1>
        <button onClick={onAdd}></button>
    <div>);
};
```
*UI里不可以直接处理交互，通过callbacks暴露出去*

### connector

#### getUIState 选取依赖的state
```js
const getUIState = (models, ownProps) => {
    return {
        num: models.count.num
    }
};
```
#### handlers 所有交互的处理器

鼠标、键盘事件、路由跳转等等，均由handlers响应并处理（dispatch一个action，并交由reducers改状态）

**handlers是plan object——方便组合！方便组合！方便组合！**

```js
const handlers = {
    // callbacks for component
    onAdd({dispatch, getState}, ...args) {
        // dispatch方法传入action对象，type对应到model的reducer，payload是传给reducer的参数
        // getState可以拿到整个store的状态
        // args是UI组件里调用传入的参数
        dispatch({type: 'count/add'});
    },
    // subscriptions 订阅 在connect的时候执行，且只执行一次
    subscriptions: {
        init({dispatch, getState, on}) {
            // 从其他页面回来时重新计数
            // on用来监听状态改变等
            on('action', ({type, payload}) => {
                if (type === 'app/changeComponent' && payload === 'Count') {
                    dispatch({type: 'count/init', payload: 0});
                }
            });
        }
    }
};
```
*subscriptions是plain object，用于订阅数据、监听键盘事件、路由跳转、初始化等等*

##### on
支持的有

- action 调用dispatch的hook  等同于redux middleware
- error handlers出错的hook
- stateChange 可以让state和localStorage或者远程的service建立连接
- hmr 热替换
*返回off，用来取消on*

### app.connect 连接model与UI，返回一个支持具体业务的组件
```js
require('feedAds/app').connect(getUIState, handlers)(Component)
```

## 编码约定
- model是共享的，UI是可复用的，handler是可组合的，在保证意图完整的情况下，颗粒度尽可能小
- 组件能独立connect的就独立
- es6语法的js，文件名不加.es6后缀
- 所有业务处理逻辑必须放在handler
- UI组件，以.ui.js结尾
- 组件里揉了交互逻辑或者使用state的，以.jsx.js结尾
- UI组件推荐使用纯函数，在特殊情况下可以使用class
- 独立组件使用ComponentName/index.js的命名方式，ComponentName是文件夹名，connect的逻辑放在index.js里
- 命名推荐与后端接口字段一致，人家全小写咱也全小写
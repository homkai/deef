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
- connector：为UI注入依赖的状态（getState）及处理所有业务交互（handlers），得到一个可以支持具体业务的独立组件

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
const App = app.connect(getState, handlers)(Component);

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
        add(state) {
            return {
                ...state,
                num: state.num + 1
            };
        }
    }
};
```

### UI
UI Component 是 无状态函数式组件（stateless functional component），props决定了组件的唯一展现

纯粹到类似N年前的模板引擎doT、mustache

**Component与状态和交互处理解耦，是可以复用的**

```js
const Component = ({num, onAdd}) => <div>
    <h1>{num}</h1>
    <button onClick={onAdd}></button>
<div>;
```

### connector

#### getState 选取依赖的state
```js
const getState = (models, ownProps) => {
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
    onAdd({dispatch}) {
        dispatch({type: 'count/add'});
    },
    // subscriptions 订阅 只执行一次
    subscriptions: {
        init({dispatch, getState, on}) {
            // 从其他页面回来时重新计数
            on('action', ({type, payload}) => {
                if (type === 'app/changeComponent' && payload === 'Count') {
                    dispatch({type: 'count/init', payload: 0});
                }
            });
        }
    }
};
```
*subscriptions是plain object，用于订阅数据、监听键盘事件、路由跳转等等*

##### on
支持的有

- action 调用dispatch的hook  等同于redux middleware
- error handlers出错的hook
- stateChange 可以让state和localStorage或者远程的service建立连接
- hmr 热替换
*返回off，用来取消on*

### app.connect 连接model与UI，返回一个支持具体业务的组件
```js
app.connect(getState, handlers)(Component)
```

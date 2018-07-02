# deef
基于redux、react函数式组件，简单、健壮、强代码组织的框架

deef从“响应一个个用户事件”出发，进而抽象成状态数据及数据流转，最后表现成UI渲染，达成交互


## 代码分层：
状态决定展现，交互就是改状态：model state => UI render => callback handler => model reducer
- model：定义状态和改状态的接口
- getUIState：从model中取UI展现依赖的状态
- UI：函数式组件，渲染界面并暴露出用户交互的callbacks
- callbacks：响应处理一个个用户事件
- *connect(getUIState, callbacks)(UI)：打包得到一个可以支持具体业务的组件*


## 特点
- 概念少，逻辑清晰统一，代码组织约束性强，对新人友好
- 代码颗粒度更小，函数式编程，不使用this，复用组合更灵活
- 相比class component，UI组件就是单纯的render逻辑
    - 没有生命周期、组件内部state对数据流的干扰，交互响应流->状态数据流->UI渲染流是一一对应的
    - 纯函数，没有this上下文依赖，不易出错，方便复用组合
    - 极大地与react解耦


### 代码组织强约束
- 分层清晰，职责分明，数据类型约束性强
- 限制了UI中拿不到dispatch，dispatch只可能在callbacks中使用
- callbacks屏蔽了this，支持命名规范检查，如限制必须onXXX


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
const App = app.connect(getUIState, callbacks)(UI);

// 4. Start app, onRendered在App渲染后触发，可以理解为入口callback
app.start('#root', App, onRendered);
```
*app.connect在业务代码里非常常用，推荐将const app = deef()等逻辑放到单独一个模块，并配置webpack alias以方便引用，可参考examples*

## Usages

### model
```js
const model = {
    // namespace是区别不同model的唯一标识
    namespace: 'count',
    // 定义这个model的状态数据
    state: {
        num: 0
    },
    // 定义改状态的接口
    reducers: {
        add(state, action) {
            // reducers里的function是纯函数，输入当前state和action，输出nextState
            // action是callback handler里dispatch的，action要求{type: 'modelNamespace/reducerName', payload: xxx}的格式
            // 比如这里action是{type: 'count/add', payload: 1}
            return {
                ...state,
                num: state.num + action.payload
            };
        }
    }
};
```
*redux的约定：在任何地方都不可以通过引用直接改当前状态，如state.num=1是不对的*

### UI
```js
const UI = ({num, tab, ...callbacks}) => {
    // 第一个参数是外部传入的props，包括展现依赖的state和响应交互的callbacks，要求通过es6解构的方式直观取出依赖的状态，把callbacks放到后面，如果callbacks少的话，就直接摆出来，如果大于两个的话，要求使用"...callbacks"的方式，将callbacks整合，然后再解构这个callbacks。
    const {onAdd, onSwitchTab} = callbacks;
    // 拿到一个UI组件，看前两行就直观知道该UI依赖的所有的state和callbacks。

    return (<div>
        <h1>{num}</h1>
        <button onClick={onAdd}></button>
    <div>);
};
```
*UI是纯函数组件（stateless functional component），不可以直接处理交互，要通过callbacks暴露出去*

### getUIState 根据model计算UI依赖的state
```js
const getUIState = (store, ownProps) => {
    // store是所有model的状态汇聚成的store，是plain object，第一层是model的namespace
    // ownProps是引用组件时显式传入的props，如<UI stateX="test" />中的stateX
    // 如果UI依赖的stateX需要根据model里定义的stateY、stateZ等计算所得，且该计算逻辑较为复杂，或者这个计算逻辑是可复用的，需将该逻辑放到Component/selector.js
    return {
        // 要求return一个plain object，会注入到UI的props
        num: store.count.num,
        // 可以整合配置里的一些常量进去
        ...config.VALIDATION_RULES
    }
};
```

### callbacks 响应一个个用户事件来处理交互
```js
const callbacks = {
    // 这些callbacks会注入到UI 命名必须是onXXX的形式
    onAdd({dispatch, getState}, event) {
        // 固定传入第一个参数{dispatch, getState}
        // dispatch方法传入action{type: 'model/reducer', payload: {}}来调用model的reducer改变model中的状态
        // getState().modelNamespace即可拿到某一model的状态
        // event是UI组件调用时传入的第一个参数，有更多的参数，依次往后排
        dispatch({type: 'count/add', payload: event.target.value});
    },
    // 可以把一些公共的callbacks抽出来，放到Component/handler.js里，方便多处复用
    ...commonCallbacks
};
```

### connect 连接model与UI，返回一个支持具体业务的组件
```js
require('app').connect(getUIState, callbacks)(UI)
```

## 编码规范
### 目录结构
- ComponentName 首字母大写的文件夹
    - index.js // connect
    - UI.js 或 UI/(index.js+Section.ui.js)
    - style.less与UI.js或UI/index.js同层级，直接在UI中引入
    - config.js 该层级及以下公共配置
    - handler // 可复用的callback handler，或者暴露给外部调用的方法
    - selector // 可复用的一部分getUIState逻辑
    - common // 该层级及以下公共的东西
    - components 下级组件

### UI
- 使用纯函数，保持简单纯粹的渲染逻辑
- 从props中显式列出所有state和callbacks，不可在业务中使用props.xxx
- 最先解构ownProps，再解构state，再解构callbacks，callbacks比较多时，单独解构callbacks
- 渲染dom逻辑外，仅可出现整理下层组件props的逻辑，杜绝在UI中定义callback，再简单的callback也要放到connect
- callback依赖ownProps时，使用_.partial注入
- UI中不可直接使用config的值，必须从props传入
- 当render的逻辑比较多时，分成多部分，并放到UI文件夹，其他部分命名为Section.ui.js，并在index.js整合
- style.less直接在UI中引入，样式文件尽可能独立，不要包含下层组件的样式

### getUIState
- 可复用的从model中取具体业务含义的值的逻辑放到selector.js中去，export的每一项是function getXXX()

### callbacks
- plan object，不可使用this，每一项是onXXX({dispatch, getState}, …args){}
- 可复用的callback handler，或者暴露给外部调用的方法应放到handler.js中，export的每一项是function({dispatch, getState}, …args)，标识符为动词短语；此外可export.callbacks = {...};

## 性能
- 基于[react-redux-hk](https://github.com/homkai/react-redux-hk)，自动分析getUIState依赖的state，依赖的state没有改变时，不会重新计算getUIState，不会触发UI的re-render


## 配套
- [deef-router](https://github.com/homkai/deef-router)，参考examples/todomvc
- [deef-plugin-connect-with-context](https://github.com/homkai/deef-plugin-connect-with-context)，deef plugin 基于deef形式构建大型公共业务组件

## 使用
- [百度信息流推广平台]
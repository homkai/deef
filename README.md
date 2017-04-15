# deef
一个react、redux的简单、灵活、健壮的业务开发框架

## Concepts
- 状态决定展现：model中的状态是组件动态展现的唯一标准，UI组件只需要关注简单的渲染流
- 交互就是改状态：**交互的达成，就是响应一个个用户事件**，进而改变model中的状态
- *用户事件：分为如onClick、onChange等UI事件和诸如hashchange等要通过全局订阅的方式提供callback环境的事件*

## 优势
- 代码颗粒度更小，纯函数，不使用this，复用组合更灵活
- 相比传统的react class component，deef的概念更少，UI组件就是单纯的渲染逻辑（react方面只需要会jsx语法就行），上手难度更低
    - 没有生命周期、组件内部state对数据流、渲染流的干扰，只有model -> selector -> UI -> handler -> model这一条单向数据流，使得编码思路更简单、清晰
    - 纯函数，不使用this，不容易出错，对结果更可控，更方便测试
    - deef对代码组织有很强的约束作用，分层职责分明，想乱写都不容易，整个团队的编码统一和代码质量更可控
- 交互响应流->状态数据流->UI渲染流是一一对应的，deef从“响应一个个用户事件”出发，进而抽象成状态及状态流转，表现成UI渲染，这使得将现实问题转为编码实现更符合人的认知，成本更低
- deef跟redux的思路更相投，更强调整个顶层组件的数据流、渲染流，没有下层组件实例的概念
- 极大地与react解耦，如果有性能更高的UI渲染库实现，可以很低成本迁移业务代码

## 代码分层：
- model：没有this的plain object，定义展现依赖的状态数据（state）及改状态的接口（reducer），只维护状态，不承载业务处理逻辑
- UI：纯函数组件（stateless functional component）输入state、callbacks的render方法，纯展现组件，不承载业务处理逻辑
- selector: 纯函数，从model中计算出UI展现依赖的state
- handler：没有this的plain object，响应一个个用户事件来处理交互，对于UI事件直接定义callback，对于非UI事件，通过subscriptions订阅的方式提供callback环境
- *connect：将UI、selector、handler打包得到一个可以支持具体业务的独立组件*

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
const App = app.connect(selector, handler)(UI);

// 4. Start app
app.start('#root', App);
```
*app.connect在业务代码里非常常用，推荐将const app = deef()等逻辑，放到单独一个模块，方便引用，可参考examples*

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
            // action是handler里dispatch的，action要求{type: 'modelNamespace/reducerName', payload: xxx}的格式
            // 比如这里action是{type: 'count/add', payload: 1}
            return {
                ...state,
                num: state.num + action.payload
            };
        }
    }
};
```
*在任何地方都不可以通过引用直接改当前状态，如state.num=1是不对的*

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
*UI是纯函数组件（stateless functional component），不可以直接处理交互，通过callbacks暴露出去*

### selector 根据model计算UI依赖的state
```js
const selector = (store, ownProps) => {
    // store是所有model的状态汇聚成的store，是plain object，第一层是model的namespace
    // ownProps是引用组件时显式传入的props，如<UI stateX="test" />中的stateX
    // 如果UI依赖的stateX需要根据model里定义的stateY、stateZ等计算所得，且该计算逻辑较为复杂，或者这个计算逻辑是可复用的，需将该逻辑放到Component/common/selector.js
    return {
        // 要求return一个plain object，会注入到UI的props
        num: store.count.num,
        // 可以整合配置里的一些常量进去
        ...config.VALIDATION_RULES
    }
};
```

### handler 响应一个个用户事件来处理交互
```js
const handler = {
    // callbacks for component，这些callbacks会注入到UI
    // 命名必须是onXXX的callback形式
    onAdd({dispatch, getState}, event) {
        // 固定传入第一个参数{dispatch, getState}
        // dispatch方法传入action{type: 'model/reducer', payload: {}}来调用model的reducer改变model中的状态
        // getState().modelNamespace即可拿到某一model的状态
        // event是UI组件调用时传入的第一个参数，有更多的参数，依次往后排
        dispatch({type: 'count/add', payload: event.target.value});
    },
    // 可以把一些公共的callbacks抽出来，放到Component/common/handler.js里，方便多处复用，如可以直接整合到handler
    ...commonCallbacks,
    // subscriptions 在connect的时候执行，且只执行一次，不会注入到UI
    // 用于非UI事件，如hashchange等，要通过全局订阅的方式提供callback环境
    subscriptions: {
        // 方法名必须是onXXX的形式，命名随意，subscriptions会顺序执行
        onHistoryChange({dispatch}) {
            // 通过订阅history，来提供callback环境
            history.listen(location => {
                const filter = LOCATION_FILTER_MAP[location.pathname];
                filter && dispatch({
                    type: 'todo/filter',
                    payload: filter
                });
            });
        }
    }
};
```

### connect 连接model与UI，返回一个支持具体业务的组件
```js
require('app').connect(selector, handler)(UI)
```

## 编码规范
### 目录结构
- ComponentName 首字母大写的文件夹
    - index.js // connect
    - UI.js 或 UI/index.js+Section.ui.js
    - style.less与UI.js / UI/index.js同层级
    - config.js 该层级及以下公共配置
    - components 下级组件
    - common // 该层级及以下公共的东西
        - handler // 可复用的一部分handler
        - selector // 可复用的一部分selector逻辑
        - components // 可复用的组件

### UI
- 使用纯函数，保持简单纯粹的渲染逻辑
- 显式列出所有依赖的state和callbacks，不可在业务中使用props.xxx
- 最先解构ownProps，再结构state，再解构callbacks，callbacks比较多时，单独解构callbacks
- 渲染dom逻辑外，仅可出现整理下层组件props的逻辑，杜绝在UI中定义callback，再简单的callback也要放到handler
- callback依赖ownProps时，使用_.partial注入
- UI中不可直接使用config的值，必须从props传入
- 当render的逻辑比较多时，分成多部分，并放到UI文件夹，其他部分命名为Section.ui.js，并在index.js整合
- style.less直接在UI中引入，样式文件尽可能独立，不要包含下层组件的样式

### selector
- 当model中的state如page默认是''，UI中需要一个不为空的page，如page: 'Test'，此时应在上层callback初始化model的page为'Test'，不可直接在selector中直接指定page为'Test'，因为handler中getState().model.page还是为空
- 可复用的从model中取具体业务含义的值的逻辑放到common/selector中去，export的每一项是function getXXX()

### handler
- 不可使用this
- subscriptions，仅用于提供非UI事件的callback环境，一般来讲下层业务组件杜绝使用
- 多处使用的handler应放到common/handler中，export的每一项是function({dispatch, getState}, …args)，标识符为动词短语；此外可export.callbacks = {};

## 性能
- 基于[react-redux-hk](https://github.com/homkai/react-redux-hk)，自动分析getUIState依赖的state，依赖的state没有改变时，不会重新计算getUIState，不会触发UI的re-render

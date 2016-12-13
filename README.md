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
			// action是connectors的handlers里dispatch的，action要求{type: 'modelNamespace/reducerName', payload: xxx}的格式
			// 比如这里action是{type: 'count/add', payload: 1}
            return {
                ...state,
                num: state.num + action.payload
            };
        }
    }
};
```
*所有model里的state会汇集成一个store，以namespace来扁平化组织，该store可以在handlers里通过getState()拿到，getState().modelNamespace即可拿到某一model的状态*
*在任何地方都不可以通过引用，直接改当前状态：currentState.stateX=1*

### UI
UI Component 是 无状态函数式组件（stateless functional component），props决定了组件的唯一展现

纯粹到类似N年前的模板引擎doT、mustache

**UI与状态和交互处理解耦，是可以复用的**

```js
const UI = ({num, ...callbacks}) => {
	// 第一个参数是外部传入的props，包括展现依赖的状态和响应交互的callbacks，要求通过es6解构的方式直观取出依赖的状态，把callbacks放到后面，如果callbacks少的话，就直接摆出来，如果大于两个的话，要求使用"...callbacks"的方式，将callbacks整合，然后再解构这个callbacks。
    const {onAdd} = callbacks;
    return (<div>
        <h1>{num}</h1>
        <button onClick={onAdd}></button>
    <div>);
};
```
*UI里不可以直接处理交互，通过callbacks暴露出去*
*要保证UI的pure，不可依赖function之外可变的变量，但可以依赖不变的React组件或工具方法等*

### connector

#### getUIState 选取依赖的state
```js
const getUIState = (store, ownProps) => {
	// store是所有model的状态汇聚成的store，是plain object，第一层是model的namespace
	// ownProps是调用UI组件显式传入的props，如<UI stateX="test" />
	// 如果UI依赖的stateX需要根据model里定义的stateY、stateZ等计算所得，且该计算逻辑较为复杂，或者这个计算逻辑是可复用的，需将该逻辑放到components/common/selectors/xxx.js
    return {
	    // 要求return一个plain object，会注入到UI的props
        num: store.count.num,
		// 可以整合配置里的一些常量进去
        ...config.VALIDATION_RULES
    }
};
```
#### handlers 所有交互的处理器

鼠标、键盘事件、路由跳转等等，均由handlers响应并处理（dispatch一个action，并交由reducers改状态）

**handlers是plan object——方便组合！方便组合！方便组合！**

```js
const handlers = {
    // callbacks for component，这些callbacks会注入到UI
    onAdd({dispatch, getState}, event) {
        // dispatch方法传入action对象，type对应到model的reducer，payload是传给reducer的参数
        // getState可以拿到整个store的状态
        // event是UI组件调用时传入的第一个参数，有更多的参数，依次往后排
        dispatch({type: 'count/add', payload: 1});
    },
    // 可以把一些公共的callbacks抽出来，放到components/common/handlers/xxx.js里，方便多处复用
    ...commonCallbacks,
    // subscriptions 订阅 在connect的时候执行，且只执行一次，不会注入到UI
    subscriptions: {
        init({dispatch, getState, on}) {
            // 从其他页面回来时重新计数
            // on用来监听状态改变等
            on('action', ({type, payload}) => {
                if (type === 'app/changeComponent' && payload === 'Count') {
                    dispatch({type: 'count/init', payload: 0});
                }
            });
        },
        // 同样可以把公共的subscriptions整合进来
	    ...commonSubscriptions
    }
};
```
*subscriptions是plain object，用于订阅数据、监听全局事件、路由跳转、初始化等等*

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

## 性能
- 基于[react-redux-hk](https://github.com/homkai/react-redux-hk)，自动分析getUIState依赖的state，依赖的state没有改变时，不会重新计算getUIState，不会触发UI的re-render

## 编码约定
- model是共享的，UI是可复用的，handler是可组合的，在保证意图完整的情况下，颗粒度尽可能小
- 组件能独立connect的就独立
- 所有业务处理逻辑必须放在handler
- UI组件，以.ui.js结尾
- 组件里揉了交互逻辑或者使用state的，以.jsx.js结尾
- UI组件推荐使用纯函数，在特殊情况下可以使用class
- 独立组件使用ComponentName/index.js的命名方式，ComponentName是文件夹名，connect的逻辑放在index.js里
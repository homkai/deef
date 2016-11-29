# deef
一个react、redux的简单、纯粹、健壮的框架

## Concepts
代码分为model、UI、connector

model -> (connector) -> UI -> (connector) -> model -> ...

**状态（model）决定展现（UI），交互就是改状态（connector）**

- model：展现依赖的状态数据（state），及修改状态的方法（reducer）
- UI：展现组件，输入state和响应交互的callback，输出DOM
- connector：连接UI和model，取状态（mapStateToProps），处理所有业务交互逻辑——改状态（processor）

编码思路很清晰，状态数据state放在model，UI组件是props（state、callback）的纯函数，
交互就是改状态，统一在connector中响应交互，改状态只能在通过dispatch action这个唯一的入口，
发出的action由model中的reducers处理，reducers是action和state的纯函数

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
const App = app.connect(mapStateToProps, processor)(Component);

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

#### mapStateToProps 选取依赖的state
```js
const mapStateToProps = (models, ownProps) => {
    return {
        num: models.count.num
    }
};
```
#### processor 所有交互的处理器

鼠标、键盘事件、路由跳转等等，均由processor响应并处理（dispatch一个action，并交由reducers改状态）

**processor是plan object——方便组合！方便组合！方便组合！**

```js
const processor = {
    // handlers for component
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
- error processor出错的hook
- stateChange 可以让state和localStorage或者远程的service建立连接
- hmr 热替换

### app.connect 参见react-redux的connect
```js
app.connect(mapStateToProps, processor)(Component)
```

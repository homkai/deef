# deef
一个react、redux的简单、纯粹、健壮的框架

## Concepts
代码分为model、Component、processor

model -> Component -> processor -> model -> ...

**状态（model）决定展现（Component），交互就是改状态（processor）**

编码思路很清晰，状态数据放在model，组件是props的纯函数，
交互处理就是改状态，改状态只能通过dispatch action这个唯一的入口，
然后由model中的reducers处理，reducers是action和state的纯函数
（No side effects. No API calls. No mutations.），
用redux的话说叫状态（state）是可预测的（predictable ）。
再关键的一点，dispatch一般只写在processor中。

这使得代码测试、调试起来很容易：
我们的model和component逻辑很简单，不容易出错，
所以更多只需要关心processor中是否正确地响应了某一交互动作，并dispatch了某个action就行

## Demo

API很少，看个example就知道怎么用了

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

// 2. Connect components with model and processor
const model = {};
const processor = {};
const Component = () => {};
const App = app.connect(mapStateToProps, processor, Component);

// 3. Register models
app.model(model);

// 4. Start app
app.start('#root', App);
```
*app.connect在业务代码里非常常用，推荐将const app = deef()等逻辑，放到单独一个模块，方便引用*

## Usages

### model
model是最最纯粹的那种model，存数据（state），以及改数据的方法（reducers）

**model处理数据，与具体业务无关**

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

### Component
Component 是 无状态函数式组件（stateless functional component），props决定了组件的唯一展现

纯粹到类似N年前的模板引擎doT、mustache

**Component与状态和交互处理解耦，是可以复用的**

```js
const Component = ({num, onAdd}) => <div>
    <h1>{num}</h1>
    <button onClick={onAdd}></button>
<div>;
```

### processor
processor是所有交互的处理器

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
            // 显示鼓励的时候 再加10分
            const off = on('action', (action) => {
                if (action.type === 'count/showEncourage') {
                    off();
                    dispatch({type: 'count/setNum', payload: getState().count.num + 10});
                }
            });
        }
    }
};
```
*subscriptions是plain object，用于订阅数据、监听键盘事件、路由跳转等等，否则为function，用于组件的事件响应*
 
#### on
支持的有

- action 调用dispatch的hook  等同于redux middleware
- error processor出错的hook
- stateChange 可以让state和localStorage或者远程的service建立连接
- hmr 热替换

### app.connect
app.connect(mapStateToProps, processor)(Component)基于react-redux的connect封装

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
processor是与当前Component相关的交互处理
```js
const countProcessor = {
    // handlers for component
    add({dispatch}) {
        dispatch({type: 'count/add'});
    }
};
const processor = {
    // 组合processor是非常容易的
    ...countProcessor,
    ...commonProcessor
}
```
Component推荐是纯函数式的组件
```js
// Component函数的第一个参数就是props，或者stateful Component的this.props
const Component = ({stateX, stateY, onAdd}) => {
    return <button onClick={onAdd}>{stateX}{stateY}</button>;
};
const App = app.connect(mapStateToProps, processor)(Component);
// app.connect传入上面的参数，Component的props为{stateX, stateY, onAdd}
```

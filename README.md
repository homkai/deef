# deef
一个react、redux的简单、纯粹、健壮的框架

代码分为Model、Component、Processors

Model -> Component -> Processors -> Model -> ...

*状态（Model）决定展现（Component），交互就是改状态（Processors）*

## Demo

API很少，几乎所有的API都用在demo里了

```bash
$ npm install
$ npm start
```
http://location:8881

## Usage
```js
    import deef from 'deef';
    
    // 1. Create app
    const app = deef();
    
    // 2. Connect components width model and processors
    const model = {//...};
    const processors = {//...};
    const Component = () => {//...};
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
# deef
一个react、redux的简单、纯粹、健壮的框架

代码分为Model、Component、Processors

Model -> Component -> Processors -> Model -> ...

状态（Model）决定展现（Component），交互就是改状态（Processors）

## Model
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

## Component
Component 是 无状态函数式组件（stateless functional component），props决定了组件的唯一展现

纯粹到类似N年前的模板引擎doT、mustache

组件化开发，从root component到n级业务组件都拿这种组件堆叠

root component不用react-router的那种router component，统一用M C P

Component与状态和交互处理解耦，是可以复用的

```js
    const Component = ({num, processors}) => <div>
        <h1>{num}</h1>
        <button onClick={processors.add}></button>
    <div>;
```

## Processors
Processors是所有交互的处理器

鼠标、键盘事件、路由跳转等等，均由processors响应并处理（dispatch一个action，并交由reducers改状态）

processors是plan object——方便组合！方便组合！方便组合！

```js
    const processors = {
        // handlers for component
        add({dispatch}) {
            dispatch({type: 'count/add'});
        },
        // subscriptions
        ...[
            function ({dispatch, history}) {
                history.listen(location => {
                    location === '/count' && dispatch({type: 'count/init', payload: 10});
                });
            }
        ]
    };
```

## Demo

详见demo

```bash
$ npm install
$ npm start
```

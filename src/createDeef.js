import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import {Provider, connect as reduxConnect} from 'react-redux';
import handleActions from 'redux-actions/lib/handleActions';
import isPlainObject from 'is-plain-object';
import invariant from 'invariant';
import warning from 'warning';
import Event from './event';

const SEP = '/';

const historyNamespace = 'history';

export default function createDeef(createOpts) {
    const {
        window,
        defaultHistory
    } = createOpts;

    /**
     * Create a deef instance.
     */
    return function deef(opts = {}) {
        const {
            initialReducer = {},
            initialState = {},
            reducerEnhancer = (reducers => reducers),
            history = defaultHistory
        } = opts;

        const event = new Event();

        let historyActionTypes = {};
        {
            const {listen, push, replace, go, goBack, goForward} = history;
            invariant(
                listen && push && replace && go && goBack && goForward,
                `app.deef(): history must have "listen, push, replace, go, goBack, goForward" methods`
            );
            historyActionTypes = {push, replace, go, goBack, goForward};

            history.listen((...args) => {
                event.trigger('history', args);
            });
        }

        // error wrapper
        event.on('error', function(err) {
            throw new Error(err.stack || err);
        });
        const onError = (err) => {
            if (err) {
                if (typeof err === 'string') err = new Error(err);
                event.trigger('error', [err]);
            }
        };

        const app = {
            // private properties
            _models: [],
            _store: null,
            // methods
            model,
            start,
            connect,
            // not recommended
            _history: history,
            _dispatch: dispatch,
            _on: on
        };
        return app;


        ////////////////////////////////////
        // Methods

        /**
         * Register a model.
         *
         * @param model
         */
        function model(model) {
            this._models.push(checkModel(model));
        }

        // inject model dynamically
        function injectModel(createReducer, m) {
            if (m.namespace) {
                const hasExisted = this._models.some(model =>
                    model.namespace === m.namespace
                );
                if (hasExisted) {
                    return;
                }
            }
            m = checkModel(m);
            this._models.push(m);
            const store = this._store;

            // reducers
            store.additionalReducers[m.namespace] = getReducer(m.reducers, m.state);
            store.replaceReducer(createReducer(store.additionalReducers));
        }

        /**
         * Start the application. Selector is optional. If no selector
         * arguments, it will return a function that return JSX elements.
         *
         * @param container selector | HTMLElement
         * @param RootComponent Component
         */
        function start(container, RootComponent) {
            // support selector
            if (typeof container === 'string') {
                container = document.querySelector(container);
                invariant(container, 'app.start: could not query selector: ' + container);
            }

            invariant(!container || isHTMLElement(container), 'app.start: container should be HTMLElement');

            let reducers = { ...initialReducer };
            for (let m of this._models) {
                reducers[m.namespace] = getReducer(m.reducers, m.state);
            }

            let middlewares = [
                api => next => action => {
                    event.trigger('action', [action]);
                    return next(action);
                }
            ];
            const devtools = window.devToolsExtension || (() => noop => noop);
            const enhancers = [
                applyMiddleware(...middlewares),
                devtools(),
            ];
            const store = this._store = createStore(
                createReducer(),
                initialState,
                compose(...enhancers)
            );

            function createReducer(additionalReducers = {}) {
                return reducerEnhancer(combineReducers({
                    ...reducers,
                    ...additionalReducers
                }));
            }

            store.additionalReducers = {};

            store.subscribe(() => event.trigger('stateChange'));

            // inject model after start
            this.model = injectModel.bind(this, createReducer);

            // If has container, render; else, return react component
            if (container) {
                render(container, RootComponent, store);
                event.trigger('hmr', [render.bind(this, container, store, this)]);
                setTimeout(() => {
                    event.trigger('history', [history.location, history.action]);
                }, 0);
            } else {
                return getProvider(RootComponent, store);
            }
        }

        function connect(mapStateToProps, processors, Component, options) {
            mapStateToProps = mapStateToProps || (() => ({}));
            processors = processors || {};
            const getProcessorArgs = () => {
                return {
                    getState: app._store.getState,
                    dispatch,
                    on
                };
            };
            return reduxConnect(
                (state, ownProps) => {
                    const props = mapStateToProps(state, ownProps);
                    invariant(
                        props.processors === undefined,
                        'app.connect: mapStateToProps should not return key "processors"'
                    );
                    return props;
                },
                () => {
                    // 订阅只执行一次
                    if (!processors.initialized) {
                        const _handlers = {};
                        const _subscriptions = [];
                        Object.keys(processors).map((key) => {
                            if (!isNaN(key)) {
                                _subscriptions.push(processors[key]);
                            }
                            else {
                                _handlers[key] =
                                    (...args) => processors[key].call(processors, getProcessorArgs(), ...args);
                            }
                        });
                        setTimeout(() => {
                            _subscriptions.forEach(sub => sub.call(processors, getProcessorArgs()))
                        }, 0);
                        processors._handlers = _handlers;
                        processors.initialized = true;
                    }
                    return {
                        processors: processors._handlers
                    };
                },
                options
            )(Component);
        }

        function dispatch(action) {
            try {
                // 整合push, replace, go, goBack, goForward 以符合整体dispatch风格
                if (action.type.indexOf(historyNamespace + SEP) === 0) {
                    const type = action.type.split('/')[1];
                    const supportTypeList = Object.keys(historyActionTypes);
                    invariant(
                        supportTypeList.indexOf(type) > -1,
                        `app.dispatch: routing reducers only support "${supportTypeList.join('|')}" but "${type}"`
                    );
                    invariant(
                        action.payload !== undefined,
                        `app.dispatch: put action params in action.payload`
                    );
                    return historyActionTypes[type](action.payload);
                }
                return app._store.dispatch(action);
            } catch(e) {
                onError(e);
            }
        }

        function on(type, handler) {
            return event.on.call(event, type, handler);
        }


        ////////////////////////////////////
        // Helpers

        function getProvider(RootComponent, store) {
            return () => (
                <Provider store={store}>
                    <RootComponent />
                </Provider>
            );
        }

        function render(container, RootComponent, store) {
            ReactDOM.render(React.createElement(getProvider(RootComponent, store)), container);
        }

        function checkModel(m) {
            // Clone model to avoid prefixing namespace multiple times
            const model = { ...m };
            const { namespace, reducers } = model;

            invariant(
                namespace,
                'app.model: namespace should be defined'
            );
            invariant(
                namespace !== historyNamespace,
                `app.model: namespace should not be ${historyNamespace}, which is used to change the location`
            );
            invariant(
                !reducers || isPlainObject(reducers) || Array.isArray(reducers),
                'app.model: reducers should be Object or array'
            );
            invariant(
                !Array.isArray(reducers) || (isPlainObject(reducers[0]) && typeof reducers[1] === 'function'),
                'app.model: reducers with array should be app.model({ reducers: [object, function] })'
            );

            function applyNamespace(type) {
                function getNamespacedReducers(reducers) {
                    return Object.keys(reducers).reduce((memo, key) => {
                        warning(
                            key.indexOf(`${namespace}${SEP}`) !== 0,
                            `app.model: ${type.slice(0, -1)} ${key} should not be prefixed with namespace ${namespace}`
                        );
                        memo[`${namespace}${SEP}${key}`] = reducers[key];
                        return memo;
                    }, {});
                }

                if (model[type]) {
                    if (type === 'reducers' && Array.isArray(model[type])) {
                        model[type][0] = getNamespacedReducers(model[type][0]);
                    } else {
                        model[type] = getNamespacedReducers(model[type]);
                    }
                }
            }

            applyNamespace('reducers');

            return model;
        }

        function isHTMLElement(node) {
            return typeof node === 'object' && node !== null && node.nodeType && node.nodeName;
        }

        function getReducer(reducers, state) {
            if (Array.isArray(reducers)) {
                return reducers[1](handleActions(reducers[0], state));
            } else {
                return handleActions(reducers || {}, state);
            }
        }

    };
}

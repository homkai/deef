import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider, connect as reduxConnect } from 'react-redux';
import { Router, Route } from 'react-router';
import {push, replace, go, goBack, goForward} from 'react-router-redux';
import handleActions from 'redux-actions/lib/handleActions';
import isPlainObject from 'is-plain-object';
import invariant from 'invariant';
import warning from 'warning';
import window from 'global/window';
import Event from './event';

const SEP = '/';

const routingTypes = {push, replace, go, goBack, goForward};

export default function createDeef(createOpts) {
    const {
        mobile,
        initialReducer,
        defaultHistory,
        routerMiddleware,
        setupHistory
    } = createOpts;

    /**
     * Create a deef instance.
     */
    return function deef(opts = {}) {
        const initialState = opts.initialState || {};
        const reducerEnhancer = opts.reducerEnhancer || (reducers => reducers);

        const history = defaultHistory;

        const event = new Event();

        const app = {
            // properties
            _models: [],
            _store: null,
            _history: null,
            // methods
            model,
            start,
            connect
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
            this._models.push(checkModel(model, mobile));
        }

        // inject model dynamically
        function injectModel(createReducer, onError, m) {
            if (m.namespace) {
                const hasExisted = this._models.some(model =>
                    model.namespace === m.namespace
                );
                if (hasExisted) {
                    return;
                }
            }
            m = checkModel(m, mobile);
            this._models.push(m);
            const store = this._store;

            // reducers
            store.asyncReducers[m.namespace] = getReducer(m.reducers, m.state);
            store.replaceReducer(createReducer(store.asyncReducers));
        }

        /**
         * Start the application. Selector is optional. If no selector
         * arguments, it will return a function that return JSX elements.
         *
         * @param container selector | HTMLElement
         * @param rootComponent Component
         */
        function start(container, rootComponent) {
            // support selector
            if (typeof container === 'string') {
                container = document.querySelector(container);
                invariant(container, 'app.start: could not query selector: ' + container);
            }

            invariant(!container || isHTMLElement(container), 'app.start: container should be HTMLElement');

            // error wrapper
            event.on('error', function(err) {
                throw new Error(err.stack || err);
            });
            const onErrorWrapper = (err) => {
                if (err) {
                    if (typeof err === 'string') err = new Error(err);
                    event.trigger('error', [err]);
                }
            };

            // get reducers and sagas from model
            let sagas = [];
            let reducers = { ...initialReducer };
            for (let m of this._models) {
                reducers[m.namespace] = getReducer(m.reducers, m.state);
                if (m.effects) sagas.push(getSaga(m.effects, m, onErrorWrapper));
            }

            let middlewares = [
                api => next => action => {
                    event.trigger('action', [action]);
                    return next(action);
                }
            ];
            if (routerMiddleware) {
                middlewares = [routerMiddleware(history), ...middlewares];
            }
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

            function createReducer(asyncReducers) {
                return reducerEnhancer(combineReducers({
                    ...reducers,
                    ...asyncReducers,
                }));
            }

            store.asyncReducers = {};

            store.subscribe(() => event.trigger('stateChange'));

            // setup history
            if (setupHistory) setupHistory.call(this, history);

            // inject model after start
            this.model = injectModel.bind(this, createReducer, onErrorWrapper);

            // If has container, render; else, return react component
            if (container) {
                render(container, store, this, rootComponent);
                event.trigger('hmr', render.bind(this, container, store, this));
            } else {
                return getProvider(store, this, rootComponent);
            }
        }

        function connect(mapStateToProps, processors, Component, options) {
            const getProcessorArgs = () => {
                return {
                    dispatch: dispatch,
                    getState: app._store.getState,
                    history: app._history,
                    on: event.on.bind(event)
                };
            };
            return reduxConnect((state, ownProps) => {
                const props = mapStateToProps(state, ownProps);
                invariant(
                    props.processors === undefined,
                    'app.connect: mapStateToProps should not return key "processors"'
                );
                return props;
            }, () => {
                const _subscriptions = [];
                const _processors = {};
                processors && Object.keys(processors).map((key) => {
                    if (!isNaN(key)) {
                        _subscriptions.push(processors[key]);
                    }
                    _processors[key] = (...args) => processors[key].call(processors, getProcessorArgs(), ...args);
                });
                // 订阅只执行一次
                if (!processors.initialized) {
                    setTimeout(() => {
                        _subscriptions.forEach(sub => sub.call(processors, getProcessorArgs()))
                    }, 0);
                    processors.initialized = true;
                }
                return {
                    processors: _processors
                };
            }, options)(Component);
        }

        ////////////////////////////////////
        // Helpers

        function dispatch(action) {
            // 整合push, replace, go, goBack, goForward 以符合整体dispatch风格
            if (action.type.indexOf('routing/') === 0) {
                const type = action.type.split('/')[1];
                const supportTypeList = Object.keys(routingTypes);
                invariant(
                    supportTypeList.indexOf(type) > -1,
                    `app.dispatch: routing reducers only support "${supportTypeList.join('|')}" but "${type}"`
                );
                invariant(
                    action.payload !== undefined,
                    `app.dispatch: put action params in action.payload`
                );
                action = routingTypes[type](action.payload);
            }
            return app._store.dispatch(action);
        }

        function getProvider(store, app, rootComponent) {
            return () => (
                <Provider store={store}>
                    <Router history={app._history}>
                        <Route path="*" component={rootComponent} />
                    </Router>
                </Provider>
            );
        }

        function render(container, store, app, rootComponent) {
            ReactDOM.render(React.createElement(getProvider(store, app, rootComponent)), container);
        }

        function checkModel(m, mobile) {
            // Clone model to avoid prefixing namespace multiple times
            const model = { ...m };
            const { namespace, reducers } = model;

            invariant(
                namespace,
                'app.model: namespace should be defined'
            );
            invariant(
                mobile || namespace !== 'routing',
                'app.model: namespace should not be routing, it\'s used by react-redux-router'
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

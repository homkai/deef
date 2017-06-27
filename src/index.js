/**
 * @file deef
 * @copyright Copyright (c) 2017 Baidu, Inc. All Rights Reserved.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import {Provider, connect as hkConnect} from 'react-redux-hk';
import handleActions from './handleActions';
import isPlainObject from 'lodash-es/isPlainObject';
import values from 'lodash-es/values';
import invariant from 'invariant';
import window from 'global/window';
import document from 'global/document';

import Event from './event';


const SEP = '/';

export default function (opts = {}) {
    const {
        initialReducer = {},
        initialState = {},
        extraMiddlewares = [],
        extraEnhancers = []
    } = opts;

    const event = new Event();

    // error wrapper
    event.on('error', function(err) {
        throw new Error(err.stack || err);
    });

    const app = {
        // private properties
        _models: [],
        _store: null,
        _event: event,
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
     * @param onRendered rendered callback
     */
    function start(container, RootComponent, onRendered) {
        // support selector
        if (typeof container === 'string') {
            container = document.querySelector(container);
            invariant(container, 'deef->start: could not query selector: ' + container);
        }

        invariant(!container || isHTMLElement(container), 'deef->start: container should be HTMLElement');

        let reducers = {...initialReducer};
        for (let m of this._models) {
            reducers[m.namespace] = getReducer(m.reducers, m.state);
        }

        let devTools = () => noop => noop;
        if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__) {
            devTools = window.__REDUX_DEVTOOLS_EXTENSION__;
        }
        const enhancers = [
            applyMiddleware(...extraMiddlewares),
            devTools(),
            ...extraEnhancers
        ];
        const store = this._store = createStore(
            createReducer(),
            initialState,
            compose(...enhancers)
        );

        function createReducer(additionalReducers = {}) {
            return combineReducers({
                ...reducers,
                ...additionalReducers
            });
        }

        store.additionalReducers = {};

        // inject model after start
        this.model = injectModel.bind(this, createReducer);

        // If has container, render; else, return react component
        if (container) {
            render(container, store, RootComponent, onRendered);
            event.on('hmr', Component => render.call(this, container, store, Component, onRendered));
        } else {
            return getProvider(store, RootComponent);
        }
    }

    function buildHandler(handler, actionMeta = {}) {
        return (...args) => {
            try {
                return handler.call(null, {
                    getState: app._store.getState,
                    dispatch: (action) => {
                        action.meta = {...actionMeta, ...(action.meta || {})};
                        app._store.dispatch(action);
                    }
                }, ...args);
            }
            catch (err) {
                event.trigger('error', [err]);
            }
        };
    }

    // 使用react-redux-hk来优化性能
    function connect(getUIState, handlers, mergeProps, options = {}) {
        invariant(
            typeof getUIState === 'undefined' || typeof getUIState === 'function',
            'deef->connect: getUIState should be function'
        );
        invariant(
            typeof handlers === 'undefined'
                || (isPlainObject(handlers) && values(handlers).every(item => typeof item === 'function')),
            'deef->connect: handlers should be plain object containing some pure functions'
        );
        const mapStateToProps = getUIState;
        const mapDispatchToProps = !handlers ? undefined : () => {
            if (!handlers.initialized) {
                let callbacks = {};
                Object.keys(handlers).map((key) => {
                    callbacks[key] = buildHandler(handlers[key], {_callback: key});
                });
                handlers.callbacks = callbacks;
                handlers.initialized = true;
            }
            return handlers.callbacks;
        };
        return UI => {
            return hkConnect(
                mapStateToProps,
                mapDispatchToProps,
                mergeProps,
                options
            )(UI);
        };
    }


    ////////////////////////////////////
    // Helpers
    function getProvider(store, RootComponent) {
        return () => (
            <Provider store={store}>
                <RootComponent />
            </Provider>
        );
    }

    function render(container, store, RootComponent, cb) {
        ReactDOM.render(
            React.createElement(getProvider(store, RootComponent)),
            container,
            cb.bind(null, store)
        );
    }

    function checkModel(m) {
        // Clone model to avoid prefixing namespace multiple times
        const model = {...m};
        const {namespace, reducers} = model;

        invariant(
            namespace,
            'deef->model: namespace should be defined'
        );
        invariant(
            !reducers || isPlainObject(reducers) || Array.isArray(reducers),
            'deef->model: reducers should be plain object or array'
        );
        invariant(
            !Array.isArray(reducers) || (isPlainObject(reducers[0]) && typeof reducers[1] === 'function'),
            'deef->model: reducers with array should be app.model({ reducers: [object, function] })'
        );
        invariant(
            !app._models.some(model => model.namespace === namespace),
            'app.model: namespace should be unique'
        );

        function getNamespacedReducers(reducers) {
            return Object.keys(reducers).reduce((memo, key) => {
                invariant(
                    key.indexOf(`${namespace}${SEP}`) !== 0,
                    `deef->model: reducer ${key} should not be prefixed with namespace ${namespace}`
                );
                memo[`${namespace}${SEP}${key}`] = reducers[key];
                return memo;
            }, {});
        }

        if (model.reducers) {
            if (Array.isArray(model.reducers)) {
                model.reducers[0] = getNamespacedReducers(model.reducers[0]);
            } else {
                model.reducers = getNamespacedReducers(model.reducers);
            }
        }

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

import hashHistory from 'react-router/lib/hashHistory';
import {
    routerMiddleware,
    syncHistoryWithStore,
    routerReducer as routing
} from 'react-router-redux';
// import window from 'global/window';
import createDeef from './createDeef';

export default createDeef({
    window,
    initialReducer: {
        routing
    },
    defaultHistory: hashHistory,
    routerMiddleware: routerMiddleware,
    setupHistory(history) {
        this._history = syncHistoryWithStore(history, this._store);
    },
});

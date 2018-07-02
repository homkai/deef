function handleAction(actionType, reducer = state => state) {
    return (state, action) => {
        if (action.type && actionType !== action.type) {
            return state;
        }
        return reducer(state, action);
    };
}

function reduceReducers(...reducers) {
    return (previous, current) =>
        reducers.reduce(
            (p, r) => r(p, current),
            previous,
        );
}

function handleActions(handlers, defaultState) {
    const reducers = Object.keys(handlers).map(type => handleAction(type, handlers[type]));
    const reducer = reduceReducers(...reducers);
    return (state = defaultState, action) => reducer(state, action);
}

export default handleActions;
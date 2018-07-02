export default {
    namespace: 'app',
    state: {
        module: ''
    },
    reducers: {
        changeModule(state, {payload: module}) {
            return {
                ...state,
                module
            };
        }
    }
};

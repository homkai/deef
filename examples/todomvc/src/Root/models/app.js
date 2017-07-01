/**
 * Created by baidu on 17/4/14.
 */
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

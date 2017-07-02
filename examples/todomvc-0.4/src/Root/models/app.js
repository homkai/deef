/**
 * Created by baidu on 17/4/14.
 */
export default {
    namespace: 'app',
    state: {
        module: ''
    },
    reducers: {
        switchModule(state, {payload: module}) {
            return {
                ...state,
                module
            };
        }
    }
};

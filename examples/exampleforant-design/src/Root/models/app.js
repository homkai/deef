/**
 * Created by DOCer 17/7/11.
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

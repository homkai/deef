/**
 * Created by baidu on 17/4/14.
 */
export default {
    namespace: 'app',
    state: {
        page: ''
    },
    reducers: {
        changePage(state, {payload: page}) {
            return {
                ...state,
                page
            };
        }
    }
};

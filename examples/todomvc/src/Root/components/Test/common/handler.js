/**
 * Created by baidu on 17/4/12.
 */
// 当前组件的初始化动作应在上层callback调用
export function show({dispatch, getState}) {
    dispatch({
        type: 'app/changePage',
        payload: 'Test'
    });
}
/**
 * Created by baidu on 17/4/12.
 */
// 当前组件的初始化动作应在上层callback调用
export function show({dispatch, getState}) {
    dispatch({
        type: 'app/changePage',
        payload: 'Todo'
    });
    fetch('https://api.github.com/repos/homkai/deef')
        .then(res => res.json())
        .then(json => {
            json.full_name && dispatch({
                type: 'todo/testAsync',
                payload: json.full_name
            });
        });
}
/**
 * Created by DOCer on 2017/7/11.
 */
// 当前组件的初始化动作应在上层callback调用
export function init({dispatch, getState}) {

    dispatch({
        type: 'app/changeModule',
        payload: 'Test'
    });
    dispatch({
        type: 'test/showLoading'
    });
    dispatch({
        type: 'test/mockTableData'
    });
    setTimeout(() => {
        dispatch({
            type: 'test/hideLoading'
        });
    }, 800);
}
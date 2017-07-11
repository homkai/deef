/**
 * Created by baidu on 17/4/12.
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
    setTimeout(() => {
		dispatch({
	        type: 'test/hideLoading'
	    });
	},800);
}
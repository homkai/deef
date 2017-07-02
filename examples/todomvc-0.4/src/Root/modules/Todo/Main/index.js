/**
 * Created by baidu on 16/11/28.
 */
import {connect, history} from 'app';
import UI from './UI/index';
import {LOCATION_FILTER_MAP} from  '../config';

export default connect(
    ({todo}) => (todo),
    {
        remove({dispatch, getSate}, index) {
            dispatch({
                type: 'todo/remove',
                payload: index
            });
        },
        edit({dispatch, getSate}, index) {
            dispatch({
                type: 'todo/edit',
                payload: index
            });
        },
        save({dispatch, getSate}, e) {
            const content = e.target.value.trim();
            if (e.keyCode === 13 && content) {
                dispatch({
                    type: 'todo/save',
                    payload: content
                });
            }
        },
        toggle({dispatch, getSate}, index) {
            dispatch({
                type: 'todo/toggle',
                payload: index
            });
        },
        toggleAll({dispatch, getSate}) {
            dispatch({
                type: 'todo/toggleAll'
            });
        },
        clear({dispatch, getSate}) {
            dispatch({
                type: 'todo/clear'
            });
            // 清空已完成时自动跳转到ALL
            history.push('/Todo');
        },
        changeFilter({dispatch, getSate}, path) {
            history.push('/Todo/' + path);
        }
    }
)(UI);
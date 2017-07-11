/**
 * Created by baidu on 16/11/28.
 */
import {connect, history} from 'app';
import UI from './UI';
import {LOCATION_FILTER_MAP} from  '../../config';

export default connect(
    ({todo}) => (todo),
    {
        onRemove({dispatch, getSate}, index) {
            dispatch({
                type: 'todo/remove',
                payload: index
            });
        },
        onEdit({dispatch, getSate}, index) {
            dispatch({
                type: 'todo/edit',
                payload: index
            });
        },
        onSave({dispatch, getSate}, e) {
            const content = e.target.value.trim();
            if (e.keyCode === 13 && content) {
                dispatch({
                    type: 'todo/save',
                    payload: content
                });
            }
        },
        onToggle({dispatch, getSate}, index) {
            dispatch({
                type: 'todo/toggle',
                payload: index
            });
        },
        onToggleAll({dispatch, getSate}) {
            dispatch({
                type: 'todo/toggleAll'
            });
        },
        onClear({dispatch, getSate}) {
            dispatch({
                type: 'todo/clear'
            });
            // 清空已完成时自动跳转到ALL
            //修改为replace防止push相同时报错
            history.push('/sub1/Todo');
        },
        onFilter({dispatch, getSate}, path) {
            //修改为replace防止push相同时报错
            history.replace('/sub1/Todo/' + path);
        }
    }
)(UI);
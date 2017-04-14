/**
 * Created by baidu on 16/11/28.
 */
import {connect, history} from 'app';
import UI from './UI';
import {LOCATION_FILTER_MAP} from  '../../config';

export default connect(
    ({todo}) => (todo),
    {
        onRemove({dispatch}, index) {
            dispatch({
                type: 'todo/remove',
                payload: index
            });
        },
        onEdit({dispatch}, index) {
            dispatch({
                type: 'todo/edit',
                payload: index
            });
        },
        onSave({dispatch}, e) {
            const content = e.target.value.trim();
            if (e.keyCode === 13 && content) {
                dispatch({
                    type: 'todo/save',
                    payload: content
                });
            }
        },
        onToggle({dispatch}, index) {
            dispatch({
                type: 'todo/toggle',
                payload: index
            });
        },
        onToggleAll({dispatch}) {
            dispatch({
                type: 'todo/toggleAll'
            });
        },
        onClear({dispatch}) {
            dispatch({
                type: 'todo/clear'
            });
            // 清空已完成时自动跳转到ALL
            history.push('/Todo');
        },
        subscriptions: {
            onHistoryChange({dispatch}) {
                // 通过订阅history，来提供callback环境
                history.listen(location => {
                    const filter = LOCATION_FILTER_MAP[location.pathname];
                    filter && dispatch({
                        type: 'todo/filter',
                        payload: filter
                    });
                });
            }
        }
    }
)(UI);
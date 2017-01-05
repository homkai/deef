/**
 * Created by baidu on 16/11/28.
 */
import {connect, history} from 'app';
import UI from './Main.ui';
import {STORAGE_KEY, LOCATIONS} from  '../../../config';

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
            dispatch({
                type: 'history/push',
                payload: '/'
            });
        },
        subscriptions: {
            restore({dispatch}) {
                const stored = localStorage.getItem(STORAGE_KEY);
                stored && dispatch({
                    type: 'todo/restore',
                    payload: JSON.parse(stored)
                });
            },
            route({dispatch, on}) {
                history.listen(location => {
                    const action = LOCATIONS[location.pathname];
                    action && dispatch(action);
                });
            },
            syncToStorage({on, getState}) {
                on('stateChange', () => {
                    const todo = getState().todo;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(todo));
                });
            },
            testAsync({dispatch}) {
                fetch('https://api.github.com/repos/homkai/deef')
                    .then(res => res.json())
                    .then(json => {
                        dispatch({
                            type: 'todo/testAsync',
                            payload: json.full_name
                        });
                    });
            }
        }
    }
)(UI);
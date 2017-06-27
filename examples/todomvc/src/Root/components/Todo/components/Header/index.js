/**
 * Created by baidu on 16/11/28.
 * Header部分只是 添加todo 的功能，与其他部分无关，所以独立出来
 */
import {connect} from 'app';
import UI from './UI';

export default connect(
    ({todo}) => ({
        newTodo: todo.newTodo
    }),
    {
        onInput({dispatch, getSate}, e) {
            const content = e.target.value;
            dispatch({
                type: 'todo/inputNewTodo',
                payload: content
            });
        },
        onAdd({dispatch, getSate}, e) {
            const content = e.target.value.trim();
            if (e.keyCode === 13 && content) {
                dispatch({
                    type: 'todo/add',
                    payload: content
                });
            }
        }
    }
)(UI);
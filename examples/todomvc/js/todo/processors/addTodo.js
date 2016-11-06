/**
 * Created by Homkai on 2016/11/5.
 */
export default {
	input({dispatch}, e) {
		const content = e.target.value;
		dispatch({
			type: 'todo/inputNewTodo',
			payload: content
		});
	},
	add({dispatch}, e) {
		const content = e.target.value.trim();
		if (e.keyCode === 13 && content) {
			dispatch({
				type: 'todo/add',
				payload: content
			});
		}
	}
};

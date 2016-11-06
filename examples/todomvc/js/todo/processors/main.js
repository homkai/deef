/**
 * Created by Homkai on 2016/11/5.
 */
import {LOCATIONS} from '../../config';

const STORAGE_KEY = 'deef-todomvc';

export default {
	remove({dispatch}, index) {
		dispatch({
			type: 'todo/remove',
			payload: index
		});
	},
	edit({dispatch}, index) {
		dispatch({
			type: 'todo/edit',
			payload: index
		});
	},
	save({dispatch}, e) {
		const content = e.target.value.trim();
		if (e.keyCode === 13 && content) {
			dispatch({
				type: 'todo/save',
				payload: content
			});
		}
	},
	toggle({dispatch}, index) {
		dispatch({
			type: 'todo/toggle',
			payload: index
		});
	},
	toggleAll({dispatch}) {
		dispatch({
			type: 'todo/toggleAll'
		});
	},
	clear({dispatch}) {
		dispatch({
			type: 'todo/clear'
		});
		// 清空已完成时自动跳转到ALL
		dispatch({
			type: 'history/push',
			payload: '/'
		});
	},
	...[
		function ({dispatch}) {
			const stored = localStorage.getItem(STORAGE_KEY);
			stored && dispatch({
				type: 'todo/rehydrate',
				payload: JSON.parse(stored)
			});
		},
		function ({dispatch, on}) {
			on('history', location => {
				const action = LOCATIONS[location.pathname];
				action && dispatch(action);
			});
		},
		function ({on, getState}) {
			on('stateChange', () => {
				const todo = getState().todo;
				localStorage.setItem(STORAGE_KEY, JSON.stringify(todo));
			});
		}
	]
};

/**
 * Created by Homkai on 2016/11/5.
 */
import {FILTERS} from '../config';

export default {
	namespace: 'todo',
	state: {
		newTodo: '',
		todoList: [],
		editingIndex: null,
		filter: FILTERS.ALL
	},
	reducers: {
		restore(state, {payload: storedState}) {
			return storedState;
		},
		inputNewTodo(state, {payload: content}) {
			return {
				...state,
				newTodo: content
			};
		},
		add(state) {
			const todoList = [
				...state.todoList,
				{
					content: state.newTodo,
					completed: false
				}
			];
			return {
				...state,
				newTodo: '',
				todoList
			};
		},
		remove(state, {payload: removeIndex}) {
			const todoList = state.todoList.filter((item, index) => index !== removeIndex);
			return {
				...state,
				todoList
			};
		},
		edit(state, {payload: index}) {
			return {
				...state,
				editingIndex: index
			};
		},
		save(state, {payload: content}) {
			const todoList = state.todoList.map(
				(item, index) => (index !== state.editingIndex ? item : {...item, content})
			);
			return {
				...state,
				todoList,
				editingIndex: null
			};
		},
		clear(state) {
			const todoList = state.todoList.filter(item => !item.completed);
			return {
				...state,
				todoList
			};
		},
		toggle(state, {payload: todoIndex}) {
			const todoList = state.todoList.map(
				(item, index) => (todoIndex !== index ? item : {...item, completed: !item.completed})
			);
			return {
				...state,
				todoList
			};
		},
		toggleAll(state) {
			const isAllCompleted = !state.todoList.filter(item => !item.completed).length;
			const todoList = state.todoList.map(item => ({...item, completed: !isAllCompleted}));
			return {
				...state,
				todoList
			};
		},
		filter(state, {payload: filter}) {
			return {
				...state,
				filter
			};
		},
		testAsync(state, {payload}) {
			const todoList = [...state.todoList];
			!todoList.filter(todo => todo.content === payload).length && todoList.push({
				content: payload,
				completed: false
			});
			return {
				...state,
				todoList
			};
		}
	}
};

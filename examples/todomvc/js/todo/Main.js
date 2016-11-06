/**
 * Created by Homkai on 2016/11/5.
 */
import React from 'react';
import app from '../app';
import TodoItem from './components/TodoItem';
import HeaderUI from './components/Header';
import mainProcessor from './processors/main';
import addTodoProcessor from './processors/addTodo';
import partial from 'lodash/partial';
import {FILTERS} from '../config';

// Header部分只是 添加todo 的功能，与其他部分无关，所以独立出来
const Header = app.connect(({todo}) => ({newTodo: todo.newTodo}), addTodoProcessor, HeaderUI);

function Main({processor, todoList, editingIndex, filter}) {
	const {edit, save, remove, toggleAll, clear, toggle} = processor;
	const activeNum = todoList.filter(item => !item.completed).length;

	return (
		<div>
			<Header />
			<section className="main">
				<input
					readOnly
					className="toggle-all"
					type="checkbox"
					checked={todoList.length && !activeNum}
					onClick={!todoList.length ? null : toggleAll}
				/>
				<ul className="todo-list">
					{
						todoList.map((item, index) => {
							const hidden = filter === FILTERS.ACTIVE
								? item.completed
								: (filter === FILTERS.COMPLETED ? !item.completed : false);
							return (
								<TodoItem
									hidden={hidden}
									key={index}
									todo={item}
									editing={editingIndex === index}
									processor={{
										save,
										edit: partial(edit, index),
										remove: partial(remove, index),
										toggle: partial(toggle, index)
									}}
								/>
							);
						})
					}
				</ul>
			</section>
			<footer className="footer">
				<span className="todo-count"><strong>{activeNum}</strong> item left</span>
				<ul className="filters">
					<li>
						<a className={filter === FILTERS.ALL && 'selected'} href="#/">All</a>
					</li>
					<li>
						<a className={filter === FILTERS.ACTIVE && 'selected'} href="#/active">Active</a>
					</li>
					<li>
						<a className={filter === FILTERS.COMPLETED && 'selected'} href="#/completed">Completed</a>
					</li>
				</ul>
				<button className="clear-completed" onClick={clear}>Clear completed</button>
			</footer>
		</div>
	);
}

export default app.connect(({todo}) => (todo), mainProcessor, Main);

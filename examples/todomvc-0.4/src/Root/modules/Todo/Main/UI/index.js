/**
 * Created by Homkai on 2016/11/5.
 */
import React from 'react';
import partial from 'lodash/partial';
import classNames from 'classnames';

import TodoItemUI from './TodoItem.ui';
import {FILTERS} from '../../config';

export default ({todoList, editingIndex, filter, description, ...handlers}) => {
	const {toggleAll, edit, save, remove, clear, toggle, changeFilter} = handlers;
	const activeNum = todoList.filter(item => !item.completed).length;

	return (
		<div>
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
								<TodoItemUI
									hidden={hidden}
									key={index}
									todo={item}
									editing={editingIndex === index}
									{...{
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
						<a
                            href="javascript:;"
                            className={classNames({selected: filter === FILTERS.ALL})}
                            onClick={_.partial(changeFilter, 'all')}
                        >All</a>
					</li>
					<li>
                        <a
                            href="javascript:;"
                            className={classNames({selected: filter === FILTERS.ACTIVE})}
                            onClick={_.partial(changeFilter, 'active')}
                        >Active</a>
					</li>
					<li>
                        <a
                            href="javascript:;"
                            className={classNames({selected: filter === FILTERS.COMPLETED})}
                            onClick={_.partial(changeFilter, 'completed')}
                        >Completed</a>
					</li>
				</ul>
				<button className="clear-completed" onClick={clear}>Clear completed</button>
			</footer>
			<a href="https://github.com/homkai/deef/">{description}</a>
		</div>
	);
};


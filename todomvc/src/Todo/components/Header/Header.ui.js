/**
 * Created by Homkai on 2016/11/5.
 */
import React from 'react';

export default ({newTodo, onInput, onAdd}) => {

	return (
		<header className="header">
			<h1>todos</h1>
			<input
				value={newTodo}
				autoFocus
				className="new-todo"
				placeholder="What needs to be done?"
				onChange={onInput}
				onKeyUp={onAdd}
			/>
		</header>
	);
};

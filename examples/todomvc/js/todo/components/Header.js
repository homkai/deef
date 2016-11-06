/**
 * Created by Homkai on 2016/11/5.
 */
import React from 'react';
export default ({processor, newTodo}) => {
	const {input, add} = processor;

	return (
		<header className="header">
			<h1>todos</h1>
			<input
				value={newTodo}
				autoFocus
				className="new-todo"
				placeholder="What needs to be done?"
				onChange={input}
				onKeyUp={add}
			/>
		</header>
	);
};

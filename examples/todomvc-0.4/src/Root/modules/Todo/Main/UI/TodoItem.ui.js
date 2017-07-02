/**
 * Created by Homkai on 2016/11/5.
 */
import React from 'react';
export default ({hidden, todo, editing, ...callbacks}) => {
	const completed = todo.completed;
	const {edit, save, remove, toggle} = callbacks;

	return (
		<li className={completed && 'completed'} style={{display: hidden && 'none'}}>
			<div className="view">
				<input className="toggle" type="checkbox" readOnly checked={completed} onClick={toggle}/>
				<label style={{display: editing && 'none'}} onDoubleClick={completed ? null : edit}>
					{todo.content}
				</label>
				<button className="destroy" onClick={remove}></button>
			</div>
			<input
				className="edit"
				defaultValue={todo.content}
				style={{display: editing && 'block'}}
				onKeyUp={save}
			/>
		</li>
	);
}

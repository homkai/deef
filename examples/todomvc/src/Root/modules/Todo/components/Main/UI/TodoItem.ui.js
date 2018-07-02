/**
 * Created by Homkai on 2016/11/5.
 */
import React from 'react';
export default ({hidden, todo, editing, ...callbacks}) => {
	const completed = todo.completed;
	const {onEdit, onSave, onRemove, onToggle} = callbacks;

	return (
		<li className={completed && 'completed'} style={{display: hidden && 'none'}}>
			<div className="view">
				<input className="toggle" type="checkbox" readOnly checked={completed} onClick={onToggle}/>
				<label style={{display: editing && 'none'}} onDoubleClick={completed ? null : onEdit}>
					{todo.content}
				</label>
				<button className="destroy" onClick={onRemove}></button>
			</div>
			<input
				className="edit"
				defaultValue={todo.content}
				style={{display: editing && 'block'}}
				onKeyUp={onSave}
			/>
		</li>
	);
}

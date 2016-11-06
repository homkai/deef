/**
 * Created by Homkai on 2016/11/5.
 */
import React from 'react';
export default function ({processor, hidden, todo, editing}) {
	const completed = todo.completed;
	const {edit, save, remove, toggle} = processor;

	return (
		<li className={completed && 'completed'} style={{display: hidden && 'none'}}>
			<div className="view">
				<input className="toggle" type="checkbox" readOnly checked={completed} onClick={toggle}/>
				<label style={{display: editing && 'none'}} onDoubleClick={completed ? null : edit}>
					{todo.content}
				</label>
				<button className="destroy" href="javascript:;" onClick={remove}></button>
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

import React, { Component } from 'react';
import './TodoInput.css';
import './iconfont'

export default function(props) {
	return (
		<div className="TodoInput" >
			<button className="addTodo-btn">
				<svg className="icon" aria-hidden="true" onClick={add.bind(null, props)}>
					<use xlinkHref="#icon-add1"></use>
				</svg>
			</button>
			<input type="text" value={props.content}
				className="addTodo-input" placeholder={props.placeholder}
				onChange={changeTitle.bind(null, props)}
				onKeyPress={submit.bind(null, props)} />
		</div>
	)
}
function add(props, e) {
	// e.preventDefault()
	if (props.content !== '') {
		props.onSubmit(props.content);
	} else {
		alert('不能为空')
	}
}
function submit(props, e) {
	
	if (e.key === 'Enter') {
		if (e.target.value.trim() !== '') {
			props.onSubmit(props.content)
		} else {
			alert('不能为空')
		}
	}
}
function changeTitle(props, e){
    props.onChange(e);
}
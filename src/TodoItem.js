import React, { Component } from 'react';
import './TodoItem.css';

class TodoItem extends Component {
	render() {
		return (
			<div className="TodoItem">
				<input type="checkbox" id={this.props.todo.id} checked={this.props.todo.status === 'completed'}
					onChange={this.toggle.bind(this)} />
				<label htmlFor={this.props.todo.id}>
				<svg className="icon icon-checkbox" aria-hidden="false">
					<use xlinkHref={"#" + (this.props.todo.status === 'completed' ? "icon-wancheng" : "icon-unselected")}></use>
				</svg>
				</label>
				<span className="title">{this.props.todo.title}</span>
				<svg className="icon icon-delete" aria-hidden="false" onClick={this.delete.bind(this)}>
					<use xlinkHref="#icon-delete1"></use>
				</svg>
			</div>
		)
	}
	toggle(e) {
		this.props.onToggle(e, this.props.todo)
	}
	delete(e) {
		this.props.onDelete(e, this.props.todo)
	}
}
export default TodoItem;
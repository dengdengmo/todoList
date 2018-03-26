import React, {Component} from 'react';
import './TodoFolder.css';
import './iconfont.js'
export default class TodoFolder extends Component{
	constructor(props) {
		super(props)
		this.state = {
			// currentFolder: ''
		}
	}
    render() {
		return (
			<div className="TodoFolder" onClick={this.switchFolder.bind(this)}>
                <svg className="icon icon-pre" aria-hidden="false">
					<use xlinkHref="#icon-list2"></use>
				</svg>
                <span className="folderName">{this.props.folder.name}</span>
                <svg className="icon icon-delete"  aria-hidden="false" onClick={this.delete.bind(this)}>
					<use xlinkHref="#icon-delete1"></use>
				</svg>
            </div>
		)
	}
	switchFolder(e) {
		// if(e.target === e.currentTarget) return // 待优化: 同样目标不触发事件
		this.props.onSwitch(e)
		let node = e.currentTarget.parentNode.parentNode.childNodes;
		if(node !== null){
			node.forEach(element => {
				element.removeAttribute('class')
			});
		}
		e.currentTarget.parentNode.setAttribute('class', 'active') // 注意e.target 和 e.currentTarget 的区别
		// this.setState({
		// 	currentFolder: e.target.innerText
		// })
	}
	delete(e) {
		e.stopPropagation()
		this.props.onDelete(e, this.props.folder)
	}
}
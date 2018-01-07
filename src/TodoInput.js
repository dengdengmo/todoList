import React, { Component } from 'react';
import './TodoInput.css';

class TodoInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
          placeholder: '请输入事项'
        }
    }
    render() {
        return <input type="text" value={this.props.content} 
        					className="TodoInput" placeholder={this.state.placeholder}
        					onChange={this.changeTitle.bind(this)}
         					onKeyPress={this.submit.bind(this)} />
    }
    submit(e) {
        if(e.key === 'Enter') {
          this.props.onSubmit(e)
        }
    }
    changeTitle(e) {
        this.setState({
          placeholder: ''
        })
        this.props.onChange(e)
    }
}

export default TodoInput;
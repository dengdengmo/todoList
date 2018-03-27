import React, { Component } from 'react';
import 'normalize.css';
import './reset.css';
import './App.css';
import './iconfont'
import copyByJSON from './copyByJSON'
import UserDialog from './UserDialog'
import TodoInput from './TodoInput'
import TodoFolder from './TodoFolder'
import TodoItem from './TodoItem'
import { getCurrentUser, signOut, TodoModel, FolderModel } from './leancloud'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: getCurrentUser() || {},
      newFolder: '',
      folderList: [],
      currentFolder: '',
      newTodo: '',
      todoList: []
    }
    let user = getCurrentUser ()
    if(user) {
      FolderModel.getByUser(user, (folderList) => {
        let stateCopy = copyByJSON(this.state)
        stateCopy.folderList = folderList
        this.setState(stateCopy)
      })
      TodoModel.getByUser(user, (todoList) => {
        let stateCopy = copyByJSON(this.state)
        stateCopy.todoList = todoList
        this.setState(stateCopy)
      })
    }
  }
  render() {
    let folders = this.state.folderList
    .filter((item) => !item.deleted)
      .map((item, index) => {
        return (
          <li  key={index}>
          <TodoFolder folder={item}
            onSwitch={this.switchFolder.bind(this)}
            onDelete={this.deleteFolder.bind(this)} />
          </li>
        )
      })
    let todos = this.state.todoList
      .filter((item) => item.inFolder.id === this.state.currentFolder.id)
      // .filter((item) => !item.status)
      .filter((item) => !item.deleted)
      .map((item, index) => {
        return (
          <li key={index}>
            <TodoItem todo={item}
              onToggle={this.toggle.bind(this)}
              onDelete={this.deleteTodo.bind(this)} />
          </li>
        )
      })

    return (
      <div className="App">
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="portrait">
              <svg className="icon icon-portrait" aria-hidden="false">
                <use xlinkHref="#icon-default"></use>
              </svg>
            </div>
            <p>{this.state.user.username||'请登录'}</p>
            {this.state.user.id ? <button onClick={this.signOut.bind(this)}>退出</button> : null}
          </div>
          <div className="sidebar-content">
            <TodoInput className="FolderInput" content={this.state.newFolder}
              onChange={this.changeFolderName.bind(this)}
              onSubmit={this.addFolder.bind(this)}
              onDelete={this.deleteFolder.bind(this)}
              placeholder={"新建清单 ..."} />
            <ol className="folderList">
              {folders}
            </ol>
          </div>
        </div>
        <div className="main">
          <h1 className="header">{this.state.currentFolder ? this.state.currentFolder.name : '待办清单'}</h1>
          <div className="todos">
            <TodoInput className="TodoInput" content={this.state.newTodo}
              onChange={this.changeTodoTitle.bind(this)}
              onSubmit={this.addTodo.bind(this)}
              placeholder="添加事项 ..." />
            <ol className="todoList">
              {/* <li>
                <TodoItem todo={item}
                  onToggle={this.toggle.bind(this)}
                  onDelete={this.deleteTodo.bind(this)} />
              </li> */}
              {todos}
            </ol>
          </div>
          {this.state.user.id ?
            null :
            <UserDialog
              onSignUp={this.onSignUpOrSignIn.bind(this)}
              onSignIn={this.onSignUpOrSignIn.bind(this)}
            />
          }
        </div>
      </div>
    );
  }

  signOut() {
    signOut()
    let stateCopy = copyByJSON(this.state)
    stateCopy.user = {}
    this.setState(this.state = {
      user: getCurrentUser() || {},
      newTodo: '',
      todoList: []
    })
  }
  onSignUpOrSignIn(user,e,folderList) {
    let stateCopy = copyByJSON(this.state)
    stateCopy.user = user
    this.setState(stateCopy)
    if(user) {
      FolderModel.getByUser(user, (folderList) => {
        let stateCopy = copyByJSON(this.state)
        stateCopy.folderList = folderList
        this.setState(stateCopy)
      })
      TodoModel.getByUser(user, (todoList) => {
        let stateCopy = copyByJSON(this.state)
        stateCopy.todoList = todoList
        this.setState(stateCopy)
      })
    }
  }
  addTodo(event) {
    let newTodo = {
      id: null,
      title: this.state.newTodo,
      status: '',
      inFolder: this.state.currentFolder,
      deleted: false
    }
    TodoModel.create(newTodo, (id) => {
      newTodo.id = id
      this.state.todoList.push(newTodo)
      this.setState({
        newTodo: '',
        todoList: this.state.todoList
      })
    }, (error) => {
      console.log(error)
    })
    return false
  }
  toggle(e, todo) {
    let oldStatus = todo.status
    todo.status = todo.status === 'completed' ? '' : 'completed'
    TodoModel.update(todo, () => {
      this.setState(this.state)
    }, (error) => {
      todo.status = oldStatus
      this.setState(this.state)
    })
  }
  changeTodoTitle(event) {
    this.setState({
      newTodo: event.target.value,
    })
  }
  changeFolderName(event) {
    this.setState({
      newFolder: event.target.value,
    })
  }
  deleteTodo(event, todo) {
    let isConfirmed = window.confirm('确定要删除该事项吗？') //需要在confirm前加上window
    if(isConfirmed ==! true)  return
    TodoModel.destroy(todo.id, () => {
      todo.deleted = true
      this.setState(this.state)
    })
  }

  addFolder(event) {
    let isExisted = this.state.folderList.findIndex((item) => {
      return item.name == this.state.newFolder
    })
    if(isExisted !== -1) {
      alert('该分组名已存在')
      return
    }
    let newFolder = {
      name: this.state.newFolder,
      deleted: false
    }
    FolderModel.create(newFolder, (id) => {
      newFolder.id = id
      this.state.folderList.push(newFolder)
      this.setState({
        newFolder: '',
        currentFolder: newFolder,
        folderList: this.state.folderList
      }, () => {
        let folderLi = document.getElementsByClassName("folderList")[0].children,
          folderLiArray = Array.prototype.slice.call(folderLi),  //将HTMLCollection转化为数组
          lastLi = folderLi[folderLi.length - 1];
        folderLiArray.forEach(element => {
          element.removeAttribute('class')
        });
        lastLi.setAttribute('class', 'active')
      })
    }, (error) => {
      alert("未成功添加分组")
    }) 
  }

  switchFolder(e) {
    let stateCopy = copyByJSON(this.state)
    let folderArr = stateCopy.folderList.filter((item, index) => {
      return item.name === e.currentTarget.textContent
    })
    // console.log(folderArr)
    stateCopy.currentFolder = folderArr[0]
    this.setState(stateCopy)
    // console.log(stateCopy.todoList)
    // console.log(stateCopy.folderList)
    // console.log(stateCopy.currentFolder)
  }
  deleteFolder(event, folder) {
    if(this.state.folderList.length <= 1){
			alert('至少要保留一个分组')
			return;
		}
    let isConfirmed = window.confirm('确定要删除该分组及其分组下的事项吗？') //需要在confirm前加上window
    if(isConfirmed ==! true)  return  // 确定删除 执行以下代码
    let stateCopy = copyByJSON(this.state)
    let folderListLen = stateCopy.folderList.length
    FolderModel.destroy(folder.id, () => {
      let index = stateCopy.folderList.findIndex((item) => {
        return item.id == folder.id
      })
      // console.log(index)
      stateCopy.folderList.splice(index, 1)
      stateCopy.currentFolder = stateCopy.folderList[index % stateCopy.folderList.length]
      folder.deleted = true
      this.setState(stateCopy, () => {
        let folderLi = document.getElementsByClassName("folderList")[0].children  
        if(folderLi.length > 0){
          let folderLiArray = Array.prototype.slice.call(folderLi)  //将HTMLCollection转化为数组
          folderLiArray.forEach(element => {
            element.removeAttribute('class')
          });
          folderLi[index % folderLi.length].setAttribute('class', 'active')
        }
      })
    })
    stateCopy.todoList.forEach( item => {
      if( item.inFolder.id === folder.id){
        TodoModel.destroy(item.id, () => {
          item.deleted = true
          this.setState(stateCopy)
        })
      }
    })
  }
}

export default App;
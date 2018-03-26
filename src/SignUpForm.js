import React, { Component } from 'react';

export default function (props) {
    return (
        <form className="signUp" onSubmit={props.onSubmit.bind(this)} >
            <div className="row">
                {/* <label htmlFor="">邮箱</label> */}
                <input type="email" placeholder="注册邮箱" value={props.formData.email}
                    onChange={props.onChange.bind(null, 'email')} />
            </div>
            <div className="row">
                {/* <label htmlFor="">用户名</label> */}
                <input type="text" placeholder="用户名" value={props.formData.username}
                    onChange={props.onChange.bind(null, 'username')} />
            </div>
            <div className="row">
                {/* <label htmlFor="">密码</label> */}
                <input type="password" placeholder="请输入密码" value={props.formData.password}
                    onChange={props.onChange.bind(null, 'password')} />
            </div>
            <div className="row actions">
                <button type="submit">注册</button>
            </div>
        </form>
    )
}
import React, { Component } from 'react';
import './SignInOrSignUp.css'
import SignUpForm from './SignUpForm'
import SignInForm from './SignInForm'

export default class SignInOrSignUp extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selected: 'signUp'
		}
	}
	switch(e) {
		this.setState({
			selected: e.target.value
		})
	}

	render() {
		return (
			<div className="signInOrSignUp">
				<nav>
					<input type="radio" value="signUp" id="signUp" name="nav"
						className={this.state.selected === "signUp" ? "checked" : null}
						checked={this.state.selected === 'signUp'}
						onChange={this.switch.bind(this)}
					/>
					<label htmlFor="signUp">注册</label>

					<input type="radio" value="signIn" id="signIn" name="nav"
						className={this.state.selected === "signIn" ? "checked" : null}
						checked={this.state.selected === 'signIn'}
						onChange={this.switch.bind(this)}
					/>
					<label htmlFor="signIn">登录</label>
				</nav>
				<div className="panes" >
					{this.state.selected === 'signUp' ?
						<SignUpForm formData={this.props.formData}
							onChange={this.props.onChange}
							onSubmit={this.props.onSignUp}
						/>
						: null}
					{this.state.selected === 'signIn' ?
						<SignInForm formData={this.props.formData}
							onChange={this.props.onChange}
							onSubmit={this.props.onSignIn}
							onForgotPassword={this.props.onForgotPassword}
						/>
						: null}
				</div>
			</div>
		)
	}
}
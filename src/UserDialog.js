import React, { Component } from 'react'
import './UserDialog.css'
import copyByJSON from './copyByJSON'
import { signUp, signIn, sendPasswordResetEmail } from './leancloud'
import SignInOrSignUp from './SignInOrSignUp'
import ForgotPasswordForm from './ForgotPasswordForm'

class UserDialog extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedTab: 'signInOrSignUp',
			formData: {				
				username: '',
				password: '',
				email: ''
			}
		}
	}
	signUp(e) {
		e.preventDefault()
		let { username, password, email } = this.state.formData

		//表单数据验证
        let dataCorrect = true;
        if(username.length < 3){
            alert('用户名长度至少为3个字符，请重新填写')
			dataCorrect = false;
			return
        }
        if(password.length < 6){
            alert('密码长度至少为6位，请重新填写')
			dataCorrect = false;
			return
		}
		if(email.match(/@/) === null){
            alert('请填写正确的邮箱地址')
            dataCorrect = false;
        }
        if(!dataCorrect){
            return;
		}
		let success = (user) => {
			this.props.onSignUp.call(null, user)
		}
		let error = (error) => {
			switch (error.code) {
				case 202:
					alert('用户名已被占用')
					break
				default:
					alert('error')
					break
			}
		}
		signUp(username, password, email, success, error)
	}
	signIn(e) {
		e.preventDefault()
		let { username, password } = this.state.formData
		let success = (user) => {
			this.props.onSignIn.call(null, user)
		}
		let error = (error) => {
			switch (error.code) {	
                case 100:
                    alert('无法连接到服务器，请检查网络连接');
					break;
				case 124:
                    alert('请求超时，请检查网络连接是否正常');
                    break;
                case 201:
                    alert('密码不能为空');
                    break;
                case 211:
                    alert('用户不存在');
					break;
				case 210:
                    alert('用户名与密码不匹配');
                    break;
				default:
					alert(error)
					break
			}
		}
		signIn(username, password, success, error)
	}

	/**改变数据函数 */
	changeFormData(key, e) {
		let stateCopy = copyByJSON(this.state)
		stateCopy.formData[key] = e.target.value
		this.setState(stateCopy)
	}
	render() {
		return (
			<div className="UserDialog-Wrapper" >
				<div className="UserDialog">
					<h1>Just - Do</h1>
					{this.state.selectedTab === 'signInOrSignUp' ?
						<SignInOrSignUp formData={this.state.formData}
							onSignIn={this.signIn.bind(this)}
							onSignUp={this.signUp.bind(this)}
							onChange={this.changeFormData.bind(this)}
							onForgotPassword={this.showForgotPassword.bind(this)}
						/> :
						<ForgotPasswordForm formData={this.state.formData}
							onSubmit={this.resetPassword.bind(this)}
							onChange={this.changeFormData.bind(this)}
							onSignIn={this.returnToSignIn.bind(this)}
						/>
					}
					
				</div>
			</div>
		)
	}
	showForgotPassword() {
		let stateCopy = copyByJSON(this.state)
		stateCopy.selectedTab = 'forgotPassword'
		this.setState(stateCopy)
	}
	returnToSignIn(){
		let stateCopy = copyByJSON(this.state)
		stateCopy.selectedTab = 'signInOrSignUp'
		this.setState(stateCopy)
	}
	resetPassword(e){
        e.preventDefault();

        function successFn(success){
            alert('已发送重置密码邮件到邮箱，请去邮箱检查并重置密码');
            let stateCopy = copyByJSON(this.state);
            stateCopy.selectedTab = 'signInOrSignUp';
            this.setState(stateCopy);
        };

        function errorFn(error){
            switch(error.code){
                case 1:
                    alert('请不要往同一个邮件地址发送太多邮件');
                    break;
                case 205:
                    alert('找不到使用此邮箱注册的用户')
                    break;
            }
        }

        if(this.state.formData.email.match(/@/) === null){
            alert('请输入正确的邮箱地址')
            return
        }

        sendPasswordResetEmail(this.state.formData.email, successFn.bind(this), errorFn.bind(this));
    }
}
export default UserDialog;
import React from 'react';
class Welcome extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            date: new Date(),
            test: '1'
        }
        setInterval(() => {
            this.setState({
                date: new Date(),
                test: 'setInterval'
            })
        }, 1000)
        console.log('constructor 将props 和 state 初始化')
    }
    componentWillMount(){
        console.log('接下来就要 render ')
        this.setState({
            date: new Date(), // 更新 date
            test: 'componentWillMount'
        })
    }
    render() {
        console.log('开始 render ')
        return (
            <div>
                <h1>Hello, {this.props.name}</h1>
                <h2>{this.state.date.toString()}</h2>
                <p>{this.state.test}</p>
            </div>
        )
    }
    componentDidMount(){
        console.log('已经挂载到页面了')
        
    }
    componentWillReceiveProps(){
        // this.setState({
        //     date: new Date(), // 更新 date
        //     test: 'will receive（接受装备）'
        // })
    }
    shouldComponentUpdate(){

        return true
    }
    componentWillUpdate(){
        
    }
    componentDidUpdate(){
        
    }
    componentWillUnmount(){
        console.log('下山')
    }
}

export default Welcome
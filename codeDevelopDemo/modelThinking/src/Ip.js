import React from 'react'
import IpModel from '../model/IpModel'

class Ip extends React.Component{
    constructor(props) {
        super(props)
        this.IpModel = new IpModel()
        this.state = {
            ip: '127.0.0.1'
        }
    }

    componentDidMount() {
        this.IpModel.getIp().then((ip) => {
            this.setState({
                ip: ip
            })
        })
    }

    render() {
        return (
            <div>
                {this.state.ip}
            </div>
        )
    }
}

export default Ip
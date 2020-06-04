import React from 'react'
import WeatherModel from '../model/WeatherModel'

class Weather extends React.Component{
    constructor(props) {
        super(props)
        this.PiModel = new WeatherModel()
        this.state = {
            pi: '3.14'
        }
    }

    componentDidMount() {
        this.PiModel.getWeather().then((pi) => {
            console.log(pi)
            this.setState({
                pi: pi
            })
        })
    }

    render() {
        return (
            <div>
                北京: {this.state.pi}
            </div>
        )
    }
}

export default Weather
import React from 'react'
import Ip from './Ip'
import Weather from './Weather'

class App extends React.Component{
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <>
                <Ip />
                <Weather />
            </>
        )
    }
}

export default App
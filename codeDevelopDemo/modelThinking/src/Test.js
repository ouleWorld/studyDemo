import React from 'react'

class Test extends React.Component{
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div className="box">
                {this.props.children}
            </div>
        )
    }
}

export default Test
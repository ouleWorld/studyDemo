import React from 'react'

class ComponetA extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            number: 0
        }
    }

    render() {
        return (
            <div className="ComponetA">
                <button>Click Me!</button>
                {}
            </div>
        )
    }
}

export default ComponetA
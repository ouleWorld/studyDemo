import React from 'react'
import ReactDOM from 'react-dom'
const ComponentB = document.querySelector('ComponentB')

class Portal extends React.Component{
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }

    componentDidMount() {
        ComponentB.appendChild(this.el);
    }

    componentWillUnmount() {
        ComponentB.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el,
        );
    }
}

export default Protals
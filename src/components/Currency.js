import React, { Component } from 'react'
import { Symbols } from '../api/Api'
import './css/Currency.css'

class Currency extends Component {
    state = { allSymbols: {} };

    componentDidMount() {
        Symbols.then(res => {
            this.setState({allSymbols: res.data})
         }).catch(err => { 
            console.log(`Error: ${err}`);
         });
    }

    render() {
        const sym = this.state.allSymbols;
        const options = [];
        for (let key in sym) {
            options.push(<option key={key} value={key}>{sym[key]}</option>);
        }
        
        return (
            <div className='Currency'>
                <span> From </span>
                <select name='symbolFrom' onChange={this.props.onChange} value={this.props.symbols.from}>
                    {options}
                </select>
                <span> to </span>
                <select name='symbolTo' onChange={this.props.onChange} value={this.props.symbols.to}>
                    {options}
                </select>
            </div>
        )
    }
}

export default Currency
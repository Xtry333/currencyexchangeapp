import React, { Component } from 'react'
import './css/Exchange.css'

class Exchange extends Component {
    render() {
        const exchange = this.props.exchange;
        return (
            <div className='Exchange'>
                Real-time exchanging rate
                <div className='rate'>
                    {exchange.rate.toFixed(5)}
                </div>
                <div>
                    {exchange.from}
                    <button className='switch-icon' onClick={this.props.onSwitch} />
                    {exchange.to}
                </div>
            </div>
        )
    }
}

export default Exchange
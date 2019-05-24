import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import './css/ChartView.css'


class ChartView extends Component {
    render() {
        return (
            <div className='ChartView'>
                <Line data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
                    datasets: [{
                        label: 'My First dataset',
                        //backgroundColor: 'rgba(255, 99, 132, 1)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: [0, 10, 5, 2, 20, 30, 45, 1]
                    }]
                }} />
            </div>
        )
    }
}

export default ChartView
import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import './css/ChartView.css'

class ChartView extends Component {
    render() {
        return (
            <div className='ChartView'>
                <Line redraw data={{
                    labels: this.props.labels,
                    datasets: [{
                        label: `${this.props.historySymbols.from} -> ${this.props.historySymbols.to}`,
                        borderColor: 'rgb(200, 200, 200)',
                        backgroundColor: 'rgba(0, 0, 0, 0.15)',
                        lineTension: .1,
                        borderWidth: 1,
                        pointRadius: 0,
                        pointHitRadius: 3,
                        pointBorderWidth: 0,
                        data: this.props.history
                    }, {
                        label: 'Negative Trend',
                        lineTension: 0,
                        borderColor: 'rgb(255, 100, 100)',
                        backgroundColor: 'rgb(255, 100, 100)',
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHitRadius: 0,
                        hideInLegendAndTooltip: true,
                        fill: false,
                    }, {
                        label: 'Positive Trend',
                        lineTension: 0,
                        borderColor: 'rgb(100, 255, 100)',
                        backgroundColor: 'rgb(100, 255, 100)',
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHitRadius: 0,
                        hideInLegendAndTooltip: false,
                        fill: false,
                    }]
                }} options={{
                    legend: {
                        display: false
                    },
                    title: {
                        text: 'Historical exchange chart',
                        position: 'bottom',
                        display: true,
                        fontStyle: 'normal',
                        fontSize: 14
                    }
                }} />
            </div>
        );
    }
}

export default ChartView
import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import './css/ChartView.css'

class ChartView extends Component {
    state = { dataRange: 30 };

    lastXDays(x) {
        const lastX = [];
        const time =  new Date().getTime();
        for (let i = 0; i < x; i++) {
            lastX.push(new Date(time - (i * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10));
        }
        return lastX;
    }

    onClick = (event) => {
        const value = parseFloat(event.target.value);
        this.setState({ dataRange: value});
        //console.log(value);
    }

    render() {
        const days = this.lastXDays(this.state.dataRange);
        //const labels = this.props.labels.slice();
        const history = this.props.history.slice();

        //console.log(labels)
        const xs = [];
        const ys = [];

        for(let d of days) {
            xs.unshift(d);
            ys.unshift(history.pop());
        }

        return (
            <div className='ChartView'>
                <Line redraw data={{
                    labels: xs,
                    datasets: [{
                        label: `${this.props.historySymbols.from} -> ${this.props.historySymbols.to}`,
                        borderColor: 'rgb(200, 200, 200)',
                        backgroundColor: 'rgba(0, 0, 0, 0.15)',
                        lineTension: .1,
                        borderWidth: 1,
                        pointRadius: 0,
                        pointHitRadius: 3,
                        pointBorderWidth: 0,
                        data: ys
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
                <div className='buttons'>
                    <button onClick={this.onClick} value='3'>3D</button>
                    <button onClick={this.onClick} value='7'>1W</button>
                    <button onClick={this.onClick} value='30'>1M</button>
                    <button onClick={this.onClick} value='90'>3M</button>
                </div>
            </div>
        );
    }
}

export default ChartView
import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import './css/ChartView.css'

class ChartView extends Component {
    state = { dataRange: 30, trendVisible: true };

    findMaxes(ys, radius) {
        const maxs = [];
        const mins = [];
        if (!radius)
            radius = 4;
        let high = this.highest(ys, 0, radius);
        let low = this.lowest(ys, 0, radius);
        for (let i = 1; i < ys.length; i++) {
            let h = this.highest(ys, i, radius);
            if (h.x > high.x) {
                high = h;
            } else {
                let last = maxs[maxs.length - 1];
                if (maxs.length === 0 || last.x !== h.x)
                    maxs.push(h);
            }
            let l = this.lowest(ys, i, radius);
            if (l.x > low.x) {
                low = l;
            } else {
                let last = mins[mins.length - 1];
                if (mins.length === 0 || last.x !== l.x)
                    mins.push(l);
            }
        }
        return maxs.concat(mins).sort((a, b) => a.x - b.x);
    }

    // Return highest value in given radius and position in an array
    highest(arr, x, radius) {
        let n = arr[x];
        let len = arr.length;
        let index = x;
        for (let i = -radius; i < radius; i++) {
            if (x + i >= 0 && x + i < len) {
                if (n <= arr[x + i]) {
                    index = x + i;
                    n = arr[index]
                }
            }
        }

        return { x: index, y: n };
    }

    // Return lowest value in given radius and position in an array
    lowest(arr, x, radius) {
        let n = arr[x];
        let len = arr.length;
        let index = x;
        for (let i = -radius; i < radius; i++) {
            if (x + i >= 0 && x + i < len) {
                if (n >= arr[x + i]) {
                    index = x + i;
                    n = arr[index]
                }
            }
        }
        return { x: index, y: n };
    }

    // Returns an array of dates of last X days
    lastXDays(x) {
        const lastX = [];
        const time = new Date().getTime();
        for (let i = 0; i < x; i++) {
            lastX.push(new Date(time - (i * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10));
        }
        return lastX;
    }

    // Toggle trend line visibility
    onShowHideTrend = () => {
        this.setState({ trendVisible: !this.state.trendVisible })
    }

    // Fires when button changing the range of historical data has been clicked
    onClick = (event) => {
        const value = parseFloat(event.target.value);
        this.setState({ dataRange: value });
    }

    render() {
        const days = this.lastXDays(this.state.dataRange);
        //const labels = this.props.labels.slice();
        const history = this.props.history.slice();

        // Xs -> Labels (date), Ys -> exchange values for each day
        const xs = [], ys = [];

        // Place data with labels into display array
        for (let d of days) {
            xs.unshift(d);
            ys.unshift(history.pop());
        }

        // Get min/max and split it into positive and negative
        let maximas = this.findMaxes(ys, Math.floor(this.state.dataRange / 10));
        let N = [], P = [];
        if (this.state.trendVisible) {
            let prev = { x: xs[0], y: ys[0] };
            for (let i = 0; i < maximas.length; i++) {
                const e = maximas[i];
                e.x = xs[e.x];
                if (prev.y > e.y) {
                    N.push({ x: null, y: NaN });
                    N.push(prev);
                    N.push(e);
                } else if (prev.y < e.y) {
                    P.push({ x: null, y: NaN });
                    P.push(prev);
                    P.push(e);
                }
                prev = e;
            }
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
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHitRadius: 0,
                        hideInLegendAndTooltip: true,
                        fill: false,
                        spanGaps: false,
                        data: N
                    }, {
                        label: 'Positive Trend',
                        lineTension: 0,
                        borderColor: 'rgb(100, 255, 100)',
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHitRadius: 0,
                        hideInLegendAndTooltip: true,
                        fill: false,
                        spanGaps: false,
                        data: P
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
                    <button className='trend-line-showhide' onClick={this.onShowHideTrend}>Trend Line</button>
                </div>
            </div>
        );
    }
}

export default ChartView
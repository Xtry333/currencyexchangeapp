import React, { Component } from 'react';
import Exchange from './components/Exchange'
import Currency from './components/Currency'
import ChartView from './components/ChartView'
import { RealTime, Historical } from './api/Api'
import './App.css';

class App extends Component {
    state = {
        symbols: { from: 'EUR', to: 'PLN' },
        exchange: { rate: 4.26, from: 'EUR', to: 'PLN' },
        loadingRate: false,
        history: { symbols: { from: '', to: '' }, ys: [], labels: [], reqNum: 0 }
    };

    componentDidMount() { 
        this.setExchangeRate(this.state.symbols);
        this.setHistoricalData(this.state.symbols);
    };

    onCurrencyChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        const c = this.state.symbols; // current symbols
        const symbols = { from: c.from, to: c.to };
        if (name === 'symbolFrom') symbols.from = value;
        if (name === 'symbolTo') symbols.to = value;
        if (symbols.to === symbols.from) { this.onCurrencySwitch(); return; }
        this.setState({ symbols });
        this.setExchangeRate(symbols);
        this.setHistoricalData(symbols);
    }

    onCurrencySwitch = () => {
        const c = this.state.exchange; // current symbols
        const symbols = { from: c.to, to: c.from };
        const exchange = {
            rate: (1.0 / this.state.exchange.rate),
            from: c.to,
            to: c.from
        };
        this.setState({ symbols, exchange });
    }

    setExchangeRate(symbols) {
        this.setState({ loadingRate: true });
        RealTime.get('/', {
            params: {
                from_currency: symbols.from,
                to_currency: symbols.to
            },
        }).then(res => {
            let data = res.data;
            if (data && data['Realtime Currency Exchange Rate'] && data['Realtime Currency Exchange Rate']['5. Exchange Rate']) {
                let rate = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']); // Oh come on, that path, really...? ._.
                const exchange = { rate, from: symbols.from, to: symbols.to };
                this.setState({ exchange, loadingRate: false });
            } else {
                console.log('Error: Could not get Currency Exchange Rate from API');
                console.log(res.data);
            }
        }).catch(err => {
            console.log(`Error: ${err}`);
        });
    }

    setHistoricalData(symbols) {
        Historical.get('/', {
            params: {
                from_symbol: symbols.from,
                to_symbol: symbols.to
            },
        }).then(res => {
            //const history = this.state.history;
            const data = res.data;
            if (data) {
                const meta = data['Meta Data'];
                const raw = data['Time Series FX (Daily)'];
                if (!meta) return;
                if (!data) return;

                //console.log(raw);

                const labels = [], ys = [];
                //history.labels.splice(0, history.labels.length);
                //history.ys.splice(0, history.ys.length);

                for (let key in raw) {
                    labels.unshift(key);
                    ys.unshift(1.0 / raw[key]['4. close']);
                }

                const history = { labels, ys };
                history.reqNum = 1 + this.state.history.reqNum
                history.symbols = { from: meta['2. From Symbol'], to: meta['3. To Symbol'] };

                this.setState({ history });
            } else {
                console.log('Error: Could not get Historical Data from API');
                console.log(res.data);
            }
        }).catch(err => {
            console.log(`Error: ${err}`);
        });
    }

    render() {
        return (
            <div className='App'>
                <h1 className='title'>Select exchange currencies</h1>
                <div>
                    <Currency onChange={this.onCurrencyChange} symbols={this.state.symbols}></Currency>
                    <Exchange onSwitch={this.onCurrencySwitch} exchange={this.state.exchange} loading={this.state.loadingRate}></Exchange>
                </div>
                <ChartView key={`REQ${this.state.history.reqNum}`} history={this.state.history}></ChartView>
            </div>
        )
    };


};

export default App;

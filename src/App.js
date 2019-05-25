import React, { Component } from 'react';
import Exchange from './components/Exchange'
import Currency from './components/Currency'
import ChartView from './components/ChartView'
import { RealTime, Historical } from './api/Api'
import './App.css';

class App extends Component {
    state = {
        symbols: { from: 'EUR', to: 'PLN' },
        exchange: { rate: 1.0, from: 'EUR', to: 'PLN' },
        loadingRate: false,
        history: [],
        labels: [],
        historySymbols: { from: '', to: '' },
        refreshTimer: {}
    };

    // Loads exchange data on site visit
    componentDidMount() {
        // this.setExchangeRate(this.state.symbols);
        // this.refreshTimer = setInterval(() => {
        //     this.setExchangeRate(this.state.symbols);
        // }, 1000 * 60 * 5);
        // this.setHistoricalData(this.state.symbols);
    };

    // Fires when currency symbol has been changed
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

    // Fires when currencies had been switched, either by a button, or manually
    onCurrencySwitch = () => {
        const c = this.state.exchange; // current symbols
        const symbols = { from: c.to, to: c.from };
        const exchange = {
            rate: (1.0 / this.state.exchange.rate),
            from: c.to,
            to: c.from
        };
        const history = this.state.history;
        for (let i = 0; i < history.length; i++) {
            history[i] = 1.0 / parseFloat(history[i]);
        }

        this.setState({ symbols, exchange, history, historySymbols: symbols });
    }

    // Connects to an api in order to get real-time exchange rates and sets it
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

    // Connects to an api in order to get historical exchange rates, and sets it
    setHistoricalData(symbols) {
        this.setState({ history: [] });
        Historical.get('/', {
            params: {
                from_symbol: symbols.from,
                to_symbol: symbols.to
            },
        }).then(res => {
            const data = res.data;
            const meta = data['Meta Data'];
            const raw = data['Time Series FX (Daily)'];
            if (meta && raw) {
                //console.log(meta);
                //console.log(raw);

                const labels = this.state.labels, history = this.state.history;
                labels.splice(0, labels.length);
                history.splice(0, history.length);

                for (let key in raw) {
                    labels.unshift(key);
                    history.unshift(raw[key]['4. close']);
                }

                const historySymbols = { from: meta['2. From Symbol'], to: meta['3. To Symbol'] };

                this.setState({ history, labels, historySymbols });
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
                {/* <ChartView key={`REQ${this.state.history.reqNum}`} history={this.state.history}></ChartView> */}
                <ChartView history={this.state.history} labels={this.state.labels} historySymbols={this.state.historySymbols}></ChartView>
            </div>
        )
    };
};

export default App;

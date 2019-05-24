import React, { Component } from 'react';
import Exchange from './components/Exchange'
import Currency from './components/Currency'
import ChartView from './components/ChartView'
import { RealTime, Historical } from './api/Api'
import './App.css';

class App extends Component {
    state = {
        symbols: { from: 'EUR', to: 'PLN' },
        exchange: { rate: 4.2, from: 'EUR', to: 'PLN' },
        loadingRate: false
    };

    componentDidMount() { };

    onCurrencyChange = async (event) => {
        const value = event.target.value;
        const name = event.target.name;
        const c = this.state.symbols; // current symbols
        const symbols = { from: c.from, to: c.to };
        if (name === 'symbolFrom') symbols.from = value;
        if (name === 'symbolTo') symbols.to = value;
        if (symbols.to === symbols.from) { this.onCurrencySwitch(); return }
        this.setExchangeRate(symbols);
        this.setState({ symbols });
    }

    onCurrencySwitch = () => {
        const c = this.state.symbols; // current symbols
        const symbols = { from: c.to, to: c.from };
        const exchange = {
            rate: (1.0 / this.state.exchange.rate),
            from: c.to,
            to: c.from
        };
        this.setState({ symbols, exchange });
    }

    setExchangeRate(symbols) {
        RealTime.get('/', {
            params: {
                from_currency: symbols.from,
                to_currency: symbols.to
            },
        }).then(res => {
            let data = res.data;
            if (data && data["Realtime Currency Exchange Rate"] && data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]) {
                let rate = parseFloat(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]); // Oh come on, that path, really...? ._.
                const exchange = { rate, from: symbols.from, to: symbols.to };
                this.setState({ exchange });
            } else {
                console.log('Error: Could not get Currency Exchange Rate from API');
            }
        }).catch(err => {
            console.log(`Error: ${err}`);
        });
    }

    setHistorical(symbols) {
        Historical.get('/', {
            params: {
                from_symbol: symbols.from,
                to_symbol: symbols.to
            },
        }).then(res => {

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
                <ChartView></ChartView>
            </div>
        )
    };


};

export default App;

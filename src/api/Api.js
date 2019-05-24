import Axios from 'axios'
import Auth from './AuthKey'

/* AuthKey.js should look like this:
export default {
    Key: <public_key>
}
*/

export const RealTime = Axios.create({
    baseURL: 'https://www.alphavantage.co/query',
    params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        apikey: Auth.Key,
    }
});

export const Historical = Axios.create({
    baseURL: 'https://www.alphavantage.co/query',
    params: {
        function: 'FX_DAILY',
        apikey: Auth.Key,
        datatype: 'json'
    }
});

export const Symbols = Axios.get('https://openexchangerates.org/api/currencies.json');

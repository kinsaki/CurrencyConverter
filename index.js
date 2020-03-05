const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: false }));

const acceptPost = () => {
	app.post('/', function(request, response) {
		const currencyFrom = _.get(request, 'body.currencyFrom');
		const currencyFromValue = _.get(request, 'body.currencyFromValue');
		const currencyTo = _.get(request, 'body.currencyTo');	
		getCurrencies(currencyFrom, currencyFromValue, currencyTo);

		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end();
	});
};

const getCurrencies = (currencyFrom, currencyFromValue, currencyTo) => {
	const exchangeApi = axios.create({
		baseURL: 'https://api.exchangerate-api.com/v4/latest/',
		timeout: 1500,
		headers: {'Content-Type': 'text/plain'}
	});

	exchangeApi.get(currencyFrom)
		.then(function (response) {
			let parsedRates = _.get(response, 'data.rates');
			let currencyToValue = _.get(parsedRates, currencyTo);
			convertCurrencies(currencyFromValue, currencyToValue, currencyTo);
		})
		.catch(function (error) {
			console.log(error);
		});
};

const convertCurrencies = (currencyFromValue, currencyToValue, currencyTo) => {
	const convertedValue = currencyFromValue * currencyToValue;
	console.log(convertedValue.toFixed(2), currencyTo);
};

app.listen(port, () => console.log('Successfully started currency converter!'));
acceptPost();
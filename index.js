const express = require('express');
const https = require('https');

const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: false }));

const acceptPost = () => {
	app.post('/', function(request, response) {
		const currencyFrom = request.body['currencyFrom'];
		const currencyFromValue = request.body['currencyFromValue'];
		const currencyTo = request.body['currencyTo'];
		getCurrencies(currencyFrom, currencyFromValue, currencyTo);

		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end();
	});
};

const getCurrencies = (currencyFrom, currencyFromValue, currencyTo) => {
	https.get(`https://api.exchangerate-api.com/v4/latest/${currencyFrom}`, (res) => {

	res.on('data', (data) => {
		const parsedRates = (JSON.parse(data)['rates']);
		const currencyToValue = parsedRates[currencyTo];
		convertCurrencies(currencyFromValue, currencyToValue, currencyTo);
	});

	}).on('error', (err) => {
		console.log('Error: ' + err.message);
	});
};

const convertCurrencies = (currencyFromValue, currencyToValue, currencyTo) => {
	const convertedValue = currencyFromValue * currencyToValue;
	console.log(convertedValue.toFixed(2), currencyTo);
};

app.listen(port, () => console.log('Successfully started currency converter!'));
acceptPost();
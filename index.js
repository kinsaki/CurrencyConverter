const express = require('express')
const https = require('https')
const message = require('js-message')
const bodyParser = require('body-parser')

const app = express()
const port = 3000
app.listen(port, () => console.log(`Successfully started currency converter!`))
app.use(bodyParser.urlencoded({ extended: true }))

const start = () => {
	return new Promise(resolve => {
		acceptPost()
	})
}

const acceptPost = () => {
	app.post('/', function(request, response, next) {
	currencyFrom = request.body['currencyFrom']
	currencyFromValue = request.body['currencyFromValue']
	currencyTo = request.body['currencyTo']

	response.writeHead(200, {'Content-Type': 'text/html'})
	response.end()
	getCurrencies()
})
}

const getCurrencies = () => {
	https.get(`https://api.exchangerate-api.com/v4/latest/${currencyFrom}`, (res) => {

	res.on('data', (data) => {
	parsedRates = (JSON.parse(data)['rates'])
	currencyToValue = parsedRates[currencyTo]
	convertCurrencies()
	})

	}).on("error", (err) => {
	  console.log("Error: " + err.message)
	})
}

const convertCurrencies = () => {
	convertedValue = currencyFromValue * currencyToValue
	console.log(convertedValue.toFixed(2), currencyTo)
}

start()
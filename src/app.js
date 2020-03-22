const express = require('express');
const pdf = require('./lib/pdf');
const Logger = require('@celib/logger');
const indexRouter = require('./routes/index');
const cors = require('cors');

Logger.configure('machine', {
	vendor: '-',
	level: process.env.LOG_LEVEL
});
Logger.configureLog();
Logger.configureRouteLog();

const { log } = Logger;
log.info('Starting App');
const app = express();
pdf.configure({
	headless: true,
	ignoreHTTPSErrors: true,
	args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox'],
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
	log.debug('New Request', { route: req.url });
	if (req.url === '/pdf/url') {
		// pdfs generated from urls take much longer to generate because of the page.goto step
		req.setTimeout(10000);
	}
	next();
});
app.use(Logger.routeLogger())
app.use('/pdf', indexRouter);
app.use('/siteinfo/healthcheck', (_req, res) => { res.sendStatus(200) });
app.use((err, req, res, next) => {
	res.status(400).send();
});

module.exports = app;

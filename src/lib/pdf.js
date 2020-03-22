const util = require('util');
const puppeteer = require('puppeteer');
const log = {
	debug: console.log,
	info: console.log,
	error: console.log,
	warn: console.log,
}

class PDFGenerator {
	async configure(options) {
		log.info('Starting puppeteer', options);
		this.browser = puppeteer.launch(options);
		this.browser.then(() => {
			log.info('Puppeteer started', options);
		}).catch(err => {
			log.error('Puppeteer failed to start', { err });
		});
		this.pageDefaults = {
			waitUntil: "networkidle2",
			timeout: 10000
		}
	}

	close() {
		return new Promise((resolve, reject) => {
			this.browser.then(browser => {
				browser.close()
					.then(() => {
						log.info('Successfully closed puppeteer');
						resolve();
					})
					.catch((err) => {
						log.warn('Unable to successfully close puppeteer', { err });
						reject();
					});
			});
		});
	}

	renderPDF(page, options) {
		return new Promise((resolve, reject) => {
			let timeout = setTimeout(() => {
				log.error('Timeout in renderPDF, unable to create PDF', options);
				reject(new Error("Timeout in renderPDF, unable to create PDF"));
			}, 120000);
			page.pdf({ printBackground: true, ...options }).then(pdf => {
				page.close().then(() => {
					clearTimeout(timeout);
					log.debug('Successfully created PDF', options);
					resolve(pdf);
				}).catch((err) => {
					log.error('Unable to close page after creating PDF', { err });
					reject();
				});
			}).catch((err) => {
				log.error('Unable to create PDF', { err });
				reject();
			});
		})
	}

	async renderURL(url, pdfOptions, pageOptions) {
		const browser = await this.browser;
		const page = await browser.newPage();
		await page.goto(url, { ...this.pageDefaults, timeout: 10000, ...pageOptions });
		return this.renderPDF(page, pdfOptions);
	}

	async renderHTMLString(html, pdfOptions) {
		const browser = await this.browser;
		const page = await browser.newPage();
		await page.setContent(html);
		return this.renderPDF(page, pdfOptions);
	}
}


module.exports = new PDFGenerator;

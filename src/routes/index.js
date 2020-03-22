const express = require('express');

const router = express.Router();

const pdf = require('../lib/pdf');
const log = {
  debug: console.log,
  info: console.log,
  error: console.log,
  warn: console.log,
}

router.post('/html', async (req, res, next) => {
  log.debug('Requesting PDF from HTML', req.body);
  try {
    let hasHeader = !!req.body.headertemplate;
    let hasFooter = !!req.body.footertemplate;
    let top = hasHeader ? "80px" : "50px";
    let bottom = hasFooter ? "80px" : "50px";
    const defaultOptions = {
      printBackground: true,
      format: 'A4',
      margin: {
        top,
        bottom,
        left: '50px',
        right: '50px',
      }
    };

    let displayHeaderFooter = hasFooter || hasHeader;
    let headerTemplate = req.body.headertemplate || '<div></div>';
    let footerTemplate = req.body.footertemplate || '<div></div>';

    const file = await pdf.renderHTMLString(req.body.html,
      {
        ...defaultOptions,
        displayHeaderFooter,
        headerTemplate,
        footerTemplate,
      },
      req.body.pageOptions);
    log.info('Successful PDF creation');
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'inline');
    res.status(201);
    res.end(file, 'binary');
  } catch (err) {
    log.error('PDF Generation Error - from HTML', { err, ...req.body });
    next(err);
  }
});
router.post('/url', async (req, res, next) => {
  log.debug('Requesting PDF from URL', req.body);
  try {
    const defaultOptions = {
      printBackground: true
    };
    const file = await pdf.renderURL(req.body.url,
      { ...defaultOptions, ...req.body.pdfOptions },
      req.body.pageOptions);
    log.debug('Successfully retrieved PDF from URL', req.body);
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'inline');
    res.status(201);
    res.end(file, 'binary');
  } catch (err) {
    log.error('PDF Generation Error - from URL', { err, ...req.body });
    //does it make sense to log the body here so we can see if any of the parameters could lead to an error, e.g., seeing that someone requested test.abc as the url?
    next(err);
  }

});

// router.post('/url/ppt', async (req, res, next) => {
//   log.debug('Requesting PDF from URL', req.body);
//   try {
//     const defaultOptions = {
//       printBackground: true
//     };
//     const file = await pdf.renderURL(req.body.url,
//       { ...defaultOptions, ...req.body.pdfOptions },
//       req.body.pageOptions);
//     log.debug('Successfully retrieved PDF from URL', req.body);
//     res.set('Content-Type', 'application/pdf');
//     res.set('Content-Disposition', 'inline');
//     res.status(201);
//     res.end(file, 'binary');
//   } catch (err) {
//     log.error('PDF Generation Error - from URL', { err, ...req.body });
//     //does it make sense to log the body here so we can see if any of the parameters could lead to an error, e.g., seeing that someone requested test.abc as the url?
//     next(err);
//   }
// });

module.exports = router;

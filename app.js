var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var i18n = require('i18n');


var indexRouter = require('./routes/index');
var contactRouter = require('./routes/contact');
var companyRouter = require('./routes/company');
var servicesRouter = require('./routes/services');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

i18n.configure({
  locales: ['en', 'de', 'sr'],
  defaultLocale: 'en',
  cookie: 'locale',
  directory: path.join(__dirname, 'locales')
});

app.use(i18n.init);

app.use(function (req, res, next) {
  var url = req.url;

  var mainBgImages = {
    '/':'',
    '/company':'tm-about-bg',
    '/services':'tm-services-bg',
    '/contact':'tm-contact-bg',
  };

  res.locals = {
    chosenUrl: url,
    mainBgImage: mainBgImages[url],
    __: i18n.__,
    // siteTitle: "My Website's Title",
    // pageTitle: "The Home Page",
    // author: "Cory Gross",
    // description: "My app's description",
  };

  next();
});

app.use('/contact', contactRouter);
app.use('/services', servicesRouter);
app.use('/company', companyRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

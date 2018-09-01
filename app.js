 var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var RateLimit = require('express-rate-limit');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);

var apiLimiter = new RateLimit({
    windowMs: 24*60*60* 1000, 	  // 24 h
    max: 10,                	  // 10 次
    delayMs: 0,                   // disabled 延迟响应
    handler: function (req, res) { // 响应格式
        res.format({
            json: function () {
                res.status(429).json(util.error('请24小时之后再来领取', 429, null));
            },
            html: function () {
                res.status(429).end('请24小时之后再来领取');
            }
        });
    }
});
app.use('/getmztoken', apiLimiter);
app.use('/getmztoken', usersRouter);

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

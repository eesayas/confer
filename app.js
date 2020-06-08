const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', socket => {

  //setup socket io listeners
  socket.on('RemoteJoined', alertInitiator);
  socket.on('CallRemotePeer', makeRemotePeer);
  socket.on('SendRemoteData', acceptRemotePeer);
});

server.listen(3000);

//functions to be called by socket.io listeners
function makeRemotePeer(data){
  this.broadcast.emit('MakeRemotePeer', data);
}

function acceptRemotePeer(data){
  // console.log('accept');
  this.broadcast.emit('AcceptRemotePeer', data);
}

function alertInitiator(){
  this.broadcast.emit('CreateMeeting');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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


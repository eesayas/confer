require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const engine = require("ejs-mate");
const { ExpressPeerServer } = require("peer");


// require routers
const indexRouter = require('./routes/index');

const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3002;

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.engine("ejs", engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// mount routes
app.use("/peerjs", peerServer);
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

// config socket.io
io.on("connection", socket => {
  
  socket.on("join-room", (room_id, user_id) => {
    socket.join(room_id);
    // upon entry
    socket.to(room_id).broadcast.emit("user-connected", user_id);
    
    // upon disconnect
    // socket.on("disconnect", () => {
    //   socket.to(room_id).broadcast.emit("user-disconnected", user_id);
    // });
  });
});

server.listen(port, () => console.log("iSeeYa server running..."));
module.exports = app;
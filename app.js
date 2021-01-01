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
  debug: 2,
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

// will use db later
const rooms = {};

// config socket.io
io.on("connection", socket => {

  // upon receiving "join room", add socket.id to room
  socket.on("join room", (room_id) => {
    // join room
    socket.join(room_id);

    if(rooms[room_id]){
      rooms[room_id].push(socket.id);
    } else{
      rooms[room_id] = [socket.id];
    }

    // get other users in the room
    const others = rooms[room_id].filter(id => id !== socket.id);

    // if there are other people in the room 
    if(others.length){
      // send "user joined" with the socket.id of the joiner which is me
      // DEV NOTE: others will call me once they receive my socket.id
      socket.to(room_id).broadcast.emit("user joined", socket.id);
    }
  });

  // upon receiving "offer" emit payload to target
  socket.on("offer", payload => {
    io.to(payload.target).emit("offer", payload);
  });

  // upon receiving "answer" emit answer payload to target
  socket.on("answer", payload => {
    io.to(payload.target).emit("answer", payload);
  });


  socket.on("join-room", (room_id, user_id) => {

    // join a room
    socket.join(room_id);
    // upon entry
    socket.to(room_id).broadcast.emit("user-connected", user_id);
    
    // upon disconnect
    socket.on("disconnect", () => {
       socket.to(room_id).broadcast.emit("user-disconnected", user_id);
    });
  });
});

server.listen(port, () => console.log("iSeeYa server running..."));
module.exports = app;

let peer = require('simple-peer');
let socket = io();

navigator.mediaDevices.getUserMedia({video: true, audio: true})

.then(stream => {
    

})
.catch(err => document.write(err));
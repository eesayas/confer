let peer = require('simple-peer');
const video = document.getElementById('your-video');

navigator.mediaDevices.getUserMedia({video: true, audio: true})
.then(stream => {  
    video.srcObject = stream;
    video.play();
    

})
.catch(err => document.write(err));
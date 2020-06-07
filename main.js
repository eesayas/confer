let Peer = require('simple-peer');
let socket = io();
const yourVideo = document.getElementById('your-video');
const otherVideo = document.getElementById('other-video');
let client = {}; 

navigator.mediaDevices.getUserMedia({video: true, audio: true})
.then(stream => {  
    //show your own video
    yourVideo.srcObject = stream;
    yourVideo.play();

    //tell backend to create a host peer
    if(location.hash === '#init'){
        socket.emit('CreateHostPeer'); 
    }

    //this will create a host peer
    function createHostPeer(){
        //initialize a host peer
        let peer = new Peer({ initiator: true, stream: stream, trickle: false });

        //fires when host receives video stream from others
        peer.on('stream', function(stream){
            //show video of other
            otherVideo.srcObject = stream; 
            otherVideo.play();
        });

        client.incoming = false; //no signal incoming from others yet

        /* since this is a host, this event will fire automatically
        via socket.io this will send out data from the host to other */
        peer.on('signal', data => {
            if(!client.incoming) socket.emit('SendHostData', data);
        });
        
        client.peer = peer; //store peer for later use
    }

    //this will create a normal peer (this is host's other)
    function createNormalPeer(hostData){
        //initialize normal peer
        let peer = new Peer({ initiator: false, stream: stream, trickle: false });

        //fires when normal receives video stream from host
        peer.on('stream', function(stream){
            //show video of host
            otherVideo.srcObject = stream; 
            otherVideo.play();
        });

        /* fires when normal receives data from host (hostData from SendHostData emit)
        via socket.io this will send out it own data to host*/
        peer.on('signal', data => {
            socket.emit('SendNormalData', data);
        });

        peer.signal(hostData); //receive host's data
        client.peer = peer; //store peer for later use
    }

    //this function is when host receives data
    function hostReceiveData(otherData){

        console.log('dis is not happening!');
        client.incoming = true;
        let peer = client.peer; // retrieve peer;
        peer.signal(otherData); //receive data;
    }

    //set up socket listeners
    socket.on('MakeHostPeer', createHostPeer);
    socket.on('MakeNormalPeer', createNormalPeer);
    socket.on('HostReceiveData', hostReceiveData);
})
.catch(err => document.write(err));
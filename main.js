let Peer = require('simple-peer');
let socket = io();
const myVideo = document.getElementById('your-video');
const remoteVideo = document.getElementById('other-video');
let client = {};


navigator.mediaDevices.getUserMedia({video: true, audio: true})
.then(stream => {  
    //show your own video
    myVideo.srcObject = stream;
    myVideo.play();

    //this will configure my peer
    function myPeer(){
        console.log('initiate');

        client.hasRemote = false;
        //an initiator peer (you)
        let peer = new Peer({ initiator: true, stream: stream, trickle: false });

        //set the video of remote peer
        peer.on('stream', stream => {
            remoteVideo.srcObject = stream; 
            remoteVideo.play();
        });

        //this sends my data to remote peer (will fire right away)
        peer.on('signal', data => {
            if(!client.hasRemote) socket.emit('CallRemotePeer', data);
        });

        //this receives data from remote peer
        // socket.on('AcceptRemotePeer', data => {
        //     peer.signal(data);
        // });

        client.peer = peer;
    }

    //this will receive data from remote peer
    function receiveRemoteData(data){
        client.hasRemote = true;
        let peer = client.peer;
        peer.signal(data);
    }

    //this will configure remote peer which will receive my data
    function remotePeer(myData){
        console.log('remote');
        //a remote peer
        let peer = new Peer({ initiator: false, stream: stream, trickle: false });

        //set the video of remote peer
        peer.on('stream', stream => {
            remoteVideo.srcObject = stream; 
            remoteVideo.play();
        });

        //this will send back data to myPeer
        peer.on('signal', data => {
            socket.emit('SendRemoteData', data);
        });

        peer.signal(myData); //receive myData

        client.peer = peer;
    }
    
    //if someone entered the meeting via non init route, let server know
    if(location.hash != '#init') socket.emit('RemoteJoined');

    //when CreateMeeting starts supply initiator role depending on hash
    socket.on('CreateMeeting', () => {
        if(location.hash == '#init') myPeer();
    });

    //when remote peer gets data from intitator, create its own peer
    socket.on('MakeRemotePeer', data => {
        remotePeer(data);
    });

    socket.on('AcceptRemotePeer', data => {
        receiveRemoteData(data);
    });
})
.catch(err => document.write(err));

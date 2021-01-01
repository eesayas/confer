const socket = io("https://iseeya.eesayas.com/");

// my ui
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

// configure my peer
const configuration = {
    iceServers: [
        {
            urls: "stun:stun.eesayas.com:5349"
        },
        {
            urls: "turn:turn.eesayas.com:3478",
            credential: TURN_PASS,
            username: TURN_USER, 
        }
    ]
};

// DEV NOTE: need to create multiple peer (node) for > 2 users
// may not be important if moving on to SFU architecture
const myPeer = new RTCPeerConnection(configuration);

// define camera over multiple browers
const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// get my video and audio
navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(myStream => {
    // add my stream to my video element
    addVideoStream(myVideo, myStream);

    // emit "join room" message for server add me to a room
    socket.emit("join room", ROOM_ID);

    // upon receiving "user joined" message call joined user
    socket.on("user joined", joinedUserId => {
        // call joined user
        callUser(joinedUserId);
    });

    // upon receiving "offer" handle receive offer
    socket.on("offer", payload => {
        // receive offer
        receiveOffer(payload);
    });

    // upon receiving "answer" handle answer
    socket.on("answer", payload => {
        // handle answer
        handleAnswer(payload);
    });

    // on new user enter room send my stream to them
    socket.on("user-connected", user_id => {
        connectToNewUser(user_id, stream);
    }); 
});

/**
 * @desc This will be used to call a remote user
 * @param remoteUserId: the remote user id
 */
const callUser = (remoteUserId) => {
    
    // create an offer which will be sent to remote peer
    myPeer.createOffer()
        
        //set local description as per webrtc specs
        .then(offer => {
            myPeer.setLocalDescription(offer);
        })

        // after local description is set send offer to remote user
        .then(() => {
            let payload = {
                target: remoteUserId,
                caller: socket.id,
                sdp: myPeer.localDescription,
            }

            // send offer to remote user via the server
            socket.emit("offer", payload);
        })
        
        // on error
        .catch(e => console.log(e));
}

/**
 * @desc This will be used to receive offers from remote users
 * @param payload: the incoming payload data from remote user
 */
const receiveOffer = (payload) => {
    // set remote description 
    let remoteDesc = new RTCSessionDescription(payload.sdp);
    myPeer.setRemoteDescription(remoteDesc)

        // create an answer for 
        .then(() => {
            return myPeer.createAnswer();
        })

        // set local description
        .then(answer => {
            return myPeer.setLocalDescription(answer);
        })

        // send answer to remote user via the server
        .then(() => {
            let payload = {
                target: payload.caller,
                caller: socket.id,
                sdp: myPeer.localDescription
            }
            // send to server
            socket.emit("answer", payload);
        });
}

/**
 * @desc This will handle the answers
 * @param payload: the incoming payload answer from remote user
 */
const handleAnswer = (payload) => {
    let remoteDesc = new RTCSessionDescription(payload.sdp);
    myPeer.setRemoteDescription(remoteDesc);
}


let videos = [];
const peers = {};


// trigger this function if you want to share your screen
const shareScreen = () => {
    // add screen share
    navigator.mediaDevices.getDisplayMedia({audio: true, video: true}).then(stream => {
        const video = document.getElementById("spotlight");
        video.muted = true;
        video.srcObject = stream;
        video.setAttribute("autoplay", true);
        video.setAttribute("playsInline", true);
        video.addEventListener("loadedmetadata", () => {
            video.play();
        });

        for (let [key, value] of myPeer._connections.entries()) {
            console.log(key)
            myPeer.call(key, stream, {metadata : {shareScreen: true}});
        }
    }).catch(err => {

    });
}


myPeer.on("open", id => {
    socket.emit("join-room", ROOM_ID, id);
});

socket.on("user-disconnected", user_id => {
    if(myPeer.connections[user_id]){
        if(myPeer.connections[user_id][0].remoteStream) videos.find( video => video.srcObject.id === myPeer.connections[user_id][0].remoteStream.id).remove();
        myPeer.connections[user_id][0].close();
    }
});

// connect to new user
connectToNewUser = (user_id, stream) => {
    // call new user
    const call = myPeer.call(user_id, stream);
    const video = document.createElement("video");

    // on receiving stream
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });

    // when call is closed
    call.on("close", () => {
        console.log("end call");
	    video.remove();
    });

    // add to peers
    peers[user_id] = call;
}

// add video stream to video element
addVideoStream = (video, stream) => {;
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });

    // add element to grid
    videoGrid.append(video);
    videos.push(video);
    if( $("video").length > 1){
        $("#video-grid").css("grid-template-columns", "1fr 1fr");
    }
}

myPeer.on("error", (err) => {
    console.log(err);
});
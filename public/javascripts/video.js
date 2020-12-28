const socket = io("https://iseeya.eesayas.com/");
const videoGrid = document.getElementById("video-grid");

let videos = [];

const myPeer = new Peer(undefined, {
    secure: SECURE,
    path: "/peerjs",
    host: HOST, //name of website
    port: PORT, //port
    config: {"iceServers": [
        { url: "stun:stun.eesayas.com:5349" },
        { url: "turn:turn.eesayas.com:3478?transport=tcp", username:"iseeya", credential: "04301998" }
    ]},
    debug: 2,
});

// my video, mute my own audio
const myVideo = document.createElement("video");
myVideo.muted = true;

const peers = {};

// define camera over multiple browers
const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

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

navigator.mediaDevices.getUserMedia({
    video: true, audio: true
}).then(stream => {
    // add my stream to element 
    addVideoStream(myVideo, stream);

    // on call to peers
    myPeer.on("call", call => {
	    call.answer(stream);
        let video = document.createElement("video");
        
        call.on("stream", (userVideoStream) => {

            if(call.metadata && call.metadata.shareScreen == true){
                console.log(call.metadata);
                video = document.getElementById("spotlight");
                video.srcObject = userVideoStream;
                video.addEventListener("loadedmetadata", () => {
                    video.play();
                });

            } else{
                addVideoStream(video, userVideoStream);
            }
        });
    });

    // on new user enter room send my stream to them
    socket.on("user-connected", user_id => {
        connectToNewUser(user_id, stream);
    }); 
});

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
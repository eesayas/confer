import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { Video } from "../components/Video";
import { PeerVideo } from "../components/PeerVideo";
import { MediaManager } from "../media";
import { Socket } from "../socket";
import { waitUntil } from "../utils";
import { Peer, PeerManager } from "../peer";
import { AudioButton } from "../components/buttons/AudioButton";
import { VideoButton } from "../components/buttons/VideoButton";
import { EndCallButton } from "../components/buttons/EndCallButton";

export const Meeting = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [peers, setPeers] = useState<Peer[]>([]);

  const { path, route } = useLocation();

  const peerManager = new PeerManager();
  peerManager.on("update", () => {
    setPeers(peerManager.peers);
  });

  const media = new MediaManager();
  const setupStream = () => {
    waitUntil(() => media.ready).then(() => {
      setStream(media.stream);
    });
  };

  const socket = new Socket();

  const setupRoom = () => {
    const room = path.slice(1);
    waitUntil(() => socket.ready).then(() => {
      socket.send("JOIN", room);
    });
  };

  const leaveRoom = () => {
    const room = path.slice(1);
    socket.send("LEAVE", room);
  };

  useEffect(() => {
    setupStream();
    setupRoom();

    window.addEventListener("beforeunload", leaveRoom);
    return () => {
      window.removeEventListener("beforeunload", leaveRoom);
    };
  }, []);

  const leaveCall = () => {
    route("/");
    window.location.reload();
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          width: "90%",
          margin: "auto",
          height: "100%",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <Video stream={stream} muted></Video>

        {peers.map((peer, index) => (
          <PeerVideo key={index} peer={peer} />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 10,
          width: "100%",
          justifyContent: "center",
          display: "flex",
          gap: 10,
        }}
      >
        <AudioButton onClick={media.toggleAudio} />
        <VideoButton onClick={media.toggleVideo} />
        <EndCallButton onClick={leaveCall} />
      </div>
    </div>
  );
};

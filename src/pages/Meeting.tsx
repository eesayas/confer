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

export const Meeting = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [peers, setPeers] = useState<Peer[]>([]);

  const { path, route } = useLocation();

  const peerManager = new PeerManager();
  peerManager.on("update", () => {
    setPeers(peerManager.peers);
  });

  const setupStream = () => {
    const media = new MediaManager();
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

  const goBack = () => {
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
          padding: "0 2px",
          gap: "2px",
        }}
      >
        <Video stream={stream}></Video>
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
        <AudioButton />
        <VideoButton />
      </div>
    </div>
  );
};

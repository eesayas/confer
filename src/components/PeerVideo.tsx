import { useState } from "preact/hooks";
import { Peer } from "../peer";
import { Video } from "../components/Video";

interface Props {
  peer: Peer;
}

export const PeerVideo = (props: Props) => {
  const [stream, setStream] = useState<MediaStream>();
  const { peer } = props;

  peer.on("track", (track) => {
    setStream(track);
  });

  return <Video stream={stream}></Video>;
};

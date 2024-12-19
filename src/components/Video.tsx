import { useEffect, useRef } from "preact/hooks";

interface Props {
  stream: MediaStream;
  muted?: boolean;
}

export const Video = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>();

  const attachVideo = () => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.stream;
    }
  };

  // Set video/audio once stream is available
  useEffect(() => {
    props.stream && attachVideo();
  }, [props.stream]);

  return (
    <video
      ref={videoRef}
      autoplay
      playsInline
      muted={props.muted}
      style={{
        borderRadius: "10px",
        backgroundColor: "#333",
        flex: "1 1 30%",
      }}
    ></video>
  );
};

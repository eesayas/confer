import { useEffect, useRef } from "preact/hooks";

interface Props {
  stream: MediaStream;
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
    <div
      style={{
        overflow: "hidden",
        borderRadius: "20px",
        border: "1px solid red",
      }}
    >
      <video
        ref={videoRef}
        autoplay
        playsInline
        muted
        style={{
          width: "100%",
          height: "100%",
          margin: 0,
          display: "block",
        }}
      ></video>
    </div>
  );
};

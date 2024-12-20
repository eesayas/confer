import { useEffect, useRef, useState } from "preact/hooks";

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
    setTimeout(() => {
      props.stream && attachVideo();
    }, 500);
  }, [props.stream]);

  return (
    <div class="video-container">
      <video
        ref={videoRef}
        autoplay
        playsInline
        muted={props.muted}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          objectFit: "cover",
        }}
      ></video>
    </div>
  );
};

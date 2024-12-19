import { Button } from "./Button";
import { VideoOffIcon } from "../icons/VideoOffIcon";
import { VideoOnIcon } from "../icons/VideoOnIcon";
import { useState } from "preact/hooks";

export const VideoButton = () => {
  const [enabled, setEnabled] = useState<boolean>(true);
  const toggle = () => {
    setEnabled(!enabled);
  };

  return (
    <Button onClick={toggle}>
      {enabled ? <VideoOnIcon /> : <VideoOffIcon />}
    </Button>
  );
};

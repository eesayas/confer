import { Button } from "./Button";
import { VideoOffIcon } from "../icons/VideoOffIcon";
import { VideoOnIcon } from "../icons/VideoOnIcon";
import { useState } from "preact/hooks";

interface Props {
  onClick?: () => void;
}

export const VideoButton = (props: Props) => {
  const [enabled, setEnabled] = useState<boolean>(true);
  const toggle = () => {
    setEnabled(!enabled);
    props.onClick();
  };

  return (
    <Button onClick={toggle}>
      {enabled ? <VideoOnIcon /> : <VideoOffIcon />}
    </Button>
  );
};

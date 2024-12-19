import { Button } from "./Button";
import { AudioOnIcon } from "../icons/AudioOnIcon";
import { AudioOffIcon } from "../icons/AudioOffIcon";
import { useState } from "preact/hooks";

interface Props {
  onClick?: () => void;
}

export const AudioButton = (props: Props) => {
  const [enabled, setEnabled] = useState<boolean>(true);
  const toggle = () => {
    setEnabled(!enabled);
    props.onClick();
  };

  return (
    <Button onClick={toggle}>
      {enabled ? <AudioOnIcon /> : <AudioOffIcon />}
    </Button>
  );
};

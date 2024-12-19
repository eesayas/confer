import { Button } from "./Button";
import { AudioOnIcon } from "../icons/AudioOnIcon";
import { AudioOffIcon } from "../icons/AudioOffIcon";
import { useState } from "preact/hooks";

export const AudioButton = () => {
  const [enabled, setEnabled] = useState<boolean>(true);
  const toggle = () => {
    setEnabled(!enabled);
  };

  return (
    <Button onClick={toggle}>
      {enabled ? <AudioOnIcon /> : <AudioOffIcon />}
    </Button>
  );
};

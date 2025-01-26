import { PhoneIcon } from "../icons/PhoneIcon";
import { IconButton } from "./IconButton";

interface Props {
  onClick?: () => void;
}

export const EndCallButton = (props: Props) => {
  return (
    <IconButton onClick={props.onClick} bgColor="#E10000" textColor="#FFF">
      <PhoneIcon />
    </IconButton>
  );
};

import { PhoneIcon } from "../icons/PhoneIcon";
import { Button } from "./Button";

interface Props {
  onClick?: () => void;
}

export const EndCallButton = (props: Props) => {
  return (
    <Button onClick={props.onClick} bgColor="#E10000" textColor="#FFF">
      <PhoneIcon />
    </Button>
  );
};

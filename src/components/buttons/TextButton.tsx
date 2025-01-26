import { ReactNode } from "preact/compat";

interface Props {
  children?: ReactNode;
  onClick?: () => void;
}

export const TextButton = (props: Props) => {
  return (
    <button class="text-button" onClick={props.onClick}>
      {props.children}
    </button>
  );
};

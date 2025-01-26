import { ReactNode } from "preact/compat";

interface Props {
  onClick?: () => void;
  children: ReactNode;
  bgColor?: string;
  textColor?: string;
}

export const IconButton = (props: Props) => {
  const bgColor = props.bgColor ?? "#D9D9D9";
  const textColor = props.textColor ?? "#000";

  return (
    <button
      onClick={props.onClick}
      class="icon-button"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {props.children}
    </button>
  );
};

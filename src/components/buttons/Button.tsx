import { ReactNode } from "preact/compat";

interface Props {
  onClick?: () => void;
  children: ReactNode;
  bgColor?: string;
  textColor?: string;
}

export const Button = (props: Props) => {
  const bgColor = props.bgColor ?? "#D9D9D9";
  const textColor = props.textColor ?? "#000";

  return (
    <button
      onClick={props.onClick}
      style={{
        cursor: "pointer",
        backgroundColor: bgColor,
        color: textColor,
        width: "50px",
        height: "50px",
        borderRadius: "10px",
        border: "none",
      }}
    >
      {props.children}
    </button>
  );
};

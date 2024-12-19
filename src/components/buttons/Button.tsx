import { ReactNode } from "preact/compat";

interface Props {
  onClick: () => void;
  children: ReactNode;
}

export const Button = (props: Props) => {
  const bgColor = "#D9D9D9";

  return (
    <button
      onClick={props.onClick}
      style={{
        cursor: "pointer",
        backgroundColor: bgColor,
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

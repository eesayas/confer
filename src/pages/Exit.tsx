import { useLocation } from "preact-iso";
import { useEffect, useState } from "preact/hooks";
import { TextButton } from "../components/buttons/TextButton";

export const Exit = () => {
  const { path, route } = useLocation();
  const [room, setRoom] = useState("");

  useEffect(() => {
    setRoom(path.split("/")[2]);
  }, []);

  const rejoin = () => {
    route(`/${room}`);
    window.location.reload();
  };

  const goToHome = () => {
    route("/");
    window.location.reload();
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "1.5rem" }}>You just left room {room}</div>
      <br />
      <div>
        <TextButton onClick={rejoin}>REJOIN</TextButton>
        &nbsp;
        <TextButton onClick={goToHome}>GO TO HOME</TextButton>
      </div>
    </div>
  );
};

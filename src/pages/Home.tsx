import { useLocation } from "preact-iso";
import { useState } from "preact/hooks";
import { TextButton } from "../components/buttons/TextButton";

const generateRandom10Digit = (): string => {
  return `${Math.floor(Math.random() * 9000000000) + 1000000000}`;
};

export const Home = () => {
  const { route } = useLocation();
  const [room, setRoom] = useState<string>(generateRandom10Digit());

  const handleRoomChange = (event) => {
    setRoom(event.target.value);
  };

  const join = () => {
    route(`/${room}`, true);
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
      <div style={{ margin: 0, fontSize: "3rem" }}>Confer.</div>
      <p style={{ fontStyle: "italic", fontWeight: 100 }}>
        A simple video conferencing app
      </p>
      <input
        value={room}
        onChange={handleRoomChange}
        style={{
          fontSize: "1rem",
          padding: "10px",
          outiline: "none",
          width: "300px",
          textAlign: "center",
        }}
      />
      <p
        style={{
          fontStyle: "italic",
          fontWeight: 100,
          fontSize: "0.9rem",
          opacity: "0.7",
        }}
      >
        Update and/or Share the meeting ID above!
      </p>
      <br />

      <TextButton onClick={join}>JOIN MEETING</TextButton>

      <br />
      <p style={{ fontWeight: 100, fontSize: "0.9rem" }}>
        Created by{" "}
        <a
          href="https://isaiasbriones.com/"
          target="_blank"
          style={{ color: "white" }}
        >
          isaiasbriones
        </a>
      </p>
    </div>
  );
};

import { useLocation } from "preact-iso";

export const Home = () => {
  const { route } = useLocation();

  const join = () => {
    route("/123", true);
    window.location.reload();
  };

  return (
    <div style={{ border: "1px solid red", height: "100vh" }}>
      <button onClick={join}>JOIN MEETING</button>
    </div>
  );
};

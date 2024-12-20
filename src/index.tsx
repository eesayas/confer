import { render } from "preact";
import { LocationProvider, Router, Route } from "preact-iso";
import { Home } from "./pages/Home.jsx";
import { NotFound } from "./pages/_404.jsx";
import { Meeting } from "./pages/Meeting.jsx";
import "./style.css";

export const App = () => {
  return (
    <LocationProvider>
      <main>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/:id" component={Meeting} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
  );
};

render(<App />, document.getElementById("app"));

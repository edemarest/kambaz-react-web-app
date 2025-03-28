import Lab1 from "./Lab1";
import { Route, Routes, Navigate } from "react-router";
import { Provider } from "react-redux";
import TOC from "./TOC";
import Lab2 from "./Lab2";
import Lab3 from "./Lab3";
import Lab4 from "./Lab4";
import Lab5 from "./Lab5";
import store from "./store";
import AllLabs from "./AllLabs";

export default function Labs() {
  const goToLandingPage = () => {
    window.location.href = "/#/Kambaz";
  };

  return (
    <Provider store={store}>
      <div>
        <div className="wd-top-right-button">
          <button onClick={goToLandingPage} className="wd-landing-button">
            Landing Page
          </button>
        </div>
        <p>
          <strong>Assignment by:</strong> Ella Demarest
        </p>
        <p>
          <strong>Section:</strong> CS4550.37031.202530
        </p>
        <h1>Labs</h1>
        <TOC />
        <Routes>
          <Route path="/" element={<AllLabs />} />
          <Route path="Lab1" element={<Lab1 />} />
          <Route path="Lab2" element={<Lab2 />} />
          <Route path="Lab3" element={<Lab3 />} />
          <Route path="Lab4" element={<Lab4 />} />
          <Route path="Lab5" element={<Lab5 />} />
        </Routes>
      </div>
    </Provider>
  );
}

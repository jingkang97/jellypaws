import "./App.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StartPage from "./Pages/StartPage";
import { Route, Routes } from "react-router-dom";
import Quiz from "./Pages/Quiz";
import ResultPage from "./Pages/ResultPage";

gsap.registerPlugin(useGSAP);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
};

export default App;

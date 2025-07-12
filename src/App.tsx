import { useRef } from "react";
import "./App.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StartPage from "./Pages/StartPage";
import Iridescence from "./Components/Background/Iridescence";
import LiquidGlass from "./Pages/LiquidGlass";

gsap.registerPlugin(useGSAP);

const App = () => {
  return (
    <div>
      <StartPage />
    </div>
  );
};

export default App;

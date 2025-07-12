import { useRef } from "react";
import "./App.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StartPage from "./Pages/StartPage";
import Iridescence from "./Components/Background/Iridescence";

gsap.registerPlugin(useGSAP);

const App = () => {
  const boxRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (boxRef.current) {
      gsap.from(boxRef.current, {
        rotation: 180,
        x: -100,
        duration: 2,
        ease: "power1.inOut",
        opacity: 0,
      });
    }
  }, [boxRef]);

  // return <div className="box" ref={boxRef}></div>;
  return (
    <div>
      <StartPage />
    </div>
  );
};

export default App;

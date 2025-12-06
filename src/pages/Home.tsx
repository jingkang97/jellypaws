import { Link } from "react-router-dom";
import FallingGachapon from "../components/FallingGachapon/FallingGachapon";
// import OrientationTesting from "../components/FallingGachapon/OrientationTesting";
import CircularText from "../components/CircularText/CircularText";

const Home = () => {
  return (
    <div
      className="home"
      style={{ background: "#FDF5E2", width: "100%", height: "100vh" }}
    >
      <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
        {/* BACKGROUND GACHAPON */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            // pointerEvents: "none",
          }}
        >
          <FallingGachapon
            trigger="auto"
            backgroundColor="transparent"
            wireframes={false}
            gravity={0.56}
            mouseConstraintStiffness={0.9}
            containerPadding={16}
          />
        </div>

        {/* FRONT CIRCULAR TEXT */}
        <CircularText
          centerImage="./favicon.png"
          text="JELLY*PAWS*JELLY*PAWS*"
        />
      </div>
      <div style={{ zIndex: 10, position: "relative" }}>
        <h1>What jelly are you?</h1>
        <p>Discover your true flavour</p>
        <Link to="/quiz" className="start-link">
          Start
        </Link>
      </div>
    </div>
  );
};

export default Home;

import { Link } from "react-router-dom";
import FallingGachapon from "../components/FallingGachapon/FallingGachapon";
import CircularText from "../components/CircularText/CircularText";

const Home = () => {
  return (
    <div
      className="home"
      style={{
        background: "#FDF5E2",
        width: "100%",
        height: "100vh",
        position: "relative",
      }}
    >
      {/* BACKGROUND GACHAPON - Interactive but behind other elements */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1, // Low z-index for background layer
        }}
      >
        <FallingGachapon
          trigger="auto"
          backgroundColor="transparent"
          wireframes={false}
          gravity={0.9}
          mouseConstraintStiffness={0.9}
          containerPadding={16}
        />
      </div>

      {/* FRONT CIRCULAR TEXT */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          pointerEvents: "none", // Make container non-interactive
        }}
      ></div>

      {/* MAIN CONTENT */}
      <div
        style={{
          zIndex: 10,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          pointerEvents: "none", // Make container non-interactive
        }}
      >
        <div>
          <div style={{ pointerEvents: "none" }}>
            {" "}
            {/* Re-enable for CircularText */}
            <CircularText
              centerImage="./favicon.png"
              text="JELLY*PAWS*JELLY*PAWS*"
            />
          </div>
          <h1>What jelly are you?</h1>
          <div
            style={{
              width: "fit-content",
              margin: "0 auto", // centers it
              textAlign: "center", // centers text inside
            }}
          >
            Discover your true flavour
          </div>
          <Link
            style={{ pointerEvents: "auto" }}
            to="/quiz"
            className="start-link"
          >
            Start
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

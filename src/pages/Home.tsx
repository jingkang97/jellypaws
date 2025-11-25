import { Link } from "react-router-dom";
import FallingGachapon from "../components/FallingGachapon/FallingGachapon";
// import OrientationTesting from "../components/FallingGachapon/OrientationTesting";

const Home = () => {
  return (
    <div className="home">
      <div style={{ height: "50vh", width: "100vw" }}>
        <FallingGachapon
          trigger="auto"
          backgroundColor="tranredsparent"
          wireframes={false}
          gravity={0.5}
          mouseConstraintStiffness={0.9}
          ballMax={10}
          containerPadding={16}
        />
        {/* <OrientationTesting /> */}
      </div>
      <h1>What jelly are you?</h1>
      <p>Discover your true flavour</p>

      <Link to="/quiz" className="start-link" aria-label="Start quiz">
        Start
      </Link>
    </div>
  );
};

export default Home;

import { useHistory } from "react-router-dom";
import FallingGachapon from "../components/FallingGachapon/FallingGachapon";
import CircularText from "../components/CircularText/CircularText";

const Home = () => {
  const history = useHistory();

  return (
    <div className="home">
      {/* Gachapon background if needed */}
      <div className="gachapon-bg">
        <FallingGachapon
          trigger="auto"
          backgroundColor="transparent"
          wireframes={false}
          gravity={0.9}
          mouseConstraintStiffness={0.9}
          containerPadding={16}
        />
      </div>

      <div className="home-content">
        <CircularText
          centerImage="./favicon.png"
          text="JELLY*PAWS*JELLY*PAWS*"
        />

        <h1>What jelly are you?</h1>

        <p className="subtitle">Discover your true flavour</p>

        <button type="button" onClick={() => history.push("/quiz")}>
          Start
        </button>
      </div>
    </div>
  );
};

export default Home;

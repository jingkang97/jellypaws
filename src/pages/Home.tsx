import { useHistory } from "react-router-dom";
import ConveyorBelt from "../components/ConveyorBelt";

const Home = () => {
  const history = useHistory();

  return (
    <div className="home">
      <div className="home-content">
        <div>
          <img style={{ height: "200px" }} src="/logo.png" alt="Jelly Icon" />
        </div>
        <h1>What jelly are you?</h1>
        <p className="subtitle">Discover your true flavour</p>
        <ConveyorBelt />
        <button type="button" onClick={() => history.push("/quiz")}>
          Start
        </button>
      </div>
    </div>
  );
};

export default Home;

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <h1>What jelly are you?</h1>
      <p>Discover your true flavour</p>

      <Link to="/quiz" className="start-link" aria-label="Start quiz">
        Start
      </Link>
    </div>
  );
};

export default Home;

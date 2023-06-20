import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.scss";
import Loading from "../../components/Loading/Loading";

const Home = () => {
  const [sounds, setSounds] = useState(null);
  const [subgenres, setSubgenres] = useState(null);

  const getSounds = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/sounds`
      );
      const sounds = response.data;
      setSounds(sounds);
      getSubgenres(sounds);
    } catch (error) {
      console.log(
        `Error ${error.response.status}: ${error.response.data.message}`
      );
    }
  };

  const getSubgenres = (sounds) => {
    const subgenres = sounds.map((sound) => sound.subgenre);
    const uniqueSubgenres = [...new Set(subgenres)];
    setSubgenres(uniqueSubgenres);
  };

  useEffect(() => {
    getSounds();
  }, []);

  if (!sounds || !subgenres) {
    return <Loading />;
  }

  // Get subgenres from database
  // Create genre cards using map (using data above )

  return (
    <main className="home">
      <h1 className="home__title">Select Genre</h1>
      <div className="home__genres-container">
        <article className="genre">
          <h2 className="genre__title">Raw Deep</h2>
          <h3 className="genre__subtitle">House</h3>
        </article>
        <article className="genre">
          <h2 className="genre__title">Raw Deep</h2>
          <h3 className="genre__subtitle">House</h3>
        </article>
        <article className="genre">
          <h2 className="genre__title">Raw Deep</h2>
          <h3 className="genre__subtitle">House</h3>
        </article>
        <article className="genre">
          <h2 className="genre__title">Raw Deep</h2>
          <h3 className="genre__subtitle">House</h3>
        </article>
      </div>
    </main>
  );
};

export default Home;

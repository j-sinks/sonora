import { useState, useEffect } from "react";
import axios from "axios";
import "./Home.scss";
import Loading from "../../components/Loading/Loading";
import GenreCard from "../../components/GenreCard/GenreCard";

const Home = () => {
  const [sounds, setSounds] = useState(null);
  const [subgenres, setSubgenres] = useState(null);

  // Retrieve all sounds from database
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

  // Takes the sounds state and created a new array inlcuding a subset of the data
  // Following this, a new array is created containing only unique subgenre values 
  // The resulting array is then used to set state
  const getSubgenres = (sounds) => {
    const genreInfo = sounds.map((sound) => ({
      id: crypto.randomUUID(),
      subgenre: sound.subgenre,
      genre: sound.genre,
    }));

    const uniqueSubgenres = Array.from(
      new Set(genreInfo.map((sound) => sound.subgenre))
    ).map((subgenre) => {
      const { genre, id } = genreInfo.find(
        (sound) => sound.subgenre === subgenre
      );
      return { id, subgenre, genre };
    });

    setSubgenres(uniqueSubgenres);
  };

  useEffect(() => {
    getSounds();
  }, []);

  if (!sounds || !subgenres) {
    return <Loading />;
  }

  return (
    <main className="home">
      <h1 className="home__title">Select Genre</h1>
      <div className="home__genres-container">
        {subgenres.map((subgenre) => (
          <GenreCard
            key={subgenre.id}
            genreInfo={subgenre}
          />
        ))}
      </div>
    </main>
  );
};

export default Home;

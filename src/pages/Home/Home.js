import { useState, useEffect } from "react";
import axios from "axios";
// import { OpenAI } from "openai";
import "./Home.scss";
import Loading from "../../components/Loading/Loading";
import GenreCard from "../../components/GenreCard/GenreCard";

const Home = () => {
  const [sounds, setSounds] = useState(null);
  const [subgenres, setSubgenres] = useState(null);

  // const [instruments, setInstruments] = useState([]);
  // const openai = new OpenAI(`${process.env.REACT_APP_OPENAI_API_KEY}`);
  // const genre = "deep house";

  // const getInstrumentsByGenre = async () => {
  //   const prompt = `What instruments define ${genre} genre of music? 
  //   Please give me a general overview in terms of instrument type 
  //   (i.e. drums, bass, synth, vocals etc.). I am interested in all 
  //   instrument types from traditional to modern. Please consider only 
  //   the genre or sub-genre of music requested. Based on this please 
  //   generate an array of strings which include the instruments, 
  //   sorted in order of importance. Only provide the instrument type 
  //   without any additional information. Please don't provide any summary text.`;
  //   const response = await openai.complete({
  //     engine: "davinci",
  //     prompt: prompt,
  //     maxTokens: 50,
  //     n: 1,
  //     stop: "\n",
  //   });

  //   const instruments = response.data.choices[0].text.trim().split("\n");
  //   setInstruments(instruments);
  //   console.log(instruments);
  // };

  // useEffect(() => {
  //   getInstrumentsByGenre();
  // }, []);

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
          <GenreCard key={subgenre.id} genreInfo={subgenre} />
        ))}
      </div>
    </main>
  );
};

export default Home;

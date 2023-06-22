import { useState, useEffect } from "react";
import axios from "axios";
// import { OpenAI } from "openai";
import "./Home.scss";
import Loading from "../../components/Loading/Loading";
import GenreCard from "../../components/GenreCard/GenreCard";

const Home = () => {
  const [sounds, setSounds] = useState(null);
  const [subgenres, setSubgenres] = useState(null);

  const [instruments, setInstruments] = useState([]);
  const selectedGenre = "trance";

  const prompt = `What instruments define ${selectedGenre} music? I am interested /
  in all instrument types from traditional to modern. Consider only the genre or /
  sub-genre of music requested. Based on this generate an array of strings which /
  include the instruments, sorted in order of importance. Only provide the instrument /
  type without any additional information. Please don't provide any summary text. /
  Use the following format: ["instrument1", "instrument2", "instrument3"]`;

  // const getInstrumentsByGenre = (input) => {
  //   const client = axios.create({
  //     headers: {
  //       Authorization: "Bearer " + process.env.REACT_APP_OPENAI_API_KEY,
  //     },
  //   });
  //   let params = {
  //     prompt: input,
  //     model: "text-davinci-002",
  //     max_tokens: 50,
  //     temperature: 0.1,
  //   };
  //   client
  //     .post(process.env.REACT_APP_OPENAI_API_URL_A, params)
  //     .then((response) => {
  //       setInstruments(response.data.choices[0].text);
  //       console.log(instruments);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const getInstrumentsByGenre = (input) => {
    const client = axios.create({
      headers: {
        Authorization: "Bearer " + process.env.REACT_APP_OPENAI_API_KEY,
      },
    });
    let params = {
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": input}],
      max_tokens: 100,
      temperature: 0,
    };
    client
      .post(process.env.REACT_APP_OPENAI_API_URL_B, params)
      .then((response) => {
        setInstruments(response.data.choices[0].message.content);
        console.log(response.data.choices[0].message.content);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // useEffect(() => {
  //   getInstrumentsByGenre(prompt);
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

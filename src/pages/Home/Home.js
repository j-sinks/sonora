import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Home.scss";
import Loading from "../../components/Loading/Loading";
import GenreCard from "../../components/GenreCard/GenreCard";
import playBtn from "../../assets/images/icons/play-button.svg";

const Home = ({ handleSelectedGenre }) => {
  const [input, setInput] = useState("");
  const [inputIsTouched, setInputIsTouched] = useState(false);
  
  const [sounds, setSounds] = useState(null);
  const [subgenres, setSubgenres] = useState(null);

  const navigate = useNavigate();

  // Allows for buffer to await the model's response before navigating to set
  const redirectAfter = (timer) => {
    setTimeout(() => {
      navigate("set");
    }, timer);
  }

  // Updates form state based on user input
  // Also updates state so validation knows the form has been interacted with
  const handleChangeInput = (event) => {
    setInput(event.target.value);
    setInputIsTouched(true);
  };

  // Check the input is not empty
  const isFormValid = () => {
    if (!input) {
      return false;
    }

    return true;
  };

  // Handles the form submit
  // Prompt state in App.js is also updated which queries the model 
  const handleSubmit = (event) => {
    event.preventDefault();
    setInputIsTouched(true);

    if (!isFormValid()) {
      return;
    }

    handleSelectedGenre(input);
    setInput("");
    setInputIsTouched(false);

    redirectAfter(10000);
  };

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

  // Uses the sounds state to create a new array which is a subset of the data
  // Following this, a new array is created containing only unique subgenre values
  // The resulting array is then used to generate genre card components
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

  // Retrieves the sounds on mount
  useEffect(() => {
    getSounds();
  }, []);

  // Returns loading component before data has been retrieved
  if (!sounds || !subgenres) {
    return <Loading />;
  }

  return (
    <main className="home">
      <h1 className="home__title">Generate Set</h1>
      <section className="prompt">
        <form
          className="prompt__form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <label className="prompt__label" htmlFor="prompt">
            What genre of music would you like to create?
          </label>
          <input
            className="prompt__input"
            type="text"
            name="prompt"
            placeholder="🎲  Type a genre here..."
            onChange={handleChangeInput}
            value={input}
          />
          {inputIsTouched && !isFormValid() && (
                <small className="prompt__error">Genre is required</small>
              )}
          <button className="prompt__button">
            <img src={playBtn} alt="play button" />
          </button>
        </form>
      </section>
      <section className="genres">
        <h2 className="genres__title">Select Genre</h2>
        <div className="genres__container">
          {subgenres.map((subgenre) => (
            <GenreCard key={subgenre.id} genreInfo={subgenre} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;

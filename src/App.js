import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.scss";
import Header from "./components/Header/Header";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import SetAI from "./pages/SetAI/SetAI";
import Set from "./pages/Set/Set";
import Profile from "./pages/Profile/Profile";
import Sets from "./pages/Sets/Sets";
import SetUser from "./pages/SetUser/SetUser";
import Sounds from "./pages/Sounds/Sounds";
import Error from "./pages/Error/Error";
import Footer from "./components/Footer/Footer";

function App() {
  const [genreData, setGenreData] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);

  const isFirstRender = useRef(true);

  // handle fucntion which is passed down to home page so state can be updated with user input
  const handleSelectedGenre = (genre) => {
    setSelectedGenre(genre);
  };

  // Input prompt for model
  const prompt = `What instruments define ${selectedGenre} music? I am interested /
  in all instrument types from traditional to modern. Consider only the genre or /
  sub-genre of music requested. Based on this generate an array of strings which /
  include the instruments, sorted in order of importance. I am also interesting in /
  the tempo range for the specified genre in terms of BPM.  Only provide the instrument /
  type without any additional information. Please don't provide any summary text. /
  Provide this in JSON format: /
  {
    "instruments": ["instrument1", "instrument2", "instrument3"], /
    "bpm": "120 TO 125" /
  } `;

  // Prompt function for gpt-3.5-turbo model
  const getInstrumentsByGenre = (input) => {
    const client = axios.create({
      headers: {
        Authorization: "Bearer " + process.env.REACT_APP_OPENAI_API_KEY,
      },
    });
    let params = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input }],
      max_tokens: 100,
      temperature: 0,
    };
    client
      .post(process.env.REACT_APP_OPENAI_API_URL_B, params)
      .then((response) => {
        const responseJSON = response.data.choices[0].message.content;
        const responseObj = JSON.parse(responseJSON);
        setGenreData(responseObj);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // Prompts the model when genre is input by user on home page
  // First checks if this is the initial mount, if yes the model is not prompted
  // gpt-3.5-turbo has a request limit of 3/min
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    getInstrumentsByGenre(prompt);
  }, [selectedGenre]);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={<Home handleSelectedGenre={handleSelectedGenre} />}
          />
          <Route path="home" element={<Navigate to="/" />} />
          <Route
            path="set"
            element={
              <SetAI selectedGenre={selectedGenre} genreData={genreData} />
            }
          />
          <Route path="set/:subgenre" element={<Set />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="profile/:userId/sets" element={<Sets />} />
          <Route path="profile/:userId/sets/:setId" element={<SetUser />} />
          <Route path="profile/:userId/sounds" element={<Sounds />} />
          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

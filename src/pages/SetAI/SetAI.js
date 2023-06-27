import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  capitaliseFirstLetter,
  splitOnUnderscore,
  removeSuffix,
} from "../../utils/stringFormatting";
import { randomIndex } from "../../utils/math";
import "./SetAI.scss";
import Loading from "../../components/Loading/Loading";
import likeBtn from "../../assets/images/icons/heart-black.svg";
import addSound from "../../assets/images/icons/plus-grey.svg";
import shuffleBtn from "../../assets/images/icons/ph_shuffle-fill-white.svg";
import playBtn from "../../assets/images/icons/play-button.svg";
import stopBtn from "../../assets/images/icons/stop-button.svg";
import resetBtn from "../../assets/images/icons//reset-button.svg";
import saveBtn from "../../assets/images/icons/save-white.svg";

const SetAI = ({ selectedGenre, genreData }) => {
  const { instruments, bpm } = genreData;

  const [sound1, setSound1] = useState(null);
  const [sound2, setSound2] = useState(null);
  const [sound3, setSound3] = useState(null);
  const [sound4, setSound4] = useState(null);

  const [audioElements, setAudioElements] = useState([]);
  const audioRefs = useRef([]);

  const [loadedStates, setLoadedStates] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [mutedStates, setMutedStates] = useState([]);

  const [playAnimationClass, setPlayAnimationClass] = useState(true);
  const [isShaking, setIsShaking] = useState(false);

  // Requests intial sounds from API and sets into state.
  const getInitialSounds = async () => {
    const pageSize = "page_size=50";
    const duration = "duration:[5.0 TO 60.0]";
    const tonality = 'ac_tonality:"C minor"';
    const tempo = `ac_tempo:[${bpm}]`;

    try {
      // SOUND 1
      const sound1InitialResponse = await axios.get(
        `${process.env.REACT_APP_FS_API_URL}/search/text/?query="${instruments[0]}"&${pageSize}&filter=${duration}&filter=${tonality}&filter=${tempo}&token=${process.env.REACT_APP_FS_API_KEY}`
      );

      const randomId1 =
        sound1InitialResponse.data.results[
          randomIndex(sound1InitialResponse.data.results)
        ].id;

      const sound1FinalResponse = await axios.get(
        `${process.env.REACT_APP_FS_API_URL}/sounds/${randomId1}/?token=${process.env.REACT_APP_FS_API_KEY}`
      );

      setSound1(sound1FinalResponse.data);

      // SOUND 2
      const sound2InitialResponse = await axios.get(
        `${process.env.REACT_APP_FS_API_URL}/search/text/?query="${instruments[1]}"&${pageSize}&filter=${duration}&filter=${tonality}&filter=${tempo}&token=${process.env.REACT_APP_FS_API_KEY}`
      );

      const randomId2 =
        sound2InitialResponse.data.results[
          randomIndex(sound2InitialResponse.data.results)
        ].id;

      const sound2FinalResponse = await axios.get(
        `${process.env.REACT_APP_FS_API_URL}/sounds/${randomId2}/?token=${process.env.REACT_APP_FS_API_KEY}`
      );

      setSound2(sound2FinalResponse.data);

      // SOUND 3
      const sound3InitialResponse = await axios.get(
        `${process.env.REACT_APP_FS_API_URL}/search/text/?query="${instruments[2]}"&${pageSize}&filter=${duration}&filter=${tonality}&filter=${tempo}&token=${process.env.REACT_APP_FS_API_KEY}`
      );

      const randomId3 =
        sound3InitialResponse.data.results[
          randomIndex(sound3InitialResponse.data.results)
        ].id;

      const sound3FinalResponse = await axios.get(
        `${process.env.REACT_APP_FS_API_URL}/sounds/${randomId3}/?token=${process.env.REACT_APP_FS_API_KEY}`
      );

      setSound3(sound3FinalResponse.data);

      // SOUND 4
      const sound4InitialResponse = await axios.get(
        `${process.env.REACT_APP_FS_API_URL}/search/text/?query="${instruments[3]}"&${pageSize}&filter=${duration}&filter=${tonality}&filter=${tempo}&token=${process.env.REACT_APP_FS_API_KEY}`
      );

      const randomId4 =
        sound4InitialResponse.data.results[
          randomIndex(sound4InitialResponse.data.results)
        ].id;

      const sound4FinalResponse = await axios.get(
        `${process.env.REACT_APP_FS_API_URL}/sounds/${randomId4}/?token=${process.env.REACT_APP_FS_API_KEY}`
      );

      setSound4(sound4FinalResponse.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();

    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 1000);
  };

  const handleShuffleClick = () => {
    getInitialSounds();
  };

  // Re-render page based on the subgenre param
  useEffect(() => {
    getInitialSounds();
  }, [instruments]);

  // Update the audio ref when the component is rendered
  useEffect(() => {
    setAudioElements(audioRefs.current);
    setMutedStates(new Array(audioRefs.current.length).fill(false));
  }, []);

  // Update the audio ref and mute states when the component is rendered
  const playAllAudio = () => {
    const allLoaded = loadedStates.every((state) => state);
    if (allLoaded) {
      audioElements.forEach((audio) => {
        audio.play();
        setPlayAnimationClass(true);
      });
    }
  };

  // Handles play click by playing all audio updates state to trigger animation
  const handlePlayClick = () => {
    if (loadedStates.every((state) => state)) {
      audioElements.forEach((audio) => {
        audio.play();
        setPlayAnimationClass(true);
      });
    }
  };

  // Handles stop click by pausing all audio updates state to remove animation
  const handleStopClick = () => {
    audioElements.forEach((audio) => {
      audio.pause();
      setPlayAnimationClass(false);
    });
  };

  // Handles reset click by pausing, resetting time to 0, and playing for all audio,
  // plus updates state to trigger animation
  const handleResetClick = () => {
    audioElements.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
      setPlayAnimationClass(true);
    });
  };

  // Handles mute click for each audio element, based on the index of the audio element
  // set in state, if audio is not muted volume is set to 0, and visa versa
  const handleMuteClick = (index) => {
    const audio = audioElements[index];
    const currentMutedStates = [...mutedStates];
    currentMutedStates[index] = !currentMutedStates[index];
    setMutedStates(currentMutedStates);

    if (currentMutedStates[index]) {
      audio.volume = 0;
    } else {
      audio.volume = 1;
    }
  };

  const handleAudioRef = (index, ref) => {
    audioRefs.current[index] = ref;
  };

  // Loading element while any sound state is null, or sounds are not fully loaded
  if (!sound1 || !sound2 || !sound3 || !sound4) {
    return <Loading />;
  }

  return (
    <main>
      <section className="set">
        <h1 className="set__title">{capitaliseFirstLetter(selectedGenre)}</h1>
        <article
          className={`sound sound--1 ${mutedStates[0] ? "sound--muted" : ""}`}
          onClick={() => handleMuteClick(0)}
        >
          <button className="sound__button" onClick={(e) => handleLikeClick(e)}>
            <img
              className={`sound__like-icon ${
                isShaking ? "sound__like-icon--shake" : ""
              }`}
              src={likeBtn}
              alt="like icon"
            />
          </button>
          <div className="sound__info-container">
            <h2 className="sound__type">SOUND 1</h2>
            <h3 className="sound__name">
              {splitOnUnderscore(removeSuffix(sound1.name))}
            </h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(0, ref)}
            src={sound1.previews["preview-hq-mp3"]}
            loop
            preload="auto"
            autoPlay
            onCanPlayThrough={() => {
              setLoadedStates((prevStates) => {
                const newStates = [...prevStates];
                newStates[0] = true;
                return newStates;
              });
              playAllAudio();
            }}
          ></audio>
        </article>
        <article
          className={`sound sound--2 ${mutedStates[1] ? "sound--muted" : ""}`}
          onClick={() => handleMuteClick(1)}
        >
          <button className="sound__button" onClick={(e) => handleLikeClick(e)}>
            <img
              className={`sound__like-icon ${
                isShaking ? "sound__like-icon--shake" : ""
              }`}
              src={likeBtn}
              alt="like icon"
            />
          </button>
          <div className="sound__info-container">
            <h2 className="sound__type">SOUND 2</h2>
            <h3 className="sound__name">
              {splitOnUnderscore(removeSuffix(sound2.name))}
            </h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(1, ref)}
            src={sound2.previews["preview-hq-mp3"]}
            loop
            preload="auto"
            autoPlay
            onCanPlayThrough={() => {
              setLoadedStates((prevStates) => {
                const newStates = [...prevStates];
                newStates[1] = true;
                return newStates;
              });
              playAllAudio();
            }}
          ></audio>
        </article>
        <article
          className={`sound sound--3 ${mutedStates[2] ? "sound--muted" : ""}`}
          onClick={() => handleMuteClick(2)}
        >
          <button className="sound__button" onClick={(e) => handleLikeClick(e)}>
            <img
              className={`sound__like-icon ${
                isShaking ? "sound__like-icon--shake" : ""
              }`}
              src={likeBtn}
              alt="like icon"
            />
          </button>
          <div className="sound__info-container">
            <h2 className="sound__type">SOUND 3</h2>
            <h3 className="sound__name">
              {splitOnUnderscore(removeSuffix(sound3.name))}
            </h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(2, ref)}
            src={sound3.previews["preview-hq-mp3"]}
            loop
            preload="auto"
            autoPlay
            onCanPlayThrough={() => {
              setLoadedStates((prevStates) => {
                const newStates = [...prevStates];
                newStates[2] = true;
                return newStates;
              });
              playAllAudio();
            }}
          ></audio>
        </article>
        <article
          className={`sound sound--4 ${mutedStates[3] ? "sound--muted" : ""}`}
          onClick={() => handleMuteClick(3)}
        >
          <button className="sound__button" onClick={(e) => handleLikeClick(e)}>
            <img
              className={`sound__like-icon ${
                isShaking ? "sound__like-icon--shake" : ""
              }`}
              src={likeBtn}
              alt="like icon"
            />
          </button>
          <div className="sound__info-container">
            <h2 className="sound__type">SOUND 4</h2>
            <h3 className="sound__name">
              {splitOnUnderscore(removeSuffix(sound4.name))}
            </h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(3, ref)}
            src={sound4.previews["preview-hq-mp3"]}
            loop
            preload="auto"
            autoPlay
            onCanPlayThrough={() => {
              setLoadedStates((prevStates) => {
                const newStates = [...prevStates];
                newStates[3] = true;
                return newStates;
              });
              playAllAudio();
            }}
          ></audio>
        </article>
        <article className="sound sound--add">
          <img className="sound__add-icon" src={addSound} alt="plus icon" />
        </article>
        <div className="controls">
          <div className="controls__container">
            <div className="controls__icon-container">
              <img
                className="controls__icon controls__icon--secondary"
                src={shuffleBtn}
                alt="shuffle icon"
                onClick={handleShuffleClick}
              />
            </div>
            <div className="controls__icon-container">
              <img
                className="controls__icon controls__icon--primary"
                src={resetBtn}
                alt="reset audio icon"
                onClick={handleResetClick}
              />
            </div>
            <div className="controls__icon-container">
              <img
                className="controls__icon controls__icon--primary"
                src={playBtn}
                alt="play audio icon"
                onClick={handlePlayClick}
              />
              <div
                className={playAnimationClass ? "controls__play-animation" : ""}
              ></div>
            </div>
            <div className="controls__icon-container">
              <img
                className="controls__icon controls__icon--primary"
                src={stopBtn}
                alt="stop audio icon"
                onClick={handleStopClick}
              />
            </div>
            <div className="controls__icon-container">
              <img
                className="controls__icon controls__icon--secondary"
                src={saveBtn}
                alt="save set icon"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SetAI;

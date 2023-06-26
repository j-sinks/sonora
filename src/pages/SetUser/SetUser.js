import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  formattedSubgenre,
  splitOnUnderscore,
} from "../../utils/stringFormatting";
import "./SetUser.scss";
import Loading from "../../components/Loading/Loading";
import likeBtn from "../../assets/images/icons/heart-black.svg";
import addSound from "../../assets/images/icons/plus-grey.svg";
import shareBtn from "../../assets/images/icons/upload-white.svg";
import playBtn from "../../assets/images/icons/play-button.svg";
import stopBtn from "../../assets/images/icons/stop-button.svg";
import resetBtn from "../../assets/images/icons/reset-button.svg";
import editBtn from "../../assets/images/icons/edit-white.svg";
import EditSet from "../../components/EditSet/EditSet";

const SetUser = () => {
  const [savedSounds, setSavedSounds] = useState([]);
  const [setData, setSetData] = useState(null);

  const [audioElements, setAudioElements] = useState([]);
  const audioRefs = useRef([]);

  const [mutedStates, setMutedStates] = useState([]);

  const [editModalClass, setEditModalClass] = useState("");

  const [playAnimationClass, setPlayAnimationClass] = useState(true);
  const [isShaking, setIsShaking] = useState(false);

  const { userId, setId } = useParams();

  // Requests intial sounds from API and sets into state.
  const getSavedSounds = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/profile/${userId}/sets/${setId}`
      );

      setSavedSounds(response.data);
    } catch (error) {
      console.log(
        `Error ${error.response.status}: ${error.response.data.message}`
      );
    }
  };

  const likeSound = async (soundId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/profile/${userId}/sounds`,
        {
          sound_id: soundId,
        }
      );
    } catch (error) {
      console.log(
        `Error ${error.response.status}: ${error.response.data.message}`
      );
    }
  };

  const getSetData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/profile/${userId}/sets`
      );

      const sets = response.data;
      const selectedSet = sets.find((set) => set.id == setId);

      setSetData(selectedSet);
    } catch (error) {
      console.log(
        `Error ${error.response.status}: ${error.response.data.message}`
      );
    }
  };

  // Re-render page based on the subgenre param
  useEffect(() => {
    getSavedSounds();
    getSetData();
  }, []);

  // Update the audio ref when the component is rendered
  useEffect(() => {
    setAudioElements(audioRefs.current);
    setMutedStates(new Array(audioRefs.current.length).fill(false));
  }, []);

  const handleLikeClick = (soundId) => {
    setIsShaking(true);
    likeSound(soundId);
    setTimeout(() => {
      setIsShaking(false);
    }, 1000);
  };

  // Handles play click by playing all audio updates state to trigger animation
  const handlePlayClick = () => {
    audioElements.forEach((audio) => {
      audio.play();
      setPlayAnimationClass(true);
    });
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

  const handleEditClick = () => {
    setEditModalClass("edit-set--display");
  };

  const resetEditModalClass = () => {
    setEditModalClass("");
  };

  // Loading element while any sound state is null
  if (!savedSounds || !setData) {
    return <Loading />;
  }

  return (
    <main>
      <section className="set">
        <h1 className="set__title">{formattedSubgenre(setData.name)}</h1>
        <article
          className={`sound sound--1 ${mutedStates[0] ? "sound--muted" : ""}`}
          onClick={() => handleMuteClick(0)}
        >
          <button
            className="sound__button"
            onClick={() => handleLikeClick(savedSounds[0].id)}
          >
            <img
              className={`sound__like-icon ${
                isShaking ? "sound__like-icon--shake" : ""
              }`}
              src={likeBtn}
              alt="like icon"
            />
          </button>
          <div className="sound__info-container">
            <h2 className="sound__type">{savedSounds[0].type.toUpperCase()}</h2>
            <h3 className="sound__name">
              {splitOnUnderscore(savedSounds[0].name)}
            </h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(0, ref)}
            src={savedSounds[0].url}
            loop
            preload="auto"
            autoPlay
          ></audio>
        </article>
        <article
          className={`sound sound--2 ${mutedStates[1] ? "sound--muted" : ""}`}
          onClick={() => handleMuteClick(1)}
        >
          <button
            className="sound__button"
            onClick={() => handleLikeClick(savedSounds[1].id)}
          >
            <img
              className={`sound__like-icon ${
                isShaking ? "sound__like-icon--shake" : ""
              }`}
              src={likeBtn}
              alt="like icon"
            />
          </button>
          <div className="sound__info-container">
            <h2 className="sound__type">{savedSounds[1].type.toUpperCase()}</h2>
            <h3 className="sound__name">
              {splitOnUnderscore(savedSounds[1].name)}
            </h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(1, ref)}
            src={savedSounds[1].url}
            loop
            preload="auto"
            autoPlay
          ></audio>
        </article>
        <article
          className={`sound sound--3 ${mutedStates[2] ? "sound--muted" : ""}`}
          onClick={() => handleMuteClick(2)}
        >
          <button
            className="sound__button"
            onClick={() => handleLikeClick(savedSounds[2].id)}
          >
            <img
              className={`sound__like-icon ${
                isShaking ? "sound__like-icon--shake" : ""
              }`}
              src={likeBtn}
              alt="like icon"
            />
          </button>
          <div className="sound__info-container">
            <h2 className="sound__type">{savedSounds[2].type.toUpperCase()}</h2>
            <h3 className="sound__name">
              {splitOnUnderscore(savedSounds[2].name)}
            </h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(2, ref)}
            src={savedSounds[2].url}
            loop
            preload="auto"
            autoPlay
          ></audio>
        </article>
        <article
          className={`sound sound--4 ${mutedStates[3] ? "sound--muted" : ""}`}
          onClick={() => handleMuteClick(3)}
        >
          <button
            className="sound__button"
            onClick={() => handleLikeClick(savedSounds[3].id)}
          >
            <img
              className={`sound__like-icon ${
                isShaking ? "sound__like-icon--shake" : ""
              }`}
              src={likeBtn}
              alt="like icon"
            />
          </button>
          <div className="sound__info-container">
            <h2 className="sound__type">{savedSounds[3].type.toUpperCase()}</h2>
            <h3 className="sound__name">
              {splitOnUnderscore(savedSounds[3].name)}
            </h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(3, ref)}
            src={savedSounds[3].url}
            loop
            preload="auto"
            autoPlay
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
                src={shareBtn}
                alt="shuffle icon"
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
                src={editBtn}
                alt="save set icon"
                onClick={handleEditClick}
              />
            </div>
          </div>
        </div>
      </section>
      <EditSet
        userId={userId}
        setId={setId}
        editModalClass={editModalClass}
        resetEditModalClass={resetEditModalClass}
      />
    </main>
  );
};

export default SetUser;

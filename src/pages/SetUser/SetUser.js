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
import editBtn from "../../assets/images/icons/edit-grey.svg";
import EditSet from "../../components/EditSet/EditSet";
import downloadBtn from "../../assets/images/icons/download-white.svg";

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

  // Handles the like button click, updates state to trigger animation
  // prevents event bubbling to parent elements
  const handleLikeClick = (e, soundId) => {
    e.stopPropagation();

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
      audio.currentTime = 0;
      audio.play();
      setPlayAnimationClass(true);
    });
  };

  // Defines volume for each audio element
  const indexVolume = (index) => {
    switch (index) {
      case 0:
        return 0.95;
      case 1:
        return 0.5;
      case 2:
        return 0.9;
      case 3:
        return 0.25;
      default:
        return 0.95;
    }
  };

  // Handles mute click for each audio element, based on the index of the audio element set in state,
  // if audio is not muted volume is set to 0, if muted the audio is set to the defined volume
  const handleMuteClick = (index) => {
    const audio = audioElements[index];
    const currentMutedStates = [...mutedStates];
    currentMutedStates[index] = !currentMutedStates[index];
    setMutedStates(currentMutedStates);

    if (currentMutedStates[index]) {
      audio.muted = true;
      audio.volume = 0;
    } else {
      audio.muted = false;
      audio.volume = indexVolume(index);
    }
  };

  // Handles each respective audio ref and sets the predefined volume based on index
  const handleAudioRef = (index, ref) => {
    audioRefs.current[index] = ref;

    if (ref) {
      const volume = indexVolume(index);
      ref.volume = volume;
    }
  };

  // Sets the display modal class when the save button is clicked
  const handleEditClick = () => {
    setEditModalClass("edit-set--display");
  };

  // Resets the modal class so the display class is removed when closes,
  // allows for the modal to be re-clicked
  const resetEditModalClass = () => {
    setEditModalClass("");
  };

  // Handles download all button click  userSounds is mapped to create a sound resource
  // for each url which is converted to blob to allow for cross origin download
  const handleDownloadAll = async () => {
    try {
      const downloadPromises = savedSounds.map(async (sound) => {
        const response = await fetch(sound.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = sound.name;
        link.click();
        window.URL.revokeObjectURL(url);
      });

      await Promise.all(downloadPromises);
    } catch (error) {
      console.log(`Error:, ${error.message}`);
    }
  };

  // Loading element while any sound state is null
  if (
    !savedSounds[0] ||
    !savedSounds[1] ||
    !savedSounds[2] ||
    !savedSounds[3] ||
    !setData
  ) {
    return <Loading />;
  }

  return (
    <main>
      <section className="set">
        <div className="set__title-container">
          <h1 className="set__title">{formattedSubgenre(setData.name)}</h1>
          <button className="set__button">
            <img
              className="set__icon"
              src={editBtn}
              alt="rename set"
              onClick={handleEditClick}
            />
          </button>
        </div>
        <article
          className={`sound sound--1 ${mutedStates[0] ? "sound--muted" : ""}`}
          onClick={() => handleMuteClick(0)}
        >
          <div className={playAnimationClass ? "sound__overlay sound__overlay--1" : ""}></div>
          <button
            className="sound__button"
            onClick={(e) => handleLikeClick(e, savedSounds[0].id)}
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
          <div className={playAnimationClass ? "sound__overlay sound__overlay--2" : ""}></div>
          <button
            className="sound__button"
            onClick={(e) => handleLikeClick(e, savedSounds[1].id)}
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
          <div className={playAnimationClass ? "sound__overlay sound__overlay--3" : ""}></div>
          <button
            className="sound__button"
            onClick={(e) => handleLikeClick(e, savedSounds[2].id)}
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
          <div className={playAnimationClass ? "sound__overlay sound__overlay--4" : ""}></div>
          <button
            className="sound__button"
            onClick={(e) => handleLikeClick(e, savedSounds[3].id)}
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
                src={downloadBtn}
                alt="save set icon"
                onClick={handleDownloadAll}
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

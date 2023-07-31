import { useState, useEffect, useRef } from "react";
import {
  formattedSubgenre,
  splitOnUnderscore,
} from "../../utils/stringFormatting";
import "./SoundCard.scss";
import playIcon from "../../assets/images/icons/play-white.svg";
import StopIcon from "../../assets/images/icons/stop-white.svg";
import moreInfo from "../../assets/images/icons/more-vertical-white.svg";
import SoundOptions from "../SoundOptions/SoundOptions";

const SoundCard = ({ soundInfo, userId, handleSoundDelete }) => {
  const { id, name, type, subgenre, url } = soundInfo;

  const [audioElements, setAudioElements] = useState([]);
  const [playStates, setPlayStates] = useState([]);
  const [playAnimationClass, setPlayAnimationClass] = useState(false);
  const [optionsModalClass, setOptionsModalClass] = useState("");

  const audioRefs = useRef([]);

  // Update the audio ref when the component is rendered
  useEffect(() => {
    setAudioElements(audioRefs.current);
    setPlayStates(new Array(audioRefs.current.length).fill(false));
  }, []);

  const handleAudioRef = (index, ref) => {
    audioRefs.current[index] = ref;
  };

  const handlePlayClick = (index) => {
    const audio = audioElements[index];
    const currentPlayStates = [...playStates];
    currentPlayStates[index] = !currentPlayStates[index];
    setPlayStates(currentPlayStates);

    if (currentPlayStates[index]) {
      audio.play();
      setPlayAnimationClass(true);
    } else {
      audio.pause();
      setPlayAnimationClass(false);
    }
  };

  const handleOptionsClick = (event) => {
    event.stopPropagation();
    setOptionsModalClass("sound-options--display");
  };

  const resetOptionsModalClass = () => {
    setOptionsModalClass("");
  };

  return (
    <>
      <article className="sound-card">
        <button className="sound-card__button">
          <img
            className="play-icon"
            src={playAnimationClass ? StopIcon : playIcon}
            alt="play icon"
            onClick={() => handlePlayClick(0)}
          />
        </button>
        <div
          className={playAnimationClass ? "sound-card__play-animation" : ""}
          onClick={() => handlePlayClick(0)}
        ></div>
        <h2 className="sound-card__title">{splitOnUnderscore(name)}</h2>
        <h3 className="sound-card__subtitle">
          {formattedSubgenre(type)} | {formattedSubgenre(subgenre)}
        </h3>
        <button className="more-button" onClick={handleOptionsClick}>
          <img className="more-icon" src={moreInfo} alt="more info icon" />
        </button>
        <audio
          ref={(ref) => handleAudioRef(0, ref)}
          src={url}
          loop
          preload="auto"
        ></audio>
      </article>
      <SoundOptions
        soundId={id}
        name={name}
        url={url}
        userId={userId}
        optionsModalClass={optionsModalClass}
        resetOptionsModalClass={resetOptionsModalClass}
        handleSoundDelete={handleSoundDelete}
      />
    </>
  );
};

export default SoundCard;

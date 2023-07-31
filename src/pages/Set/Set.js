import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  formattedSubgenre,
  splitOnUnderscore,
} from "../../utils/stringFormatting";
import { randomIndex } from "../../utils/math";
import "./Set.scss";
import Loading from "../../components/Loading/Loading";
import likeBtn from "../../assets/images/icons/heart-black.svg";
import addSound from "../../assets/images/icons/plus-grey.svg";
import shuffleBtn from "../../assets/images/icons/ph_shuffle-fill-white.svg";
import playBtn from "../../assets/images/icons/play-button.svg";
import stopBtn from "../../assets/images/icons/stop-button.svg";
import resetBtn from "../../assets/images/icons//reset-button.svg";
import saveBtn from "../../assets/images/icons/save-white.svg";
import SaveSet from "../../components/SaveSet/SaveSet";

const Set = () => {
  const [drums, setDrums] = useState(null);
  const [harmony, setHarmony] = useState(null);
  const [bass, setBass] = useState(null);
  const [synth, setSynth] = useState(null);
  const [audioElements, setAudioElements] = useState([]);
  const [mutedStates, setMutedStates] = useState([]);
  const [saveModalClass, setSaveModalClass] = useState("");
  const [playAnimationClass, setPlayAnimationClass] = useState(true);
  const [isShakingDrums, setIsShakingDrums] = useState(false);
  const [isShakingHarm, setIsShakingHarm] = useState(false);
  const [isShakingBass, setIsShakingBass] = useState(false);
  const [isShakingSynth, setIsShakingSynth] = useState(false);

  const audioRefs = useRef([]);

  const { subgenre } = useParams();

  // Requests bass sample from API using the key & scale restraints set by the harmony sample
  // If no sample in the defined key/scale exists, a random sample is selected
  const getBass = async (subgenre, key_scale, rel_key_scale) => {
    try {
      const bassQuery = `?type=bass&subgenre=${subgenre}&key_scale=${key_scale}&rel_key_scale=${rel_key_scale}`;
      const bassQueryRel = `?type=bass&subgenre=${subgenre}&key_scale=${rel_key_scale}&rel_key_scale=${key_scale}`;
      const bassQueryAny = `?type=bass&subgenre=${subgenre}`;

      // Request bass in the same key & scale as the chords
      const bassResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/sounds${bassQuery}`
      );

      // If no match is found, request bass in the same relative key & scale as the chords
      if (bassResponse.data.length === 0) {
        const bassResponseRel = await axios.get(
          `${process.env.REACT_APP_API_URL}/sounds${bassQueryRel}`
        );

        setBass(bassResponseRel.data[randomIndex(bassResponseRel.data)]);

        // If no match is found again, request bass in any key & scale
        if (bassResponseRel.data.length === 0) {
          const bassResponseAny = await axios.get(
            `${process.env.REACT_APP_API_URL}/sounds${bassQueryAny}`
          );

          setBass(bassResponseAny.data[randomIndex(bassResponseAny.data)]);

          return;
        }

        setBass(bassResponse.data[randomIndex(bassResponse.data)]);
      }
    } catch (error) {
      console.log(
        `Error ${error.response.status}: ${error.response.data.message}`
      );
    }
  };

  // Requests synth sample from API using the key & scale restraints set by the harmony sample
  // If no sample in the defined key/scale exists, a random sample is selected
  const getSynth = async (subgenre, key_scale, rel_key_scale) => {
    try {
      const synthQuery = `?type=synth&subgenre=${subgenre}&key_scale=${key_scale}&rel_key_scale=${rel_key_scale}`;
      const synthQueryRel = `?type=synth&subgenre=${subgenre}&key_scale=${rel_key_scale}&rel_key_scale=${key_scale}`;
      const synthQueryAny = `?type=synth&subgenre=${subgenre}`;

      // Request synth in the same key & scale as the chords
      const synthResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/sounds${synthQuery}`
      );

      // If no match is found, request synth in the same relative key & scale as the chords
      if (synthResponse.data.length === 0) {
        const synthResponseRel = await axios.get(
          `${process.env.REACT_APP_API_URL}/sounds${synthQueryRel}`
        );

        setSynth(synthResponseRel.data[randomIndex(synthResponseRel.data)]);

        // If no match is found again, request synth in any key & scale
        if (synthResponseRel.data.length === 0) {
          const synthResponseAny = await axios.get(
            `${process.env.REACT_APP_API_URL}/sounds${synthQueryAny}`
          );

          setSynth(synthResponseAny.data[randomIndex(synthResponseAny.data)]);

          return;
        }

        setSynth(synthResponse.data[randomIndex(synthResponse.data)]);
      }
    } catch (error) {
      console.log(
        `Error ${error.response.status}: ${error.response.data.message}`
      );
    }
  };

  // Requests intial sounds from API and sets into state.
  const getInitialSounds = async () => {
    try {
      // DRUMS
      const drumQuery = `?type=drums&subgenre=${subgenre}`;

      const drumResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/sounds${drumQuery}`
      );

      setDrums(drumResponse.data[randomIndex(drumResponse.data)]);

      // CHORDS, KEYS & PADS
      const harmonyQuery = `?type=harmony&subgenre=${subgenre}`;

      const harmonyResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/sounds${harmonyQuery}`
      );

      const { key_scale, rel_key_scale } = harmonyResponse.data;

      setHarmony(harmonyResponse.data[randomIndex(harmonyResponse.data)]);

      // BASS
      getBass(subgenre, key_scale, rel_key_scale);

      // SYNTH
      getSynth(subgenre, key_scale, rel_key_scale);
    } catch (error) {
      console.log(
        `Error ${error.response.status}: ${error.response.data.message}`
      );
    }
  };

  // Add liked sound to database
  const likeSound = async (soundId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/profile/${process.env.REACT_APP_USER_ID}/sounds`,
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

  // Handles the like button click, updates state to trigger animation
  // prevents event bubbling to parent elements
  // These are duplicated until a sound component is created
  const handleLikeClickDrums = (e, soundId) => {
    e.stopPropagation();

    setIsShakingDrums(true);
    likeSound(soundId);
    setTimeout(() => {
      setIsShakingDrums(false);
    }, 1000);
  };

  const handleLikeClickHarm = (e, soundId) => {
    e.stopPropagation();

    setIsShakingHarm(true);
    likeSound(soundId);
    setTimeout(() => {
      setIsShakingHarm(false);
    }, 1000);
  };

  const handleLikeClickBass = (e, soundId) => {
    e.stopPropagation();

    setIsShakingBass(true);
    likeSound(soundId);
    setTimeout(() => {
      setIsShakingBass(false);
    }, 1000);
  };

  const handleLikeClickSynth = (e, soundId) => {
    e.stopPropagation();

    setIsShakingSynth(true);
    likeSound(soundId);
    setTimeout(() => {
      setIsShakingSynth(false);
    }, 1000);
  };

  // Handles the shuffle click and calls the get sounds function
  const handleShuffleClick = () => {
    getInitialSounds();
  };

  // Get sounds when the component is mounted and when the on the subgenre variable updates
  useEffect(() => {
    getInitialSounds();
  }, [subgenre]);

  // Update the audio ref and mute states when the component is rendered
  useEffect(() => {
    setAudioElements(audioRefs.current);
    setMutedStates(new Array(audioRefs.current.length).fill(false));
  }, []);

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

  // Handles reset click by resetting time to 0, and playing for all audio,
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
  const handleSaveClick = () => {
    setSaveModalClass("save-set--display");
  };

  // Resets the modal class so the display class is removed when closes,
  //allows for the modal to be re-clicked
  const resetSaveModalClass = () => {
    setSaveModalClass("");
  };

  // Loading element while any sound state is null
  if (!drums || !harmony || !bass || !synth) {
    return <Loading />;
  }

  return (
    <main>
      <section className="set">
        <h1 className="set__title">{formattedSubgenre(subgenre)}</h1>
        <article
          className={`sound sound--1 ${mutedStates[0] ? "sound--muted" : ""}`}
          onClick={() => handleMuteClick(0)}
        >
          <div className={playAnimationClass ? "sound__overlay sound__overlay--1" : ""}></div>
          <button
            className="sound__button"
            onClick={(e) => handleLikeClickDrums(e, drums.id)}
          >
            <img
              className={`sound__like-icon ${
                isShakingDrums ? "sound__like-icon--shake" : ""
              }`}
              src={likeBtn}
              alt="like icon"
            />
          </button>
          <div className="sound__info-container">
            <h2 className="sound__type">{drums.type.toUpperCase()}</h2>
            <h3 className="sound__name">{splitOnUnderscore(drums.name)}</h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(0, ref)}
            src={drums.url}
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
            onClick={(e) => handleLikeClickHarm(e, harmony.id)}
          >
            <img
              className={`sound__like-icon ${
                isShakingHarm ? "sound__like-icon--shake" : ""
              }`}
              src={likeBtn}
              alt="like icon"
            />
          </button>
          <div className="sound__info-container">
            <h2 className="sound__type">{harmony.type.toUpperCase()}</h2>
            <h3 className="sound__name">{splitOnUnderscore(harmony.name)}</h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(1, ref)}
            src={harmony.url}
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
            onClick={(e) => handleLikeClickBass(e, bass.id)}
          >
            <img
              className={`sound__like-icon ${
                isShakingBass ? "sound__like-icon--shake" : ""
              }`}
              src={likeBtn}
              alt="like icon"
            />
          </button>
          <div className="sound__info-container">
            <h2 className="sound__type">{bass.type.toUpperCase()}</h2>
            <h3 className="sound__name">{splitOnUnderscore(bass.name)}</h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(2, ref)}
            src={bass.url}
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
            onClick={(e) => handleLikeClickSynth(e, synth.id)}
          >
            <img
              className={`sound__like-icon ${
                isShakingSynth ? "sound__like-icon--shake" : ""
              }`}
              src={likeBtn}
              alt="like icon"
            />
          </button>
          <div className="sound__info-container">
            <h2 className="sound__type">{synth.type.toUpperCase()}</h2>
            <h3 className="sound__name">{splitOnUnderscore(synth.name)}</h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(3, ref)}
            src={synth.url}
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
                onClick={handleSaveClick}
              />
            </div>
          </div>
        </div>
      </section>
      <SaveSet
        subgenre={subgenre}
        drumsId={drums.id}
        harmonyId={harmony.id}
        bassId={bass.id}
        synthId={synth.id}
        saveModalClass={saveModalClass}
        resetSaveModalClass={resetSaveModalClass}
      />
    </main>
  );
};

export default Set;

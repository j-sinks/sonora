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
import moreInfo from "../../assets/images/icons/more-horizontal-black.svg";
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
  const audioRefs = useRef([]);

  const [mutedStates, setMutedStates] = useState([]);

  const [saveModalClass, setSaveModalClass] = useState("");

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

  const handleShuffleClick = () => {
    getInitialSounds();
  };

  // Re-render page based on the subgenre param
  useEffect(() => {
    getInitialSounds();
  }, [subgenre]);

  // Update the audio ref when the component is rendered
  useEffect(() => {
    setAudioElements(audioRefs.current);
    setMutedStates(new Array(audioRefs.current.length).fill(false));
  }, []);

  // For the progress bar animation
  // useEffect(() => {
  //   const handleTimeUpdate = (index) => {
  //     const audio = audioElements[index];
  //     const container = audio.closest("article");

  //     const progress = (audio.currentTime / audio.duration) * 100;
  //     container.style.setProperty("--progress-width", `${progress}%`);
  //   };

  //   audioElements.forEach((audio, index) => {
  //     audio.addEventListener("timeupdate", () => handleTimeUpdate(index));
  //   });

  //   return () => {
  //     audioElements.forEach((audio, index) => {
  //       audio.removeEventListener("timeupdate", () => handleTimeUpdate(index));
  //     });
  //   };
  // }, [audioElements]);

  const handlePlayClick = () => {
    audioElements.forEach((audio) => {
      audio.play();
    });
  };

  const handleStopClick = () => {
    audioElements.forEach((audio) => {
      audio.pause();
    });
  };

  const handleResetClick = () => {
    audioElements.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    });
  };

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

  const handleSaveClick = () => {
    setSaveModalClass("save-set--display");
  };

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
        <article className="sound sound--1" onClick={() => handleMuteClick(0)}>
          <img
            className="sound__more-icon"
            src={moreInfo}
            alt="more info icon"
          />
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
        <article className="sound sound--2" onClick={() => handleMuteClick(1)}>
          <img
            className="sound__more-icon"
            src={moreInfo}
            alt="more info icon"
          />
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
        <article className="sound sound--3" onClick={() => handleMuteClick(2)}>
          <img
            className="sound__more-icon"
            src={moreInfo}
            alt="more info icon"
          />
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
        <article className="sound sound--4" onClick={() => handleMuteClick(3)}>
          <img
            className="sound__more-icon"
            src={moreInfo}
            alt="more info icon"
          />
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

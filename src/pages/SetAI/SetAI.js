import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { splitOnUnderscore } from "../../utils/stringFormatting";
import { randomIndex } from "../../utils/math";
import "./SetAI.scss";
import Loading from "../../components/Loading/Loading";
import moreInfo from "../../assets/images/icons/more-horizontal-black.svg";
import addSound from "../../assets/images/icons/plus-grey.svg";
import shuffleBtn from "../../assets/images/icons/ph_shuffle-fill-white.svg";
import playBtn from "../../assets/images/icons/play-button.svg";
import stopBtn from "../../assets/images/icons/stop-button.svg";
import resetBtn from "../../assets/images/icons//reset-button.svg";
import saveBtn from "../../assets/images/icons/save-white.svg";

const SetAI = ({ genreData }) => {
  const { instruments, bpm } = genreData;
  // console.log(genreData);

  const [sound1, setSound1] = useState(null);
  const [sound2, setSound2] = useState(null);
  const [sound3, setSound3] = useState(null);
  const [sound4, setSound4] = useState(null);

  const [audioElements, setAudioElements] = useState([]);
  const audioRefs = useRef([]);

  const [mutedStates, setMutedStates] = useState([]);

  // const { subgenre } = useParams();

  // Requests bass sample from API using the key & scale restraints set by the harmony sample
  // If no sample in the defined key/scale exists, a random sample is selected
  // const getBass = async (subgenre, key_scale, rel_key_scale) => {
  //   try {
  //     const bassQuery = `?type=bass&subgenre=${subgenre}&key_scale=${key_scale}&rel_key_scale=${rel_key_scale}`;
  //     const bassQueryRel = `?type=bass&subgenre=${subgenre}&key_scale=${rel_key_scale}&rel_key_scale=${key_scale}`;
  //     const bassQueryAny = `?type=bass&subgenre=${subgenre}`;

  //     // Request bass in the same key & scale as the chords
  //     const bassResponse = await axios.get(
  //       `${process.env.REACT_APP_API_URL}/sounds${bassQuery}`
  //     );

  //     // If no match is found, request bass in the same relative key & scale as the chords
  //     if (bassResponse.data.length === 0) {
  //       const bassResponseRel = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/sounds${bassQueryRel}`
  //       );

  //       setSound3(bassResponseRel.data[randomIndex(bassResponseRel.data)]);

  //       // If no match is found again, request bass in any key & scale
  //       if (bassResponseRel.data.length === 0) {
  //         const bassResponseAny = await axios.get(
  //           `${process.env.REACT_APP_API_URL}/sounds${bassQueryAny}`
  //         );

  //         setBass(bassResponseAny.data[randomIndex(bassResponseAny.data)]);

  //         return;
  //       }

  //       setBass(bassResponse.data[randomIndex(bassResponse.data)]);
  //     }
  //   } catch (error) {
  //     console.log(
  //       `Error ${error.response.status}: ${error.response.data.message}`
  //     );
  //   }
  // };

  // Requests synth sample from API using the key & scale restraints set by the harmony sample
  // If no sample in the defined key/scale exists, a random sample is selected
  // const getSynth = async (subgenre, key_scale, rel_key_scale) => {
  //   try {
  //     const synthQuery = `?type=synth&subgenre=${subgenre}&key_scale=${key_scale}&rel_key_scale=${rel_key_scale}`;
  //     const synthQueryRel = `?type=synth&subgenre=${subgenre}&key_scale=${rel_key_scale}&rel_key_scale=${key_scale}`;
  //     const synthQueryAny = `?type=synth&subgenre=${subgenre}`;

  //     // Request synth in the same key & scale as the chords
  //     const synthResponse = await axios.get(
  //       `${process.env.REACT_APP_API_URL}/sounds${synthQuery}`
  //     );

  //     // If no match is found, request synth in the same relative key & scale as the chords
  //     if (synthResponse.data.length === 0) {
  //       const synthResponseRel = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/sounds${synthQueryRel}`
  //       );

  //       setSound4(synthResponseRel.data[randomIndex(synthResponseRel.data)]);

  //       // If no match is found again, request synth in any key & scale
  //       if (synthResponseRel.data.length === 0) {
  //         const synthResponseAny = await axios.get(
  //           `${process.env.REACT_APP_API_URL}/sounds${synthQueryAny}`
  //         );

  //         setSynth(synthResponseAny.data[randomIndex(synthResponseAny.data)]);

  //         return;
  //       }

  //       setSynth(synthResponse.data[randomIndex(synthResponse.data)]);
  //     }
  //   } catch (error) {
  //     console.log(
  //       `Error ${error.response.status}: ${error.response.data.message}`
  //     );
  //   }
  // };

  // Requests intial sounds from API and sets into state.
  const getInitialSounds = async () => {
    const pageSize = "page_size=50";
    const duration = "duration:[5.0 TO 60.0]";
    const tonality = 'ac_tonality:"C minor"';
    const tempo = `ac_tempo:[${bpm}]`;

    try {
      // SOUND 1

      const sound1InitialResponse = await axios.get(
        `${process.env.REACT_APP_FS_API_URL}/search/text/?query=${instruments[0]}&${pageSize}&filter=${duration}&filter=${tonality}&filter=${tempo}&token=${process.env.REACT_APP_FS_API_KEY}`
      );

      // console.log(sound1InitialResponse);

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
        `${process.env.REACT_APP_FS_API_URL}/search/text/?query=${instruments[1]}&${pageSize}&filter=${duration}&filter=${tonality}&filter=${tempo}&token=${process.env.REACT_APP_FS_API_KEY}`
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
        `${process.env.REACT_APP_FS_API_URL}/search/text/?query=${instruments[2]}&${pageSize}&filter=${duration}&filter=${tonality}&filter=${tempo}&token=${process.env.REACT_APP_FS_API_KEY}`
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
        `${process.env.REACT_APP_FS_API_URL}/search/text/?query=${instruments[3]}&${pageSize}&filter=${duration}&filter=${tonality}&filter=${tempo}&token=${process.env.REACT_APP_FS_API_KEY}`
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

  // Loading element while any sound state is null
  if (!sound1 || !sound2 || !sound3 || !sound4) {
    return <Loading />;
  }

  return (
    <main>
      <section className="set">
        <article className="sound sound--1" onClick={() => handleMuteClick(0)}>
          <img
            className="sound__more-icon"
            src={moreInfo}
            alt="more info icon"
          />
          <div className="sound__info-container">
            <h2 className="sound__type">SOUND 1</h2>
            <h3 className="sound__name">{splitOnUnderscore(sound1.name)}</h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(0, ref)}
            src={sound1.previews["preview-hq-mp3"]}
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
            <h2 className="sound__type">SOUND 2</h2>
            <h3 className="sound__name">{splitOnUnderscore(sound2.name)}</h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(1, ref)}
            src={sound2.previews["preview-hq-mp3"]}
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
            <h2 className="sound__type">SOUND 3</h2>
            <h3 className="sound__name">{splitOnUnderscore(sound3.name)}</h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(2, ref)}
            src={sound3.previews["preview-hq-mp3"]}
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
            <h2 className="sound__type">SOUND 4</h2>
            <h3 className="sound__name">{splitOnUnderscore(sound4.name)}</h3>
          </div>
          <audio
            ref={(ref) => handleAudioRef(3, ref)}
            src={sound4.previews["preview-hq-mp3"]}
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
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SetAI;

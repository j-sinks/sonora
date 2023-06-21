import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Set.scss";
import Loading from "../../components/Loading/Loading";


const Set = () => {
  // Crete 4 GET requests to retrieve sounds based on params (useParams)
  // If sound in key does not exist, find one from top level genre
  const [drums, setDrums] = useState(null);
  const [harmony, setHarmony] = useState(null);
  const [bass, setBass] = useState(null);
  const [synth, setSynth] = useState(null);

  const { subgenre } = useParams();

  // Generate random index
  const randomIndex = (arr) => {
    return Math.floor(Math.random() * arr.length)
  }

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
    
          setBass(bassResponseRel.data[randomIndex(bassResponseRel.data)])

          // If no match is found again, request bass in any key & scale
          if (bassResponseRel.data.length === 0) {
            const bassResponseAny = await axios.get(
              `${process.env.REACT_APP_API_URL}/sounds${bassQueryAny}`
            );

            setBass(bassResponseAny.data[randomIndex(bassResponseAny.data)])
          
            return;
          }

        setBass(bassResponse.data[randomIndex(bassResponse.data)])
      }
      
    } catch (error) {
      console.log(
        `Error ${error.response.status}: ${error.response.data.message}`
      );
    }
  }

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
    
          setSynth(synthResponseRel.data[randomIndex(synthResponseRel.data)])

          // If no match is found again, request synth in any key & scale
          if (synthResponseRel.data.length === 0) {
            const synthResponseAny = await axios.get(
              `${process.env.REACT_APP_API_URL}/sounds${synthQueryAny}`
            );

            setSynth(synthResponseAny.data[randomIndex(synthResponseAny.data)])
          
            return;
          }

        setSynth(synthResponse.data[randomIndex(synthResponse.data)])
      }
      
    } catch (error) {
      console.log(
        `Error ${error.response.status}: ${error.response.data.message}`
      );
    }
  }

  const getInitialSounds = async () => {
    try {

      // DRUMS
      const drumQuery = `?type=drums&subgenre=${subgenre}`;

      const drumResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/sounds${drumQuery}`
      );

      setDrums(drumResponse.data[randomIndex(drumResponse.data)])

      // CHORDS, KEYS & PADS
      const harmonyQuery = `?type=harmony&subgenre=${subgenre}`;

      const harmonyResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/sounds${harmonyQuery}`
      );

      const { key_scale, rel_key_scale }  = harmonyResponse.data

      setHarmony(harmonyResponse.data[randomIndex(harmonyResponse.data)])

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

  useEffect(() => {
    getInitialSounds();
  }, [subgenre]);

  if (!drums || !harmony || !bass || !synth) {
    return <Loading />;
  }

  return (
    <main className="set">
      <audio src={drums.url} controls loop preload="auto" autoPlay></audio>
      <audio src={harmony.url} controls loop preload="auto" autoPlay></audio>
      <audio src={bass.url} controls loop preload="auto" autoPlay></audio>
      <audio src={synth.url} controls loop preload="auto" autoPlay></audio>
    </main>
  );
};

export default Set;

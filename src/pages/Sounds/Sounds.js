import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Sounds.scss";
import Loading from "../../components/Loading/Loading";
import SoundCard from "../../components/SoundCard/SoundCard";
import downloadBtn from "../../assets/images/icons/download-white.svg";

const Sounds = () => {
  const [userSounds, setUserSounds] = useState([]);

  const { userId } = useParams();

  const getSounds = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/profile/${userId}/sounds`
      );

      setUserSounds(response.data);
    } catch (error) {
      console.log(
        `Error ${error.response.status}: ${error.response.data.message}`
      );
    }
  };

  useEffect(() => {
    getSounds();
  }, []);

  // Handles download all button click  userSounds is mapped to create a sound resource
  // for each url which is converted to blob to allow for cross origin download
  const handleDownloadAll = async () => {
    try {
      const downloadPromises = userSounds.map(async (sound) => {
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

  const handleSoundDelete = (soundId) => {
    setUserSounds(userSounds.filter((userSound) => userSound.id !== soundId));
  };

  // Loading element while user sets state is undefined
  if (!userSounds) {
    return <Loading />;
  }
  return (
    <main className="sounds">
      <div className="sounds__title-container">
        <h1 className="sounds__title">Your Sounds</h1>
        <button className="sounds__button" onClick={handleDownloadAll}>
          <img src={downloadBtn} alt="download all liked sounds" />
        </button>
      </div>
      <section className="sounds_container">
        {userSounds.map((userSound) => (
          <SoundCard
            key={userSound.id}
            soundInfo={userSound}
            userId={userId}
            handleSoundDelete={handleSoundDelete}
          />
        ))}
      </section>
      <Link className="sounds__link" to="/">
        <h2 className="sounds__link-title">+ Create Set</h2>
      </Link>
    </main>
  );
};

export default Sounds;

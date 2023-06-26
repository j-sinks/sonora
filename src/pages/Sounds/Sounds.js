import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Sounds.scss";
import Loading from "../../components/Loading/Loading";
import SoundCard from "../../components/SoundCard/SoundCard";

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

  // const handleSetDelete = (setId) => {
  //   setUserSounds(userSounds.filter((userSet) => userSet.id !== setId));
  // };

  // Loading element while user sets state is undefined
  if (!userSounds) {
    return <Loading />;
  }
  return (
    <main className="sounds">
      <h1 className="sounds__title">Your Sounds</h1>
      <section className="sounds_container">
        {userSounds.map((userSound) => (
          <SoundCard
            key={userSound.id}
            soundInfo={userSound}
            userId={userId}
            // handleSetDelete={handleSetDelete}
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

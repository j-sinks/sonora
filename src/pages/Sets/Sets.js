import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Sets.scss";
import Loading from "../../components/Loading/Loading";
import SetCard from "../../components/SetCard/SetCard";

const Sets = () => {
  const [userSets, setUserSets] = useState([]);

  const { userId } = useParams();

  const getSets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/profile/${userId}/sets`
      );

      const setsSorted = response.data.sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });

      setUserSets(setsSorted);
    } catch (error) {
      console.log(
        `Error ${error.response.status}: ${error.response.data.message}`
      );
    }
  };

  useEffect(() => {
    getSets();
  }, []);

  const handleSetDelete = (setId) => {
    setUserSets(userSets.filter((userSet) => userSet.id !== setId));
  };

  // Loading element while user sets state is undefined
  if (!userSets) {
    return <Loading />;
  }
  return (
    <main className="sets">
      <h1 className="sets__title">Your Sets</h1>
      <section className="sets_container">
        {userSets.map((userSet) => (
          <SetCard
            key={userSet.id}
            setInfo={userSet}
            userId={userId}
            handleSetDelete={handleSetDelete}
          />
        ))}
      </section>
      <Link className="sets__link" to="/">
        <h2 className="sets__link-title">+ Create Set</h2>
      </Link>
    </main>
  );
};

export default Sets;

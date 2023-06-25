import { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  formattedSubgenre,
  capitaliseFirstLetter,
} from "../../utils/stringFormatting";
import "./SetCard.scss";
import playIcon from "../../assets/images/icons/play-white.svg";
import moreInfo from "../../assets/images/icons/more-vertical-white.svg";
import SetOptions from "../SetOptions/SetOptions";

const SetCard = ({ setInfo, userId, getSets }) => {
  const { id, name, genre, updated_at } = setInfo;

  const [optionsModalClass, setOptionsModalClass] = useState("");

  const handleOptionsClick = (event) => {
    event.stopPropagation();
    setOptionsModalClass("set-options--display");
  };

  const resetOptionsModalClass = () => {
    setOptionsModalClass("");
  };

  return (
    <>
      <article className="set-card">
        <Link className="set-card__link" to={`/profile/${userId}/sets/${id}`}>
          <img className="play-icon" src={playIcon} alt="play icon" />
          <h2 className="set-card__title">{capitaliseFirstLetter(name)}</h2>
          <h3 className="set-card__subtitle">
            {formattedSubgenre(genre)} |{" "}
            {moment(updated_at).format("MMM DD, YYYY")}
          </h3>
        </Link>
        <button className="more-button" onClick={handleOptionsClick}>
          <img className="more-icon" src={moreInfo} alt="more info icon" />
        </button>
      </article>
      <SetOptions
        setId={id}
        name={name}
        userId={userId}
        optionsModalClass={optionsModalClass}
        resetOptionsModalClass={resetOptionsModalClass}
        getSets={getSets}
      />
    </>
  );
};

export default SetCard;

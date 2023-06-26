import { useState } from "react";
import axios from "axios";
import { splitOnUnderscore } from "../../utils/stringFormatting";
import "./SoundOptions.scss";
import downloadBtn from "../../assets/images/icons/download-white.svg";
import deleteBtn from "../../assets/images/icons/delete-1-white.svg";

const SoundOptions = ({
  soundId,
  name,
  url,
  userId,
  optionsModalClass,
  resetOptionsModalClass,
  handleSoundDelete,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Deletes the selected sound
  const deleteSound = async () => {
    try {
      axios.delete(
        `${process.env.REACT_APP_API_URL}/profile/${userId}/sounds/${soundId}`
      );
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  const handleDeleteClick = () => {
    deleteSound();
    handleSoundDelete(soundId);
    setIsVisible(true);
    resetOptionsModalClass();
    setIsVisible(false);
  };

  const handleCancelClick = () => {
    setIsVisible(true);
    resetOptionsModalClass();
    setIsVisible(false);
  };

  return (
    <article
      className={
        !isVisible
          ? `set-options ${optionsModalClass}`
          : "set-options set-options--hide"
      }
    >
      <h1 className="set-options__title">{splitOnUnderscore(name)}</h1>
      <div className="set-options__container">
        <button className="set-options__button">
          <a href={url} download>
            <img
              className="set-options__icon"
              src={downloadBtn}
              alt="download icon"
            />
          </a>
        </button>
        <h2 className="set-options__text">Download</h2>
      </div>
      <div className="set-options__container">
        <button className="set-options__button" onClick={handleDeleteClick}>
          <img
            className="set-options__icon"
            src={deleteBtn}
            alt="delete icon"
          />
        </button>
        <h2 className="set-options__text">Delete</h2>
      </div>
      <div className="set-options__btn-container">
        <button className="set-options__cancel" onClick={handleCancelClick}>
          Cancel
        </button>
      </div>
    </article>
  );
};

export default SoundOptions;

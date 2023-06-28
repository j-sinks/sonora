import { useState, useEffect } from "react";
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

  const [downloadUrl, setDownloadUrl] = useState("");

  // On render get the sound resource and convert to blob to allow for cross origin download
  // When the compenent is unmounted the resource is removed via a clean-up function
  useEffect(() => {
    const GetSoundFile = async () => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setDownloadUrl(blobUrl);
      } catch (error) {
        console.log(`Error:, ${error.message}`);
      }
    };

    GetSoundFile();

    return () => {
      URL.revokeObjectURL(downloadUrl);
    };
  }, [url]);

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
          ? `sound-options ${optionsModalClass}`
          : "sound-options sound-options--hide"
      }
    >
      <div className="sound-options__top-container">
        <h1 className="sound-options__title">{splitOnUnderscore(name)}</h1>
        <div className="sound-options__container">
          <button className="sound-options__button">
            <a href={downloadUrl} download={name}>
              <img
                className="sound-options__icon"
                src={downloadBtn}
                alt="download icon"
              />
            </a>
          </button>
          <h2 className="sound-options__text">Download</h2>
        </div>
        <div className="sound-options__container">
          <button className="sound-options__button" onClick={handleDeleteClick}>
            <img
              className="sound-options__icon"
              src={deleteBtn}
              alt="delete icon"
            />
          </button>
          <h2 className="sound-options__text">Delete</h2>
        </div>
        <div className="sound-options__btn-container">
          <button className="sound-options__cancel" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </article>
  );
};

export default SoundOptions;

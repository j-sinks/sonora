import { useState } from "react";
import axios from "axios";
import "./SetOptions.scss";
import editBtn from "../../assets/images/icons/edit-white.svg";
import deleteBtn from "../../assets/images/icons/delete-1-white.svg";
import EditSet from "../EditSet/EditSet";

const SetOptions = ({
  setId,
  name,
  userId,
  optionsModalClass,
  resetOptionsModalClass,
  handleSetDelete,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [editModalClass, setEditModalClass] = useState("");

  const handleEditClick = () => {
    setEditModalClass("edit-set--display");
  };

  const resetEditModalClass = () => {
    setEditModalClass("");
  };

  // Deletes the selected set
  const deleteSet = async () => {
    try {
      axios.delete(
        `${process.env.REACT_APP_API_URL}/profile/${userId}/sets/${setId}`
      );
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  const handleDeleteClick = () => {
    deleteSet();
    handleSetDelete(setId);
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
      <div className="set-options__top-container">
        <h1 className="set-options__title">{name}</h1>
        <div className="set-options__container">
          <button className="set-options__button" onClick={handleEditClick}>
            <img className="set-options__icon" src={editBtn} alt="edit icon" />
          </button>
          <h2 className="set-options__text">Rename</h2>
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
      </div>
      <EditSet
        userId={userId}
        setId={setId}
        editModalClass={editModalClass}
        resetEditModalClass={resetEditModalClass}
      />
    </article>
  );
};

export default SetOptions;

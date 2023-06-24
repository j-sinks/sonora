import { useState } from "react";
import axios from "axios";
import "./EditSet.scss";

const EditSet = ({ userId, setId, editModalClass, resetEditModalClass }) => {
  const [isVisible, setIsVisible] = useState(false);

  const [input, setInput] = useState("");
  const [inputIsTouched, setInputIsTouched] = useState(false);

  // Updates form state based on user input
  // Also updates state so validation knows the form has been interacted with
  const handleChangeInput = (event) => {
    setInput(event.target.value);
    setInputIsTouched(true);
  };

  // Check the input is not empty
  const isFormValid = () => {
    if (!input) {
      return false;
    }

    return true;
  };

  // Update set name
  const editSet = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/profile/${userId}/sets/${setId}`,
        {
          name: input,
        }
      );
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  // Removes modifier class to hide the modal
  // Resets state in component & parent to allow for re-clicking
  const handleCancelClick = () => {
    setIsVisible(true);
    resetEditModalClass();
    setIsVisible(false);
  };

  // Allows for the functionality outlined above, plus updates selected set
  const handleEditSubmit = (event) => {
    setInputIsTouched(true);

    if (!isFormValid()) {
      return;
    }

    editSet();
    setInput("");
    setInputIsTouched(false);
    setIsVisible(true);
    resetEditModalClass();
    setIsVisible(false);
  };

  return (
    <article className={!isVisible ? `edit-set ${editModalClass}` : "edit-set"}>
      <form className="edit-set__form" noValidate autoComplete="off">
        <label className="edit-set__label" htmlFor="name">
          Rename Set
        </label>
        <input
          className="edit-set__input"
          type="text"
          name="name"
          placeholder="Add set name"
          onChange={handleChangeInput}
          value={input}
        />
        {inputIsTouched && !isFormValid() && (
          <small className="edit-set__error">Set name is required</small>
        )}
        <div className="edit-set__btn-container">
          <button
            className="edit-set__btn edit-set__btn--cancel"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
          <button
            className="edit-set__btn edit-set__btn--save"
            onClick={handleEditSubmit}
          >
            Save
          </button>
        </div>
      </form>
    </article>
  );
};

export default EditSet;

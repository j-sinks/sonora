import { useState } from "react";
import axios from "axios";
import "./SaveSet.scss";

const SaveSet = ({
  subgenre,
  drumsId,
  harmonyId,
  bassId,
  synthId,
  saveModalClass,
  resetSaveModalClass,
}) => {
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

  // Save set
  const saveSet = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/profile/${process.env.REACT_APP_USER_ID}/sets`,
        {
          user_id: `${process.env.REACT_APP_USER_ID}`,
          name: input,
          genre: subgenre,
          sounds: [drumsId, harmonyId, bassId, synthId],
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
    resetSaveModalClass();
    setIsVisible(false);

  };

  // Allows for the functionality outlined above, plus deletes selected warehouse
  const handleSaveSubmit = (event) => {
    event.preventDefault();
    setInputIsTouched(true);

    if (!isFormValid()) {
      return;
    }

    saveSet();
    setInput("");
    setInputIsTouched(false);
    setIsVisible(true);
    resetSaveModalClass();
    setIsVisible(false);
    
  };

  return (
    <article className={!isVisible ? `save-set ${saveModalClass}` : "save-set"}>
      <form
        className="save-set__form"
        noValidate
        autoComplete="off"
        onSubmit={handleSaveSubmit}
      >
        <label className="save-set__label" htmlFor="name">
          Name Set
        </label>
        <input
          className="save-set__input"
          type="text"
          name="name"
          placeholder="Add set name"
          onChange={handleChangeInput}
          value={input}
        />
        {inputIsTouched && !isFormValid() && (
          <small className="save-set__error">Set name is required</small>
        )}
        <div className="save-set__btn-container">
          <button
            className="save-set__btn save-set__btn--cancel"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
          <button className="save-set__btn save-set__btn--save">Save</button>
        </div>
      </form>
    </article>
  );
};

export default SaveSet;

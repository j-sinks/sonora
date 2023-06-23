import { useState } from "react";
import axios from "axios";
import "./SaveSet.scss";

const SaveSet = ({ saveModalClass, resetSaveModalClass }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Save set
  // const saveSet = async () => {
  //   try {
  //     axios.post(process.env.REACT_APP_API_URL + "/warehouses/" + id);
  //   } catch (error) {
  //     console.log(`Error: ${error.message}`);
  //   }
  // };

  // Removes modifier class to hide the modal
  // Resets state in component & parent to allow for re-clicking
  const handleCancelClick = () => {
    setIsVisible(true);
    resetSaveModalClass();
    setIsVisible(false);
  };

  // Allows for the functionality outlined above, plus deletes selected warehouse
  const handleSaveClick = () => {
    // SaveSet();
    setIsVisible(true);
    resetSaveModalClass();
    setIsVisible(false);
  };

  return (
    <article className= {
      !isVisible ? `save-set ${saveModalClass}` : "save-set"
    }>
      <form  className="save-set__form"action="">
        <label className="save-set__label">Name Set</label>
        <input className="save-set__input" type="text" />
        <div className="save-set__btn-container">
          <button className="save-set__btn save-set__btn--cancel" onClick={handleCancelClick}>Cancel</button>
          <button className="save-set__btn save-set__btn--save" onClick={handleSaveClick}>Save</button>
        </div>
      </form>
    </article>
  )
};

export default SaveSet;
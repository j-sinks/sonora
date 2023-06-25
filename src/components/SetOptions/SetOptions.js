import "./SetOptions.scss";
import editBtn from "../../assets/images/icons/edit-white.svg";
import deleteBtn from "../../assets/images/icons/delete-1-white.svg";

const SetOptions = () => {
  return (
    <article className="set-options">
      <h1 className="set-options__title">Title</h1>
      <div className="set-options__container">
        <button className="set-options__button">
          <img className="set-options__icon" src={editBtn} alt="edit icon" />
        </button>
        <h2 className="set-options__text">Rename</h2>
      </div>
      <div className="set-options__container">
        <button className="set-options__button">
          <img className="set-options__icon" src={deleteBtn} alt="delete icon" />
        </button>
        <h2 className="set-options__text">Delete</h2>
      </div>
      <div className="set-options__btn-container">
        <button className="set-options__cancel">Cancel</button>
      </div>
    </article>
  )
};

export default SetOptions;

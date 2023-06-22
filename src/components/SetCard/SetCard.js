import { Link } from "react-router-dom";
import moment from "moment";
import { formattedSubgenre, capitaliseFirstLetter } from "../../utils/stringFormatting";
import "./SetCard.scss";
import playIcon from "../../assets/images/icons/play-white.svg";
import moreInfo from "../../assets/images/icons/more-vertical-white.svg";

const SetCard = ({ setInfo }) => {
  const { name, genre, updated_at } = setInfo;
  return (
    <Link className="set-card" to="">
      <article>
        <img className="play-icon" src={playIcon} alt="play icon" />
        <h2 className="set-card__title">{capitaliseFirstLetter(name)}</h2>
        <h3 className="set-card__subtitle">{formattedSubgenre(genre)} | {moment(updated_at).format("MMM DD, YYYY")}</h3>
        <button className="more-button">
          <img className="more-icon" src={moreInfo} alt="more info icon" />
        </button>
      </article>
    </Link>
  )
};

export default SetCard;

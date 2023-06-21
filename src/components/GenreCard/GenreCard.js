import { Link } from "react-router-dom";
import { formattedSubgenre } from "../../utils/stringFormatting";
import "./GenreCard.scss";

const GenreCard = ({ genreInfo }) => {
  const { subgenre, genre } = genreInfo;

  return (
    <Link className="genre" to={`set/${subgenre}`}>
      <article>
        <h2 className="genre__title">{formattedSubgenre(subgenre)}</h2>
        <h3 className="genre__subtitle">{genre}</h3>
      </article>
    </Link>
  );
};

export default GenreCard;

import { Link } from "react-router-dom";
import "./GenreCard.scss";

const GenreCard = ({ genreInfo }) => {
  const { subgenre, genre } = genreInfo;

  // Split the input string by the underscore and capitalise first letter
  const formattedSubgenre = (str) => {
    const words = str.split("_");
    const formattedString = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return formattedString;
  };

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

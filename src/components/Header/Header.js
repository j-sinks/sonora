import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";
import backBtn from "../../assets/images/icons/chevron-left-white.svg";
import logo from "../../assets/images/logos/sonora.jpeg";
import profilebtn from "../../assets/images/icons/userwhite.svg";
import likeBtn from "../../assets/images/icons/heart-white.svg";

const Header = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <header className="header">
      <nav className="header__nav">
        <div className="header__nav-container header__nav-container--left">
          <button className="header__button">
            <img
              className="nav-icon"
              src={backBtn}
              alt="back icon"
              onClick={handleBackClick}
            />
          </button>
        </div>
        <div className="header__nav-container header__nav-container--center">
          <Link to="/">
            <img className="logo" src={logo} alt="Sonora logo" />
          </Link>
        </div>
        <div className="header__nav-container header__nav-container--right">
          <Link to={`profile/${process.env.REACT_APP_USER_ID}/sets`}>
            <img className="nav-icon" src={profilebtn} alt="profile icon" />
          </Link>
          <Link to={`profile/${process.env.REACT_APP_USER_ID}/sounds`}>
            <img className="nav-icon nav-icon--right" src={likeBtn} alt="like icon" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;

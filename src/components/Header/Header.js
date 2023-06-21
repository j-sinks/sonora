import { Link } from "react-router-dom";
import "./Header.scss";
import backBtn from "../../assets/images/icons/chevron-left-white.svg";
import logo from "../../assets/images/logos/sonora.jpeg";
import profilebtn from "../../assets/images/icons/userwhite.svg";

const Header = () => {
  return (
    <header className="header">
      <nav className="header__nav">
      <div className="header__nav-container header__nav-container--left">
        <Link to="/">
          <img className="nav-icon" src={backBtn} alt="back icon" />
        </Link>
      </div>
      <div className="header__nav-container header__nav-container--center">
        <Link to="/">
          <img className="logo" src={logo} alt="Sonora logo" />
        </Link>
      </div>
      <div className="header__nav-container header__nav-container--right">
        <Link to="profile/:userId">
          <img className="nav-icon" src={profilebtn} alt="profile icon" />
        </Link>
      </div>
      </nav>
    </header>
  );
};

export default Header;

import moment from "moment";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer__text">© {moment().year()} Sonora. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;

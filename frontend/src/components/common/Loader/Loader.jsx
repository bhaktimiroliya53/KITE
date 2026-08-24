import "./Loader.css";
import kiteIcon from "../../../assets/logo/kite-icon.png";

export default function Loader() {
  return (
    <div className="loader-screen">
      <img
        src={kiteIcon}
        alt="KITE"
        className="loader-logo"
      />
    </div>
  );
}
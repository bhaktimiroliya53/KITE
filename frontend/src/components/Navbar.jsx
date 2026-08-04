import logo from "../assets/logo/kite-brand-logo.png";

function Navbar() {
  return (
    <div className="navbar">

      <div className="nav-left">
        <img
          src={logo}
          alt="logo"
        />

        <h2>KITE</h2>
      </div>

      <div className="nav-search">
        <input
          type="text"
          placeholder="Search users..."
        />
      </div>

      <div className="nav-right">

        <button>Home</button>

        <button>Explore</button>

        <button>Profile</button>

      </div>

    </div>
  );
}

export default Navbar;
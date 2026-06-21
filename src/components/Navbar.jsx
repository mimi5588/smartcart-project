import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Scan", path: "/scan" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Profile", path: "/profile" },
];

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink className="navbar-brand" to="/">
        SmartCart
      </NavLink>

      <div className="navbar-actions">
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `navbar-button${isActive ? " navbar-button-active" : ""}`
            }
            end={item.path === "/"}
            key={item.path}
            to={item.path}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;

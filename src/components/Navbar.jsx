import { NavLink } from "react-router-dom";

const navItems = [
  { label: "בית", path: "/" },
  { label: "סריקה", path: "/scan" },
  { label: "תובנות", path: "/dashboard" },
  { label: "פרופיל", path: "/profile" },
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

function Navbar() {
  return (
    <nav
      style={{
        padding: "16px",
        background: "#6FD3C1",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>SmartCart</h2>

      <div style={{ display: "flex", gap: "16px" }}>
        <span>Home</span>
        <span>Scan</span>
        <span>Dashboard</span>
        <span>Profile</span>
      </div>
    </nav>
  );
}

export default Navbar;

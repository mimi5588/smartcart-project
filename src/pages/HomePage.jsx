import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <div>
      <Navbar />

      <main style={{ padding: "24px" }}>
        <h1>שלום קארין 👋</h1>

        <p>ברוכה הבאה ל־SmartCart</p>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "20px",
            marginTop: "20px",
          }}
        >
          <h2>התקציב החודשי שלך</h2>
          <p>₪1,200 נשארו החודש</p>
        </div>

        <button
          style={{
            marginTop: "20px",
            padding: "14px 24px",
            background: "#6FD3C1",
            border: "none",
            borderRadius: "20px",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          התחל קנייה
        </button>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;

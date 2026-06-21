import { Link } from "react-router-dom";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import supermarketBackground from "../assets/supermarket-background.png";

function HomePage() {
  return (
    <div>
      <Navbar />

      <main
        className="home-hero"
        style={{ backgroundImage: `url(${supermarketBackground})` }}
      >
        <p className="eyebrow">Smart shopping assistant</p>
        <h1>שלום קארין 👋</h1>
        <p>ברוכה הבאה ל־SmartCart</p>

        <div className="budget-card">
          <h2>התקציב החודשי שלך</h2>
          <p>נשארו החודש ₪1,200</p>
        </div>

        <Link className="start-shopping-button" to="/scan">
          התחל קנייה
        </Link>
      </main>

      <section className="home-summary">
        <article>
          <strong>3</strong>
          <span>מוצרים ברשימה</span>
        </article>
        <article>
          <strong>₪84</strong>
          <span>חיסכון החודש</span>
        </article>
        <article>
          <strong>7</strong>
          <span>החלפות חכמות</span>
        </article>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;

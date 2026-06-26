import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const trips = [
  { store: "רמי לוי", date: "היום", spent: "₪142", saved: "₪24" },
  { store: "שופרסל דיל", date: "אתמול", spent: "₪384", saved: "₪42" },
  { store: "ויקטורי", date: "לפני 3 ימים", spent: "₪215", saved: "₪18" },
];

const chartBars = [44, 68, 52, 76, 61, 84, 72];

function DashboardPage() {
  return (
    <div>
      <Navbar />

      <main className="page-shell">
        <section className="page-header">
          <p className="eyebrow">תובנות קנייה</p>
          <h1>לוח חיסכון</h1>
          <p>
            מעקב אחר הוצאות חודשיות, חיסכון מהחלפות חכמות וקניות אחרונות
            בתצוגה אחת ברורה.
          </p>
        </section>

        <section className="stats-grid">
          <article className="metric-card">
            <span>תקציב חודשי</span>
            <strong>₪1,200</strong>
            <p>נותרו ₪842</p>
          </article>
          <article className="metric-card">
            <span>סך החיסכון</span>
            <strong>₪84</strong>
            <p>12% יותר מהחודש הקודם</p>
          </article>
          <article className="metric-card">
            <span>החלפות בריאות</span>
            <strong>7</strong>
            <p>4 חלופות זולות יותר נבחרו</p>
          </article>
        </section>

        <section className="dashboard-grid">
          <div className="content-card">
            <h2>חיסכון שבועי</h2>
            <div className="bar-chart" aria-label="גרף חיסכון שבועי">
              {chartBars.map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className="content-card">
            <h2>קניות אחרונות</h2>
            <div className="stack-list">
              {trips.map((trip) => (
                <article className="list-row" key={`${trip.store}-${trip.date}`}>
                  <div>
                    <strong>{trip.store}</strong>
                    <span>{trip.date}</span>
                  </div>
                  <b>{trip.spent}</b>
                  <em>נחסכו {trip.saved}</em>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default DashboardPage;

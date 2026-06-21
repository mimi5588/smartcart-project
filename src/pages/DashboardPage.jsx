import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const trips = [
  { store: "Rami Levy", date: "Today", spent: "₪142", saved: "₪24" },
  { store: "Shufersal Deal", date: "Yesterday", spent: "₪384", saved: "₪42" },
  { store: "Victory", date: "3 days ago", spent: "₪215", saved: "₪18" },
];

const chartBars = [44, 68, 52, 76, 61, 84, 72];

function DashboardPage() {
  return (
    <div>
      <Navbar />

      <main className="page-shell">
        <section className="page-header">
          <p className="eyebrow">Shopping insights</p>
          <h1>Dashboard</h1>
          <p>
            Track monthly spending, savings from smart swaps, and your recent
            shopping trips in one focused view.
          </p>
        </section>

        <section className="stats-grid">
          <article className="metric-card">
            <span>Monthly budget</span>
            <strong>₪1,200</strong>
            <p>₪842 remaining</p>
          </article>
          <article className="metric-card">
            <span>Total saved</span>
            <strong>₪84</strong>
            <p>12% better than last month</p>
          </article>
          <article className="metric-card">
            <span>Healthy swaps</span>
            <strong>7</strong>
            <p>4 cheaper alternatives accepted</p>
          </article>
        </section>

        <section className="dashboard-grid">
          <div className="content-card">
            <h2>Weekly savings</h2>
            <div className="bar-chart" aria-label="Weekly savings chart">
              {chartBars.map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className="content-card">
            <h2>Recent trips</h2>
            <div className="stack-list">
              {trips.map((trip) => (
                <article className="list-row" key={`${trip.store}-${trip.date}`}>
                  <div>
                    <strong>{trip.store}</strong>
                    <span>{trip.date}</span>
                  </div>
                  <b>{trip.spent}</b>
                  <em>Saved {trip.saved}</em>
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

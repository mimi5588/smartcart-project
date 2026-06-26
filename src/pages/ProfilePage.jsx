import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const preferences = ["התראות תקציב", "חלופות בריאות", "החלפות למותג זול"];
const members = [
  { name: "מאי כהן", role: "מנהלת" },
  { name: "דוד כהן", role: "שותף" },
];

function ProfilePage() {
  return (
    <div>
      <Navbar />

      <main className="page-shell">
        <section className="profile-hero">
          <div className="avatar">מ</div>
          <div>
            <p className="eyebrow">פרופיל משתמש</p>
            <h1>מאי כהן</h1>
            <p>משתמשת SmartCart משנת 2026</p>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="content-card">
            <h2>תקציב קניות</h2>
            <div className="budget-settings">
              <label htmlFor="monthly-budget">מגבלה חודשית</label>
              <input id="monthly-budget" defaultValue="₪1,200" />
              <button type="button">שמירת תקציב</button>
            </div>
          </div>

          <div className="content-card">
            <h2>העדפות</h2>
            <div className="chip-list">
              {preferences.map((preference) => (
                <span key={preference}>{preference}</span>
              ))}
            </div>
          </div>

          <div className="content-card">
            <h2>משק בית</h2>
            <div className="stack-list">
              {members.map((member) => (
                <article className="list-row" key={member.name}>
                  <div>
                    <strong>{member.name}</strong>
                    <span>{member.role}</span>
                  </div>
                  <b>פעיל</b>
                </article>
              ))}
            </div>
          </div>

          <div className="content-card">
            <h2>התראות</h2>
            <div className="settings-list">
              <label>
                <input defaultChecked type="checkbox" />
                התראות ירידת מחיר
              </label>
              <label>
                <input defaultChecked type="checkbox" />
                אזהרת תקציב חודשית
              </label>
              <label>
                <input type="checkbox" />
                סיכום שבועי במייל
              </label>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProfilePage;

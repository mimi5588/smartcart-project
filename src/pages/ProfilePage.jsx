import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const preferences = ["Budget alerts", "Healthy alternatives", "Store-brand swaps"];
const members = [
  { name: "Karin", role: "Admin" },
  { name: "David", role: "Contributor" },
];

function ProfilePage() {
  return (
    <div>
      <Navbar />

      <main className="page-shell">
        <section className="profile-hero">
          <div className="avatar">K</div>
          <div>
            <p className="eyebrow">Account profile</p>
            <h1>Karin Miller</h1>
            <p>SmartCart member since 2026</p>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="content-card">
            <h2>Shopping budget</h2>
            <div className="budget-settings">
              <label htmlFor="monthly-budget">Monthly limit</label>
              <input id="monthly-budget" defaultValue="₪1,200" />
              <button type="button">Save budget</button>
            </div>
          </div>

          <div className="content-card">
            <h2>Preferences</h2>
            <div className="chip-list">
              {preferences.map((preference) => (
                <span key={preference}>{preference}</span>
              ))}
            </div>
          </div>

          <div className="content-card">
            <h2>Household</h2>
            <div className="stack-list">
              {members.map((member) => (
                <article className="list-row" key={member.name}>
                  <div>
                    <strong>{member.name}</strong>
                    <span>{member.role}</span>
                  </div>
                  <b>Active</b>
                </article>
              ))}
            </div>
          </div>

          <div className="content-card">
            <h2>Notifications</h2>
            <div className="settings-list">
              <label>
                <input defaultChecked type="checkbox" />
                Price-drop alerts
              </label>
              <label>
                <input defaultChecked type="checkbox" />
                Monthly budget warning
              </label>
              <label>
                <input type="checkbox" />
                Weekly summary email
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

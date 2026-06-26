import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const scannedItems = [
  { name: "חלב אורגני", price: "₪14.90", note: "מותג הסופר חוסך ₪3.50" },
  { name: "לחם מחיטה מלאה", price: "₪12.00", note: "כבר נמצא ברשימה שלך" },
  { name: "תרד טרי", price: "₪8.50", note: "בחירה בריאה" },
];

function ScanPage() {
  return (
    <div>
      <Navbar />

      <main className="page-shell">
        <section className="page-header">
          <p className="eyebrow">סורק ברקוד</p>
          <h1>סריקת מוצרים בזמן הקנייה</h1>
          <p>
            עדכני את העגלה בזמן אמת, השווי מחירים וקבלי חלופות זולות יותר
            לפני הקופה.
          </p>
        </section>

        <section className="scan-grid">
          <div className="scanner-panel">
            <div className="scanner-frame">
              <span className="scanner-line" />
              <span className="scanner-corner scanner-corner-top-left" />
              <span className="scanner-corner scanner-corner-top-right" />
              <span className="scanner-corner scanner-corner-bottom-left" />
              <span className="scanner-corner scanner-corner-bottom-right" />
              <strong>מקמי כאן את הברקוד</strong>
            </div>

            <div className="manual-entry">
              <label htmlFor="barcode">ברקוד ידני</label>
              <div>
                <input id="barcode" placeholder="7290000000000" />
                <button type="button">הוספה</button>
              </div>
            </div>
          </div>

          <div className="content-card">
            <h2>סריקות אחרונות</h2>
            <div className="stack-list">
              {scannedItems.map((item) => (
                <article className="list-row" key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.note}</span>
                  </div>
                  <b>{item.price}</b>
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

export default ScanPage;

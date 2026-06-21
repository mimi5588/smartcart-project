import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const scannedItems = [
  { name: "Organic Milk", price: "₪14.90", note: "Store brand saves ₪3.50" },
  { name: "Whole Wheat Bread", price: "₪12.00", note: "Already in your list" },
  { name: "Fresh Spinach", price: "₪8.50", note: "Healthy choice" },
];

function ScanPage() {
  return (
    <div>
      <Navbar />

      <main className="page-shell">
        <section className="page-header">
          <p className="eyebrow">Barcode scanner</p>
          <h1>Scan products while you shop</h1>
          <p>
            Keep your cart updated in real time, compare prices, and catch
            cheaper alternatives before checkout.
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
              <strong>Align barcode here</strong>
            </div>

            <div className="manual-entry">
              <label htmlFor="barcode">Manual barcode</label>
              <div>
                <input id="barcode" placeholder="7290000000000" />
                <button type="button">Add</button>
              </div>
            </div>
          </div>

          <div className="content-card">
            <h2>Latest scans</h2>
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

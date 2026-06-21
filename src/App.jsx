import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import apropoImage from "./assets/products/apropro-osem.png";
import bambaImage from "./assets/products/bamba-osem.png";
import butterImage from "./assets/products/butter-tnuva.png";
import greenBeansImage from "./assets/products/green-beans-rami-levy.png";
import riceImage from "./assets/products/jasmin-rice-rami-levy.png";
import sourCreamImage from "./assets/products/sour-cream-tnuva.png";

const CATALOG = [
  {
    id: "milk-rami",
    upc: "7290116932033",
    name: "חמאה תנובה",
    brand: "Tnuva",
    category: "Dairy",
    price: 12.9,
    health: "B",
    dietary: ["Vegetarian", "Lactose"],
    image: butterImage,
    alternative: {
      name: "SmartBrand ממרח מופחת שומן",
      price: 9.4,
      health: "A",
      dietary: ["Vegetarian", "Lactose-free"],
      insight: "חוסך ₪3.50 ומתאים יותר למי שמעדיפה פחות לקטוז.",
    },
  },
  {
    id: "cereal-organic",
    upc: "7290001302279",
    name: "במבה",
    brand: "Osem, אוסם",
    category: "Pantry",
    price: 8.9,
    health: "C",
    dietary: ["Vegetarian"],
    image: bambaImage,
    alternative: {
      name: "SmartBrand פופקורן טבעי",
      price: 5.9,
      health: "B",
      dietary: ["Vegan", "Gluten-free"],
      insight: "חוסך ₪3.00 ומוריד נתרן ושומן ביחס לחטיף המקורי.",
    },
  },
  {
    id: "pasta-local",
    upc: "7290017406374",
    name: "Jasmin rice",
    brand: "Rami Levy, רמי לוי",
    category: "Pantry",
    price: 11.9,
    health: "A",
    dietary: ["Vegan"],
    image: riceImage,
    alternative: null,
  },
  {
    id: "soda-premium",
    upc: "7290000066332",
    name: "Apropo",
    brand: "Osem, אסם",
    category: "Pantry",
    price: 9.9,
    health: "D",
    dietary: ["Vegan", "Gluten-free"],
    image: apropoImage,
    alternative: {
      name: "SmartBrand חטיף תירס אפוי",
      price: 6.4,
      health: "B",
      dietary: ["Vegan", "Gluten-free", "Sugar-free"],
      insight: "חוסך ₪3.50 ומציע חלופה קלה יותר לנשנוש.",
    },
  },
  {
    id: "olive-oil",
    upc: "7290004125455",
    name: "Original Sour Cream 15%",
    brand: "Tnuva",
    category: "Pantry",
    price: 10.9,
    health: "D",
    dietary: ["Vegetarian", "Lactose"],
    image: sourCreamImage,
    alternative: {
      name: "SmartBrand שמנת 9%",
      price: 7.9,
      health: "C",
      dietary: ["Vegetarian"],
      insight: "חוסך ₪3.00 ומפחית אחוזי שומן.",
    },
  },
  {
    id: "tomatoes",
    upc: "7290018564059",
    name: "שעועית ירוקה שלמה עדינה",
    brand: "Rami Levy",
    category: "Produce",
    price: 12.4,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: greenBeansImage,
    alternative: null,
  },
];

const TRIPS = [
  {
    id: "trip-1",
    store: "Rami Levy",
    date: "Today, 14:30",
    purchases: 342,
    savings: 58,
    items: [
      ["במבה", 8.9, 3],
      ["Jasmin rice", 11.9, 0],
      ["שעועית ירוקה שלמה עדינה", 12.4, 0],
    ],
  },
  {
    id: "trip-2",
    store: "Shufersal Deal",
    date: "Yesterday, 09:15",
    purchases: 418,
    savings: 42,
    items: [
      ["Original Sour Cream 15%", 10.9, 3],
      ["Apropo", 9.9, 3.5],
      ["חמאה תנובה", 12.9, 3.5],
    ],
  },
  {
    id: "trip-3",
    store: "Victory",
    date: "3 days ago",
    purchases: 215,
    savings: 24,
    items: [
      ["SmartBrand חטיף תירס אפוי", 6.4, 3.5],
      ["SmartBrand פופקורן טבעי", 5.9, 3],
      ["SmartBrand שמנת 9%", 7.9, 3],
    ],
  },
];

const CHART_DATA = [
  { label: "Mon", purchases: 122, savings: 18 },
  { label: "Tue", purchases: 188, savings: 32 },
  { label: "Wed", purchases: 96, savings: 14 },
  { label: "Thu", purchases: 242, savings: 45 },
  { label: "Fri", purchases: 318, savings: 58 },
  { label: "Sat", purchases: 408, savings: 76 },
  { label: "Sun", purchases: 164, savings: 22 },
];

const DEFAULT_PROFILE = {
  firstName: "מאי",
  lastName: "כהן",
  email: "may.cohen@smartcart.local",
  address: "רחוב הרצל 12, תל אביב",
  budget: 1200,
  emoji: "😊",
  avatarBg: "mint",
  supermarket: "רמי לוי",
  restrictions: ["צמחוני"],
  household: [
    { name: "מאי כהן", role: "מנהלת", badge: "שומרת התקציב" },
    { name: "דוד כהן", role: "שותף", badge: "מחליף בריא" },
  ],
};

const STORAGE_KEY = "smartcart-polished-state";
const RESTRICTIONS = ["טבעוני", "צמחוני", "ללא לקטוז", "ללא גלוטן", "ללא אגוזים"];
const RESTRICTION_MATCH = {
  טבעוני: "Vegan",
  צמחוני: "Vegetarian",
  "ללא לקטוז": "Lactose-free",
  "ללא גלוטן": "Gluten-free",
  "ללא אגוזים": "Nut-free",
};

const STANDARD_BASKET = [
  { id: "weekly-dairy", label: "מוצר חלב שבועי", category: "Dairy", match: ["חמאה", "Sour Cream", "שמנת", "Milk"], cadence: "כל שבוע" },
  { id: "pantry-base", label: "בסיס מזווה", category: "Pantry", match: ["Jasmin rice", "rice", "Pasta"], cadence: "פעמיים בחודש" },
  { id: "healthy-veg", label: "ירק/תוספת בריאה", category: "Produce", match: ["שעועית", "Tomatoes", "Produce"], cadence: "כל קנייה" },
  { id: "snack-control", label: "נשנוש מבוקר", category: "Pantry", match: ["במבה", "Apropo", "Popcorn"], cadence: "לפי צורך" },
  { id: "smart-swap", label: "חלופת חיסכון", category: "Savings", match: ["SmartBrand"], cadence: "כשיש הצעה" },
];

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.profile?.firstName === "Karin" || parsed.profile?.email === "karin@smartcart.local") {
        return {
          ...parsed,
          profile: {
            ...DEFAULT_PROFILE,
            ...parsed.profile,
            firstName: DEFAULT_PROFILE.firstName,
            lastName: DEFAULT_PROFILE.lastName,
            email: DEFAULT_PROFILE.email,
            address: DEFAULT_PROFILE.address,
            emoji: parsed.profile.emoji || DEFAULT_PROFILE.emoji,
            avatarBg: parsed.profile.avatarBg || DEFAULT_PROFILE.avatarBg,
            budget: parsed.profile.budget || DEFAULT_PROFILE.budget,
          },
        };
      }
      return parsed;
    }
  } catch {
    // Ignore corrupted client state and fall back to defaults.
  }
  return {
    list: [
      { ...CATALOG[0], selectedName: CATALOG[0].name, selectedPrice: CATALOG[0].price, completed: false, swapped: false, saved: 0 },
      { ...CATALOG[5], selectedName: CATALOG[5].name, selectedPrice: CATALOG[5].price, completed: true, swapped: false, saved: 0 },
    ],
    profile: DEFAULT_PROFILE,
  };
}

function App() {
  const [activeView, setActiveView] = useState("home");
  const [state, setState] = useState(loadState);
  const [selectedId, setSelectedId] = useState(CATALOG[1].id);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [referralOpen, setReferralOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.documentElement.lang = "he";
    document.documentElement.dir = "rtl";
    document.title = "SmartCart | מאי כהן";
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

  const selectedProduct = CATALOG.find((item) => item.id === selectedId) || CATALOG[0];
  const spent = state.list.reduce((sum, item) => sum + item.selectedPrice, 0);
  const saved = state.list.reduce((sum, item) => sum + item.saved, 0);
  const progress = Math.min(100, Math.round((spent / state.profile.budget) * 100));
  const warning = progress >= 85;
  const learning = useMemo(() => buildLearningModel(state.list, state.profile.budget), [state.list, state.profile.budget]);

  const categoryGroups = useMemo(() => {
    return state.list.reduce((groups, item) => {
      groups[item.category] = groups[item.category] || [];
      groups[item.category].push(item);
      return groups;
    }, {});
  }, [state.list]);

  function flash(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function addItem(product, useAlternative = false) {
    const alternative = product.alternative;
    const selectedName = useAlternative && alternative ? alternative.name : product.name;
    const selectedPrice = useAlternative && alternative ? alternative.price : product.price;
    const savedValue = useAlternative && alternative ? product.price - alternative.price : 0;
    setState((current) => ({
      ...current,
      list: [
        {
          ...product,
          id: `${product.id}-${Date.now()}`,
          selectedName,
          selectedPrice,
          health: useAlternative && alternative ? alternative.health : product.health,
          dietary: useAlternative && alternative ? alternative.dietary : product.dietary,
          completed: false,
          swapped: useAlternative,
          saved: savedValue,
        },
        ...current.list,
      ],
    }));
    flash(useAlternative ? `החלפת תקציב בוצעה: נחסכו ₪${savedValue.toFixed(2)}` : "המוצר המקורי נוסף");
  }

  function toggleComplete(id) {
    setState((current) => ({
      ...current,
      list: current.list.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    }));
  }

  function removeItem(id) {
    setState((current) => ({
      ...current,
      list: current.list.filter((item) => item.id !== id),
    }));
  }

  function updateProfile(field, value) {
    setState((current) => ({
      ...current,
      profile: { ...current.profile, [field]: value },
    }));
  }

  function toggleRestriction(tag) {
    setState((current) => {
      const exists = current.profile.restrictions.includes(tag);
      return {
        ...current,
        profile: {
          ...current.profile,
          restrictions: exists
            ? current.profile.restrictions.filter((item) => item !== tag)
            : [...current.profile.restrictions, tag],
        },
      };
    });
  }

  function addHouseholdMember(name) {
    if (!name.trim()) return;
    setState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        household: [
          ...current.profile.household,
          { name: name.trim(), role: "Contributor", badge: "New Shopper" },
        ],
      },
    }));
    setInviteOpen(false);
    flash("בן/בת משפחה נוספו לקניות");
  }

  function handleReferral(email) {
    if (!email.includes("@") || email.endsWith("@example.com")) {
      flash("הכניסי כתובת אימייל תקינה להזמנה");
      return;
    }
    setReferralOpen(false);
    flash(`הזמנת שותף הוכנה עבור ${email}`);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar glass-panel">
        <button className="brand-mark" onClick={() => setActiveView("scanner")} type="button">
          <span>SC</span>
          <div>
            <strong>SmartCart</strong>
            <small>מערכת קניות חכמה</small>
          </div>
        </button>

        <nav className="side-nav">
          {[
            ["home", "בית", "סקירה יומית"],
            ["setup", "הכנה", "בחירת סופר ותקציב"],
            ["scanner", "סורק", "החלפות בזמן אמת"],
            ["list", "רשימת קניות", "תקציב וצ'קליסט"],
            ["dashboard", "תובנות", "ניתוח חיסכון"],
            ["profile", "פרופיל", "העדפות הבית"],
          ].map(([id, label, detail]) => (
            <button
              className={activeView === id ? "nav-item nav-item-active" : "nav-item"}
              key={id}
              onClick={() => setActiveView(id)}
              type="button"
            >
              <span>{label}</span>
              <small>{detail}</small>
            </button>
          ))}
        </nav>

        <div className={warning ? "budget-mini budget-mini-warn" : "budget-mini"}>
          <span>מצב התקציב</span>
          <strong>₪{spent.toFixed(0)} / ₪{state.profile.budget}</strong>
          <div className="mini-bar">
            <i style={{ width: `${progress}%` }} />
          </div>
        </div>
      </aside>

      <main className="workspace">
        {activeView !== "home" && (
          <header className="topbar glass-panel">
            <div>
              <p className="kicker">מצב קנייה מוכן לרמי לוי</p>
              <h1>{viewTitle(activeView)}</h1>
            </div>
            <div className="topbar-actions">
              <button className="ghost-button" onClick={() => setCatalogOpen(true)} type="button">
                פתחי קטלוג
              </button>
            <button className="primary-button" onClick={() => setActiveView("setup")} type="button">
              התחילי סריקה
            </button>
            </div>
          </header>
        )}

        {activeView === "home" && (
          <HomeView
            budget={state.profile.budget}
            avatarBg={state.profile.avatarBg}
            emoji={state.profile.emoji}
            onCatalog={() => setCatalogOpen(true)}
            onNavigate={setActiveView}
            progress={progress}
            saved={saved}
            spent={spent}
          />
        )}

        {activeView === "setup" && (
          <SetupView
            budget={state.profile.budget}
            onStart={() => setActiveView("scanner")}
            supermarket={state.profile.supermarket}
          />
        )}

        {activeView === "scanner" && (
          <>
            <ScannerView
              onAdd={addItem}
              onLightbox={setLightbox}
              product={selectedProduct}
              restrictions={state.profile.restrictions}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
            <SmartLearningList
              learning={learning}
              onOpenInsights={() => setActiveView("dashboard")}
              onOpenList={() => setActiveView("list")}
            />
          </>
        )}

        {activeView === "list" && (
          <ShoppingListView
            categoryGroups={categoryGroups}
            onCatalog={() => setCatalogOpen(true)}
            onRemove={removeItem}
            onToggle={toggleComplete}
            progress={progress}
            saved={saved}
            spent={spent}
            warning={warning}
            budget={state.profile.budget}
          />
        )}

        {activeView === "dashboard" && (
          <DashboardView
            learning={learning}
            onReferral={() => setReferralOpen(true)}
            onReceipt={setReceipt}
          />
        )}

        {activeView === "profile" && (
          <ProfileView
            onInvite={() => setInviteOpen(true)}
            onToggleRestriction={toggleRestriction}
            onUpdate={updateProfile}
            profile={state.profile}
          />
        )}
      </main>

      <CatalogDrawer
        isOpen={catalogOpen}
        onAdd={addItem}
        onClose={() => setCatalogOpen(false)}
      />
      <ReceiptDrawer receipt={receipt} onClose={() => setReceipt(null)} />
      <ReferralModal
        isOpen={referralOpen}
        onClose={() => setReferralOpen(false)}
        onSubmit={handleReferral}
      />
      <InviteModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSubmit={addHouseholdMember}
      />
      <ImageLightbox image={lightbox} onClose={() => setLightbox(null)} />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function ScannerView({ product, selectedId, setSelectedId, restrictions, onAdd, onLightbox }) {
  const compatible = restrictions.every((tag) => {
    const sourceTag = RESTRICTION_MATCH[tag] || tag;
    return product.dietary.includes(sourceTag) || sourceTag === "Vegetarian";
  });
  return (
    <section className="scanner-layout">
      <div className="scanner-card glass-panel">
        <div className="scanner-lens">
          <span className="corner tl" />
          <span className="corner tr" />
          <span className="corner bl" />
          <span className="corner br" />
          <span className="laser" />
          <div className="focus-dot" />
          <p>סרוק ברקוד</p>
        </div>

        <label className="field-label" htmlFor="simulated-item">מוצר לדימוי סריקה</label>
        <select id="simulated-item" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
          {CATALOG.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} - {item.upc}
            </option>
          ))}
        </select>
      </div>

      <div className="product-panel glass-panel">
        <CachedImage alt={product.name} onLightbox={onLightbox} src={product.image} />
        <div className="product-header">
          <div>
            <p className="kicker">{product.brand}</p>
            <h2>{product.name}</h2>
          </div>
          <HealthGrade grade={product.health} />
        </div>
        <div className="pill-row">
          {product.dietary.map((tag) => (
            <span className="diet-pill" key={tag}>{tag}</span>
          ))}
          <span className={compatible ? "diet-pill success" : "diet-pill alert"}>
            {compatible ? "Matches profile" : "Check restrictions"}
          </span>
        </div>

        <div className="price-strip">
          <span>מחיר מקורי</span>
          <strong>₪{product.price.toFixed(2)}</strong>
        </div>

        {product.alternative && (
          <div className="swap-widget">
            <p className="kicker">נסי את זה במקום</p>
            <h3>{product.alternative.name}</h3>
            <p>{product.alternative.insight}</p>
            <div className="compare-grid">
              <span>בריאות {product.health} &rarr; {product.alternative.health}</span>
              <span>₪{product.price.toFixed(2)} &rarr; ₪{product.alternative.price.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="button-row">
          <button className="ghost-button" onClick={() => onAdd(product, false)} type="button">
            הוסיפי מקורי
          </button>
          <button
            className="primary-button swap-button"
            disabled={!product.alternative}
            onClick={() => onAdd(product, true)}
            type="button"
          >
            החלפה וחיסכון
          </button>
        </div>
      </div>
    </section>
  );
}

function HomeView({ budget, spent, saved, progress, emoji, avatarBg, onCatalog, onNavigate }) {
  const remaining = Math.max(0, budget - spent);
  const ringOffset = 213.6 - (213.6 * Math.min(100, Math.max(0, 100 - progress))) / 100;

  return (
    <section className="home-mobile-shell">
      <header className="home-appbar">
        <div className="home-brand">
          <span className="material-fallback">🛒</span>
          <h1>SmartCart</h1>
        </div>
        <button className={`home-avatar avatar-bg-${avatarBg || "mint"}`} onClick={() => onNavigate("profile")} type="button">
          {emoji || "🛒"}
        </button>
      </header>

      <main className="home-content">
        <section className="home-greeting">
          <h2>בוקר טוב, מאי!</h2>
          <p>מוכנה לקנייה חכמה ומודעת היום?</p>
        </section>

        <section className="home-budget-card">
          <div>
            <p>תקציב חודשי</p>
            <h3>
              ₪{remaining.toFixed(0)}
              <span>נותרו</span>
            </h3>
            <small>נחסכו ₪{saved.toFixed(0)} מהחלפות חכמות</small>
          </div>
          <div className="home-ring">
            <svg viewBox="0 0 88 88">
              <circle cx="44" cy="44" fill="transparent" r="34" />
              <circle cx="44" cy="44" fill="transparent" r="34" strokeDasharray="213.6" strokeDashoffset={ringOffset} />
            </svg>
            <strong>{Math.max(0, 100 - progress)}%</strong>
          </div>
        </section>

          <button className="home-primary-action" onClick={() => onNavigate("setup")} type="button">
          <span>🛒</span>
          התחילי קנייה
        </button>

        <section className="home-quick-grid">
          <button onClick={onCatalog} type="button">
            <span>＋</span>
            הוספת מוצר
          </button>
          <button onClick={() => onNavigate("scanner")} type="button">
            <span>▦</span>
            סריקת ברקוד
          </button>
          <button onClick={() => onNavigate("list")} type="button">
            <span>☑</span>
            צפייה ברשימות
          </button>
          <button onClick={() => onNavigate("dashboard")} type="button">
            <span>◌</span>
            תובנות
          </button>
        </section>

        <section className="home-tip-card">
          <div className="home-tip-image">🥬</div>
          <div>
            <h4>טיפ שבועי</h4>
            <p>מעבר לחלופת SmartBrand יכול לחסוך לך עד ₪15 בקנייה הקרובה.</p>
          </div>
          <button onClick={() => onNavigate("dashboard")} type="button">‹</button>
        </section>
      </main>

      <nav className="home-bottom-nav">
        <button className="active" onClick={() => onNavigate("home")} type="button">
          <span>⌂</span>
          בית
        </button>
        <button onClick={() => onNavigate("dashboard")} type="button">
          <span>◫</span>
          דשבורד
        </button>
        <button className="scan-fab" onClick={() => onNavigate("setup")} type="button">
          <span>▦</span>
          סריקה
        </button>
        <button onClick={() => onNavigate("list")} type="button">
          <span>☑</span>
          רשימות
        </button>
        <button onClick={() => onNavigate("profile")} type="button">
          <span>●</span>
          פרופיל
        </button>
      </nav>
    </section>
  );
}

function SmartLearningList({ learning, onOpenList, onOpenInsights }) {
  return (
    <section className="learning-panel glass-panel">
      <div className="section-heading">
        <div>
          <h2>רשימת קניות סטנדרטית וחכמה</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button" onClick={onOpenList} type="button">פתחי רשימה</button>
          <button className="primary-button" onClick={onOpenInsights} type="button">ראי תובנות</button>
        </div>
      </div>

      <div className="learning-grid">
        {learning.standardBasket.map((item) => (
          <article className={item.learned ? "learning-card learned" : "learning-card"} key={item.id}>
            <div>
              <strong>{item.label}</strong>
              <span>{item.reason}</span>
            </div>
            <em>{item.status}</em>
          </article>
        ))}
      </div>

      <div className="learning-summary">
        <span>קטגוריה מובילה: <b>{learning.favoriteCategory}</b></span>
        <span>המערכת זיהתה <b>{learning.swapRate}%</b> נטייה להחלפות חיסכון</span>
        <span>חיסכון צפוי לקנייה הבאה: <b>₪{learning.projectedSavings}</b></span>
      </div>
    </section>
  );
}

function SetupView({ budget, supermarket, onStart }) {
  const stores = [
    ["שופרסל", "0.4 ק״מ", "shopping_cart"],
    [supermarket || "רמי לוי", "1.2 ק״מ", "local_mall"],
    ["סופר-פארם", "0.8 ק״מ", "medication"],
    ["הוספת סופר", "מיקום ידני", "add"],
  ];

  return (
    <section className="setup-page">
      <div className="setup-heading">
        <h2>בואי נתכונן.</h2>
        <p>הגדירי את הקנייה כדי ש־SmartCart יחסוך לך זמן וכסף.</p>
      </div>

      <div className="setup-grid">
        <article className="setup-card setup-store">
          <div className="setup-card-title">
            <span>🏬</span>
            <h3>בחירת סופר</h3>
          </div>
          <input placeholder="חיפוש סופר..." />
          <div className="store-grid">
            {stores.map(([name, distance, icon], index) => (
              <button className={index === 0 ? "store-option selected" : "store-option"} key={name} type="button">
                <span>{icon === "add" ? "+" : "🛒"}</span>
                <div>
                  <strong>{name}</strong>
                  <small>{distance}</small>
                </div>
                {index === 0 && <b>✓</b>}
              </button>
            ))}
          </div>
        </article>

        <div className="setup-side">
          <article className="setup-card">
            <div className="setup-card-title">
              <span>₪</span>
              <h3>תקציב</h3>
            </div>
            <p>מומלץ לפי ₪{budget} שנותרו החודש.</p>
            <div className="setup-budget-input">
              <strong>₪</strong>
              <input defaultValue="350" type="number" />
            </div>
            <input className="setup-range" defaultValue="35" type="range" />
            <div className="range-labels">
              <span>₪50</span>
              <span>₪1,000</span>
            </div>
          </article>

          <article className="setup-card">
            <div className="setup-card-title">
              <span>⏱</span>
              <h3>יעד זמן</h3>
            </div>
            <div className="time-options">
              {["15 דק׳", "30 דק׳", "45 דק׳", "60 דק׳"].map((time) => (
                <button className={time === "30 דק׳" ? "selected" : ""} key={time} type="button">
                  {time}
                </button>
              ))}
            </div>
          </article>
        </div>

        <article className="setup-card setup-list-toggle">
          <div>
            <span>☑</span>
            <div>
              <h3>שימוש ברשימת קניות קיימת</h3>
              <p>טעינה אוטומטית של “קניות שבועיות” עם 12 פריטים.</p>
            </div>
          </div>
          <label className="switch">
            <input defaultChecked type="checkbox" />
            <span />
          </label>
        </article>
      </div>

      <div className="setup-cta">
        <button className="home-primary-action" onClick={onStart} type="button">
          🛒 התחילי קנייה
        </button>
        <p>SmartCart תסדר לך מסלול חכם לפי הרשימה והתקציב.</p>
      </div>
    </section>
  );
}

function ShoppingListView({ categoryGroups, spent, saved, budget, progress, warning, onToggle, onRemove, onCatalog }) {
  return (
    <section className="list-layout">
      <div className={warning ? "budget-console glass-panel warning" : "budget-console glass-panel"}>
        <div>
          <p className="kicker">תקציב בזמן אמת</p>
          <h2>₪{spent.toFixed(2)} נוצלו</h2>
          <span>מתוך מגבלה של ₪{budget} - נחסכו ₪{saved.toFixed(2)} מהחלפות</span>
        </div>
        <div className="budget-bar">
          <i style={{ width: `${progress}%` }} />
        </div>
        {warning && <strong className="warning-copy">אזהרה: עברת 85% מהתקציב שהוגדר.</strong>}
      </div>

      <div className="list-toolbar">
        <h2>צ'קליסט קניות אינטראקטיבי</h2>
        <button className="primary-button" onClick={onCatalog} type="button">הוספה מהקטלוג</button>
      </div>

      <div className="category-stack">
        {Object.entries(categoryGroups).map(([category, items]) => (
          <div className="category-card glass-panel" key={category}>
            <h3>{category}</h3>
            {items.map((item) => (
              <article className={item.completed ? "check-row completed" : "check-row"} key={item.id}>
                <label>
                  <input checked={item.completed} onChange={() => onToggle(item.id)} type="checkbox" />
                  <span>
                    <strong>{item.selectedName}</strong>
                    <small>{item.brand} - health {item.health}</small>
                  </span>
                </label>
                {item.swapped && <em>החלפת תקציב בוצעה -₪{item.saved.toFixed(2)}</em>}
                <b>₪{item.selectedPrice.toFixed(2)}</b>
                <button onClick={() => onRemove(item.id)} type="button">הסרה</button>
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardView({ learning, onReceipt, onReferral }) {
  return (
    <section className="dashboard-layout">
      <div className="insight-strip">
        {learning.insights.map((insight) => (
          <article className="insight-card glass-panel" key={insight.label}>
            <span>{insight.label}</span>
            <strong>{insight.value}</strong>
            <small>{insight.detail}</small>
          </article>
        ))}
      </div>

      <div className="chart-panel glass-panel">
        <div className="section-heading">
          <div>
            <p className="kicker">השוואה שבועית וחודשית</p>
            <h2>קניות מול חיסכון בפועל</h2>
          </div>
          <button className="ghost-button" onClick={onReferral} type="button">תוכנית שיתוף</button>
        </div>
        <ResponsiveContainer height={320} width="100%">
          <AreaChart data={CHART_DATA}>
            <defs>
              <linearGradient id="purchaseGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 14 }} />
            <Area dataKey="purchases" fill="url(#purchaseGradient)" stroke="#8b5cf6" strokeWidth={3} />
            <Bar dataKey="savings" fill="#10b981" radius={[8, 8, 0, 0]} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="receipt-grid">
        {TRIPS.map((trip) => (
          <button className="trip-card glass-panel" key={trip.id} onClick={() => onReceipt(trip)} type="button">
            <span>{trip.date}</span>
            <strong>{trip.store}</strong>
            <div>
              <b>₪{trip.purchases}</b>
              <em>נחסכו ₪{trip.savings}</em>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function ProfileView({ profile, onUpdate, onToggleRestriction, onInvite }) {
  const faceOptions = ["😊", "😎", "🤓", "😍", "🙂", "😄", "🤩", "🥰"];
  const backgroundOptions = [
    ["mint", "מנטה"],
    ["violet", "סגול"],
    ["sky", "שמיים"],
    ["peach", "אפרסק"],
  ];

  return (
    <section className="profile-layout">
      <div className="profile-card glass-panel">
        <div className="avatar-picker">
          <div className={`avatar-orb avatar-bg-${profile.avatarBg || "mint"}`}>{profile.emoji || "😊"}</div>
          <div className="avatar-builder">
            <p>בחירת פנים לאווטאר</p>
            <div className="emoji-options" aria-label="בחירת פנים לאווטאר">
              {faceOptions.map((emoji) => (
                <button
                  className={profile.emoji === emoji ? "emoji-option active" : "emoji-option"}
                  key={emoji}
                  onClick={() => onUpdate("emoji", emoji)}
                  type="button"
                >
                  {emoji}
                </button>
              ))}
            </div>
            <p>צבע רקע</p>
            <div className="avatar-bg-options" aria-label="בחירת צבע רקע לאווטאר">
              {backgroundOptions.map(([value, label]) => (
              <button
                className={profile.avatarBg === value ? `avatar-bg-option avatar-bg-${value} active` : `avatar-bg-option avatar-bg-${value}`}
                key={value}
                onClick={() => onUpdate("avatarBg", value)}
                type="button"
                title={label}
              >
                {profile.emoji || "😊"}
              </button>
              ))}
            </div>
          </div>
        </div>
        <div className="profile-form">
          {[
            ["firstName", "שם פרטי"],
            ["lastName", "שם משפחה"],
            ["email", "אימייל ראשי"],
            ["address", "כתובת"],
            ["budget", "יעד תקציב חודשי"],
            ["supermarket", "סופר מועדף"],
          ].map(([field, label]) => (
            <label key={field}>
              <span>{label}</span>
              <input
                onChange={(event) => onUpdate(field, field === "budget" ? Number(event.target.value) : event.target.value)}
                type={field === "budget" ? "number" : "text"}
                value={profile[field]}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="profile-side glass-panel">
        <h2>העדפות תזונה</h2>
        <div className="tag-selector">
          {RESTRICTIONS.map((tag) => (
            <button
              className={profile.restrictions.includes(tag) ? "tag active" : "tag"}
              key={tag}
              onClick={() => onToggleRestriction(tag)}
              type="button"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="household-head">
          <h2>משק בית</h2>
          <button className="ghost-button" onClick={onInvite} type="button">הזמנה</button>
        </div>
        {profile.household.map((member) => (
          <div className="member-row" key={member.name}>
            <span>{member.name}</span>
            <small>{member.role} - {member.badge}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function CatalogDrawer({ isOpen, onClose, onAdd }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const filtered = CATALOG.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });
  return (
    <div className={isOpen ? "drawer-backdrop open" : "drawer-backdrop"} onClick={onClose}>
      <aside className="drawer glass-panel" onClick={(event) => event.stopPropagation()}>
        <div className="section-heading">
          <div>
            <p className="kicker">קטלוג הסופר</p>
            <h2>חיפוש והוספת מוצרים</h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button">X</button>
        </div>
        <input placeholder="חיפוש בקטלוג" value={query} onChange={(event) => setQuery(event.target.value)} />
        <div className="tag-selector">
          {["All", "Produce", "Dairy", "Pantry", "Drinks"].map((tag) => (
            <button className={category === tag ? "tag active" : "tag"} key={tag} onClick={() => setCategory(tag)} type="button">
              {tag}
            </button>
          ))}
        </div>
        <div className="drawer-list">
          {filtered.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.name}</strong>
              <span>{item.category} - ₪{item.price.toFixed(2)}</span>
              </div>
              <button onClick={() => onAdd(item, false)} type="button">הוספה</button>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}

function ReceiptDrawer({ receipt, onClose }) {
  return (
    <div className={receipt ? "drawer-backdrop open" : "drawer-backdrop"} onClick={onClose}>
      <aside className="drawer receipt-drawer glass-panel" onClick={(event) => event.stopPropagation()}>
        {receipt && (
          <>
            <div className="section-heading">
              <div>
                <p className="kicker">{receipt.date}</p>
                <h2>חשבונית {receipt.store}</h2>
              </div>
              <button className="icon-button" onClick={onClose} type="button">X</button>
            </div>
            {receipt.items.map(([name, price, discount]) => (
              <article className="receipt-line" key={name}>
                <span>{name}</span>
                <b>₪{price.toFixed(2)}</b>
                <em>-₪{discount.toFixed(2)}</em>
              </article>
            ))}
            <div className="receipt-score">
              <strong>{Math.round((receipt.savings / receipt.purchases) * 100)}%</strong>
              <span>ציון חיסכון</span>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function ReferralModal({ isOpen, onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-card glass-panel">
        <button className="icon-button" onClick={onClose} type="button">X</button>
        <p className="kicker">שיתוף חכם</p>
        <h2>הזמנת שותף/ה לקניות</h2>
        <p>הכניסי אימייל אמין כדי לפתוח תובנות חשבונית משותפות.</p>
        <input placeholder="family@domain.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        <button className="primary-button" onClick={() => onSubmit(email)} type="button">שליחת הזמנה</button>
      </div>
    </div>
  );
}

function InviteModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-card glass-panel">
        <button className="icon-button" onClick={onClose} type="button">X</button>
        <p className="kicker">חיבור משפחתי</p>
        <h2>הוספת קונה למשפחה</h2>
        <input placeholder="שם בן/בת משפחה" value={name} onChange={(event) => setName(event.target.value)} />
        <button className="primary-button" onClick={() => onSubmit(name)} type="button">יצירת כרטיס הזמנה</button>
      </div>
    </div>
  );
}

function CachedImage({ src, alt, onLightbox }) {
  const [displaySrc, setDisplaySrc] = useState(src);
  useEffect(() => {
    let cancelled = false;
    setDisplaySrc(src);
    async function cacheImage() {
      if (!("caches" in window) || !src.startsWith("http")) return;
      const cache = await caches.open("smartcart-image-cache-v1");
      const cached = await cache.match(src);
      if (!cached) {
        const response = await fetch(src, { mode: "cors" });
        if (response.ok) await cache.put(src, response.clone());
      }
      if (!cancelled) setDisplaySrc(src);
    }
    cacheImage().catch(() => setDisplaySrc(src));
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <button className="image-button" onClick={() => onLightbox({ src: displaySrc, alt })} type="button">
      <img alt={alt} src={displaySrc} />
    </button>
  );
}

function ImageLightbox({ image, onClose }) {
  if (!image) return null;
  return (
    <div className="lightbox" onClick={onClose}>
      <button className="icon-button" onClick={onClose} type="button">X</button>
      <img alt={image.alt} src={image.src} />
    </div>
  );
}

function HealthGrade({ grade }) {
  return <span className={`health-grade grade-${grade.toLowerCase()}`}>{grade}</span>;
}

function viewTitle(activeView) {
  switch (activeView) {
    case "home":
      return "בית";
    case "list":
      return "רשימת קניות";
    case "dashboard":
      return "תובנות חיסכון";
    case "profile":
      return "פרופיל חכם";
    default:
      return "סורק";
  }
}

function buildLearningModel(list, budget) {
  const categoryTotals = list.reduce((totals, item) => {
    totals[item.category] = (totals[item.category] || 0) + 1;
    return totals;
  }, {});
  const favoriteCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "Pantry";
  const swappedCount = list.filter((item) => item.swapped).length;
  const swapRate = list.length ? Math.round((swappedCount / list.length) * 100) : 0;
  const averageSavings = list.length
    ? list.reduce((sum, item) => sum + item.saved, 0) / Math.max(1, swappedCount || 1)
    : 0;
  const projectedSavings = Math.max(12, Math.round((averageSavings || 4) * 4));
  const spent = list.reduce((sum, item) => sum + item.selectedPrice, 0);
  const budgetShare = Math.round((spent / budget) * 100);

  const standardBasket = STANDARD_BASKET.map((template) => {
    const matches = list.filter((item) => {
      const haystack = `${item.selectedName} ${item.name} ${item.category}`;
      return template.match.some((token) => haystack.includes(token));
    });
    const learned = matches.length > 0;
    return {
      ...template,
      learned,
      reason: learned
        ? `נלמד מתוך ${matches.length} פריט/ים בקניות האחרונות`
        : `המלצה בסיסית לפי סל ${template.cadence}`,
      status: learned ? "נלמד מהרגלים" : "מומלץ להוסיף",
    };
  });

  return {
    budgetShare,
    favoriteCategory,
    projectedSavings,
    standardBasket,
    swapRate,
    insights: [
      {
        label: "למידת סל",
        value: `${standardBasket.filter((item) => item.learned).length}/${STANDARD_BASKET.length}`,
        detail: "קטגוריות מהרשימה הסטנדרטית שכבר זוהו אצל מאי",
      },
      {
        label: "קטגוריה חוזרת",
        value: favoriteCategory,
        detail: "הקטגוריה שמופיעה הכי הרבה בקניות הנוכחיות",
      },
      {
        label: "נטיית חיסכון",
        value: `${swapRate}%`,
        detail: "שיעור הפריטים שבהם מאי בחרה החלפת תקציב",
      },
      {
        label: "לחץ תקציבי",
        value: `${budgetShare}%`,
        detail: "כמה מהתקציב החודשי כבר מנוצל ברשימה",
      },
    ],
  };
}

export default App;

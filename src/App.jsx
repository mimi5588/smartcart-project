import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import apropoImage from "./assets/products/apropro-osem.png";
import butterImage from "./assets/products/butter-tnuva.png";
import greenBeansImage from "./assets/products/green-beans-rami-levy.png";
import riceImage from "./assets/products/jasmin-rice-rami-levy.png";
import sourCreamImage from "./assets/products/sour-cream-tnuva.png";
import { isSupabaseConfigured, supabase } from "./lib/supabaseClient";
import {
  fetchSmartCartProfile,
  fetchSmartCartState,
  saveSmartCartProfile,
  saveSmartCartState,
} from "./lib/smartcartState";

const produceImage = (emoji) =>
  `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
    <rect width="240" height="240" rx="42" fill="white"/>
    <text x="120" y="150" text-anchor="middle" font-size="112" font-family="Arial, sans-serif">${emoji}</text>
  </svg>
`)}`;

const CATEGORY_LABELS = {
  All: "הכל",
  Produce: "פירות וירקות",
  Dairy: "מוצרי חלב",
  Cheese: "גבינות",
  Meat: "בשרים",
  Deli: "נקניקים",
  Cleaning: "ניקיון",
  Pantry: "מזווה",
  Drinks: "שתייה",
  DryGoods: "מוצרי יסוד יבשים",
  Pasta: "פסטות ואטריות",
  Sauces: "שמנים ורטבים",
  Canned: "שימורים ומוכנים",
  Bakery: "לחמים ומאפים",
  Frozen: "קפואים",
  Hygiene: "נייר והיגיינה",
  Storage: "חד פעמי ואחסון",
  Snacks: "נשנושים ומתוקים",
};

const DIETARY_LABELS = {
  Vegan: "טבעוני",
  Vegetarian: "צמחוני",
  Lactose: "מכיל לקטוז",
  "Lactose-free": "ללא לקטוז",
  "Gluten-free": "ללא גלוטן",
  "Nut-free": "ללא אגוזים",
  "Sugar-free": "ללא סוכר",
  Household: "משק בית",
};

const BULK_CATALOG_SECTIONS = [
  ["DryGoods", "מזווה בסיסי", "🥣", 5.9, "אורז לבן, אורז בסמטי, אורז מלא, פתיתים, בורגול, קוסקוס, קינואה, עדשים ירוקות, עדשים כתומות, חומוס יבש, שעועית לבנה, שעועית אדומה, גריסים, קמח לבן, קמח מלא, קמח תופח, סוכר לבן, סוכר חום, אבקת סוכר, מלח, פלפל שחור, פפריקה מתוקה, פפריקה חריפה, כורכום, כמון, קינמון, אבקת שום, אבקת מרק עוף, אבקת מרק בצל, פירורי לחם, שומשום, טחינה גולמית, דבש, סילאן, ריבה, חמאת בוטנים, שוקולד למריחה, קקאו, אבקת אפייה, סודה לשתייה, תמצית וניל"],
  ["Pasta", "פסטות ואטריות", "🍝", 7.9, "פסטה ספגטי, פסטה פנה, פסטה פוזילי, פסטה פרפרים, פסטה מקרוני, פסטה מלאה, פסטה ללא גלוטן, אטריות ביצים, אטריות אורז, נודלס להקפצה, פתיתים אפויים, קוסקוס מהיר הכנה, רביולי מוכן, ניוקי, רוטב עגבניות לפסטה, רסק עגבניות, עגבניות מרוסקות, עגבניות קוביות, רוטב שמנת לפסטה, פסטו, זיתים לפסטה, תירס לקופסה, פטריות משומרות, טונה לפסטה"],
  ["Sauces", "שמנים ורטבים", "🫙", 8.9, "שמן קנולה, שמן זית, שמן חמניות, שמן אבוקדו, שמן שומשום, ספריי שמן, חומץ רגיל, חומץ תפוחים, חומץ בלסמי, רוטב סויה, רוטב צ׳ילי מתוק, רוטב טריאקי, קטשופ, מיונז, חרדל, רוטב ברביקיו, רוטב שום, רוטב אלף האיים, רוטב לסלט, לימון משומר, מיץ לימון, מלח גס, מלח לימון, עלי דפנה, צ׳ילי גרוס, אורגנו, בזיליקום יבש, זעתר, תבלין על האש, תבלין שווארמה, תבלין לקציצות, תבלין לפיצה"],
  ["Canned", "שימורים ומוכנים", "🥫", 6.9, "טונה בשמן, טונה במים, תירס משומר, אפונה וגזר, חומוס משומר, שעועית ברוטב עגבניות, פטריות חתוכות, מלפפונים חמוצים, זיתים ירוקים, זיתים שחורים, פלפל קלוי, חלב קוקוס, מרק נמס, מנה חמה, קרקרים אישיים, חטיפי אנרגיה, גרנולה, דגני בוקר, קורנפלקס, שיבולת שועל"],
  ["Drinks", "שתייה", "🥤", 5.9, "מים מינרלים, סודה, קולה, קולה זירו, ספרייט, פאנטה, מיץ תפוזים, מיץ ענבים, מיץ תפוחים, תה קר, אייס קפה, קפה שחור, נס קפה, קפסולות קפה, קפה נמס, תה רגיל, תה ירוק, תה נענע, תה קמומיל, שוקו, חלב רגיל, חלב דל לקטוז, חלב סויה, חלב שקדים, חלב שיבולת שועל, משקה אנרגיה, תרכיז פטל, תרכיז ענבים, תרכיז לימונענע"],
  ["Bakery", "לחמים ומאפים", "🥖", 7.5, "לחם אחיד, לחם פרוס, לחם מלא, לחם קל, לחם כוסמין, לחם שיפון, לחמניות רגילות, לחמניות מלאות, פיתות, פיתות מקמח מלא, בייגל, טורטיות, לאפות, חלה, באגט, ג׳בטה, פריכיות אורז, פריכיות תירס, צנימים, טוסטעים, קרקרים מלוחים, קרקרים מחיטה מלאה, קרקרים עם שומשום, קרקרים דקים, פתיבר, עוגיות יבשות, עוגיות שוקולד צ׳יפס, עוגיות מלוחות, ביסקוויטים, גריסיני"],
  ["Dairy", "מקרר חלב", "🥛", 6.9, "חלב, ביצים, גבינה לבנה, גבינה בולגרית, גבינת פטה, גבינת שמנת, יוגורט לבן, יוגורט בטעמים, מעדנים, שמנת מתוקה, שמנת לבישול, מרגרינה, גבינה מגורדת, מוצרלה, פרמזן"],
  ["Produce", "תוצרת טרייה", "🥬", 4.9, "בצל לבן, בצל סגול, שום, בטטה, פלפל צהוב, חסה, כרוב, פטרוזיליה, כוסברה, שמיר, נענע, לימון, אבוקדו, קישואים, חצילים, פטריות טריות, תפוזים, ענבים, אגסים, אפרסקים, שזיפים, תותים, מלון, אבטיח"],
  ["Meat", "קצבייה ודגים", "🥩", 24.9, "פרגיות, שוקיים, כנפיים, בשר טחון, קציצות מוכנות, שניצלים, נקניקיות, המבורגר קפוא, דג סלמון, דג אמנון, טונה טרייה או קפואה, קבב, שווארמה קפואה"],
  ["Frozen", "קפואים", "🧊", 12.9, "ירקות קפואים, ברוקולי קפוא, שעועית ירוקה, אפונה קפואה, תירס קפוא, צ׳יפס קפוא, בורקסים, ג׳חנון, מלאווח, פיצה קפואה, שניצל תירס, המבורגר צמחוני, גלידות, קרח"],
  ["Cleaning", "ניקיון לבית", "🧽", 9.9, "טבליות למדיח, מלח למדיח, נוזל הברקה למדיח, ספוגים לכלים, סקוצ׳ים, מטליות ניקוי, מטליות מיקרופייבר, נייר סופג, מגבונים לניקוי כללי, מגבונים לרצפה, אקונומיקה, מסיר שומנים, ספריי ניקוי כללי, ספריי חלונות, חומר לניקוי רצפה, חומר לניקוי שירותים, ג׳ל אסלה, מסיר אבנית, חומר לניקוי אמבטיה, אבקת כביסה, מרכך כביסה, מסיר כתמים, מבשם כביסה, שקיות אשפה קטנות, שקיות אשפה גדולות, כפפות ניקיון, מטאטא, יעה, מגב, סמרטוט רצפה, נוזל לחיטוי ידיים"],
  ["Hygiene", "נייר והיגיינה", "🧴", 10.9, "נייר טואלט, טישו, מגבונים לחים, מגבונים אינטימיים, סבון ידיים, סבון גוף, שמפו, מרכך שיער, משחת שיניים, מברשות שיניים, מי פה, דאודורנט, סכיני גילוח, קצף גילוח, תחבושות היגייניות, טמפונים, פדים יומיים, קרם גוף, קרם ידיים"],
  ["Storage", "חד פעמי ואחסון", "📦", 8.9, "צלחות חד פעמיות, כוסות חד פעמיות, סכו״ם חד פעמי, מפיות, נייר כסף, נייר אפייה, ניילון נצמד, שקיות אוכל, שקיות סנדוויץ׳, קופסאות אחסון, קופסאות חד פעמיות, תבניות אלומיניום, נרות שבת, גפרורים, מצת"],
  ["Snacks", "נשנושים ומתוקים", "🍫", 6.9, "ביסלי, תפוצ׳יפס, דוריטוס, פופקורן, אגוזים, שקדים, גרעינים, חמוציות, שוקולד, חטיפי שוקולד, וופלים, עוגיות, עוגות אישיות, מסטיקים, סוכריות, חטיפי חלבון, חטיפי גרנולה"],
];

const BULK_PRICE_OVERRIDES = {
  "ביצים": 14.9,
};

const BULK_CATALOG_ITEMS = BULK_CATALOG_SECTIONS.flatMap(([category, brand, emoji, basePrice, rawItems], sectionIndex) =>
  rawItems.split(", ").map((name, itemIndex) => ({
    id: `bulk-${category}-${itemIndex}`,
    upc: `7299${String(sectionIndex + 1).padStart(2, "0")}${String(itemIndex + 1).padStart(6, "0")}`,
    name,
    brand,
    category,
    price: BULK_PRICE_OVERRIDES[name] ?? Number((basePrice + (itemIndex % 7) * 1.3).toFixed(2)),
    health: ["Cleaning", "Hygiene", "Storage"].includes(category) ? "B" : itemIndex % 5 === 0 ? "A" : "B",
    dietary: ["Cleaning", "Hygiene", "Storage"].includes(category) ? ["Household"] : ["Vegetarian"],
    image: produceImage(emoji),
    alternative: null,
  }))
);

const CATALOG = [
  {
    id: "milk-rami",
    upc: "7290116932033",
    name: "חמאה",
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
    image: produceImage("🍿"),
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
    name: "אורז יסמין",
    brand: "רמי לוי",
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
    name: "אפרופו",
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
    name: "שמנת חמוצה 15%",
    brand: "תנובה",
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
    brand: "רמי לוי",
    category: "Produce",
    price: 12.4,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: greenBeansImage,
    alternative: null,
  },
  {
    id: "banana-loose",
    upc: "PLU 4011",
    name: "בננות טריות",
    brand: "תוצרת טרייה",
    category: "Produce",
    price: 6.9,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("🍌"),
    alternative: null,
  },
  {
    id: "apple-red",
    upc: "PLU 4017",
    name: "תפוח אדום",
    brand: "תוצרת טרייה",
    category: "Produce",
    price: 9.9,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("🍎"),
    alternative: null,
  },
  {
    id: "tomato-loose",
    upc: "PLU 4664",
    name: "עגבניות",
    brand: "תוצרת טרייה",
    category: "Produce",
    price: 7.5,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("🍅"),
    alternative: null,
  },
  {
    id: "cucumber-loose",
    upc: "PLU 4593",
    name: "מלפפונים",
    brand: "תוצרת טרייה",
    category: "Produce",
    price: 5.9,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("🥒"),
    alternative: null,
  },
  {
    id: "pepper-red",
    upc: "PLU 4688",
    name: "פלפל אדום",
    brand: "תוצרת טרייה",
    category: "Produce",
    price: 11.9,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("🫑"),
    alternative: null,
  },
  {
    id: "carrot-loose",
    upc: "PLU 4562",
    name: "גזר",
    brand: "תוצרת טרייה",
    category: "Produce",
    price: 4.9,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("🥕"),
    alternative: null,
  },
  {
    id: "potato-white",
    upc: "PLU 4072",
    name: "תפוחי אדמה לבנים",
    brand: "תוצרת טרייה",
    category: "Produce",
    price: 4.5,
    health: "B",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("🥔"),
    alternative: null,
  },
  {
    id: "onion-dry",
    upc: "PLU 4665",
    name: "בצל יבש",
    brand: "תוצרת טרייה",
    category: "Produce",
    price: 3.9,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("🧅"),
    alternative: null,
  },
  {
    id: "cheese-cottage",
    upc: "7290004125011",
    name: "קוטג' 5%",
    brand: "תנובה",
    category: "Cheese",
    price: 6.9,
    health: "B",
    dietary: ["Vegetarian", "Lactose"],
    image: produceImage("🧀"),
    alternative: {
      name: "SmartBrand קוטג' 3%",
      price: 5.8,
      health: "A",
      dietary: ["Vegetarian"],
      insight: "חוסך ₪1.10 ומפחית אחוזי שומן בלי לוותר על חלבון.",
    },
  },
  {
    id: "cheese-yellow",
    upc: "7290004125028",
    name: "גבינה צהובה פרוסה 28%",
    brand: "עמק",
    category: "Cheese",
    price: 18.9,
    health: "C",
    dietary: ["Vegetarian", "Lactose"],
    image: produceImage("🧀"),
    alternative: {
      name: "גבינה צהובה 9% SmartBrand",
      price: 15.9,
      health: "B",
      dietary: ["Vegetarian"],
      insight: "חוסך ₪3.00 ומוריד שומן רווי בארוחות השבוע.",
    },
  },
  {
    id: "meat-chicken-breast",
    upc: "7290012347115",
    name: "חזה עוף טרי",
    brand: "הקצבייה",
    category: "Meat",
    price: 34.9,
    health: "A",
    dietary: ["Gluten-free", "Nut-free"],
    image: produceImage("🍗"),
    alternative: null,
  },
  {
    id: "meat-ground-beef",
    upc: "7290012347122",
    name: "בשר בקר טחון",
    brand: "הקצבייה",
    category: "Meat",
    price: 42.9,
    health: "C",
    dietary: ["Gluten-free", "Nut-free"],
    image: produceImage("🥩"),
    alternative: {
      name: "בקר טחון רזה 10%",
      price: 39.9,
      health: "B",
      dietary: ["Gluten-free"],
      insight: "חוסך ₪3.00 ומפחית שומן ביחס לבשר רגיל.",
    },
  },
  {
    id: "deli-turkey",
    upc: "7290012347214",
    name: "פסטרמה הודו דקיקה",
    brand: "מעדנייה",
    category: "Deli",
    price: 16.9,
    health: "C",
    dietary: ["Gluten-free"],
    image: produceImage("🥪"),
    alternative: {
      name: "פסטרמה מופחתת נתרן",
      price: 15.5,
      health: "B",
      dietary: ["Gluten-free"],
      insight: "חוסך ₪1.40 ומקטין צריכת נתרן בנשנושים וכריכים.",
    },
  },
  {
    id: "deli-salami",
    upc: "7290012347221",
    name: "נקניק סלמי פרוס",
    brand: "מעדנייה",
    category: "Deli",
    price: 19.9,
    health: "D",
    dietary: ["Gluten-free"],
    image: produceImage("🥓"),
    alternative: {
      name: "נקניק הודו מופחת שומן",
      price: 17.9,
      health: "C",
      dietary: ["Gluten-free"],
      insight: "חוסך ₪2.00 ומציע חלופה קלה יותר לכריכים.",
    },
  },
  {
    id: "cleaning-dish-soap",
    upc: "7290012347313",
    name: "סבון כלים לימון",
    brand: "סנו",
    category: "Cleaning",
    price: 8.9,
    health: "B",
    dietary: ["Household"],
    image: produceImage("🧽"),
    alternative: {
      name: "SmartBrand סבון כלים מרוכז",
      price: 6.9,
      health: "B",
      dietary: ["Household"],
      insight: "חוסך ₪2.00 ומתאים לקנייה חודשית קבועה.",
    },
  },
  {
    id: "cleaning-laundry-gel",
    upc: "7290012347320",
    name: "ג'ל כביסה 3 ליטר",
    brand: "בדין",
    category: "Cleaning",
    price: 29.9,
    health: "B",
    dietary: ["Household"],
    image: produceImage("🧴"),
    alternative: {
      name: "SmartBrand ג'ל כביסה חסכוני",
      price: 23.9,
      health: "B",
      dietary: ["Household"],
      insight: "חוסך ₪6.00 במוצר ניקיון שנקנה כמעט כל חודש.",
    },
  },
  {
    id: "cleaning-trash-bags",
    upc: "7290012347337",
    name: "שקיות אשפה חזקות",
    brand: "ניקול",
    category: "Cleaning",
    price: 12.9,
    health: "B",
    dietary: ["Household"],
    image: produceImage("🧻"),
    alternative: null,
  },
  ...BULK_CATALOG_ITEMS,
];

const TRIPS = [
  {
    id: "trip-1",
    store: "רמי לוי",
    date: "היום, 14:30",
    purchases: 342,
    savings: 58,
    items: [
      ["במבה", 8.9, 3],
      ["אורז יסמין", 11.9, 0],
      ["שעועית ירוקה שלמה עדינה", 12.4, 0],
    ],
  },
  {
    id: "trip-2",
    store: "שופרסל דיל",
    date: "אתמול, 09:15",
    purchases: 418,
    savings: 42,
    items: [
      ["שמנת חמוצה 15%", 10.9, 3],
      ["אפרופו", 9.9, 3.5],
      ["חמאה", 12.9, 3.5],
    ],
  },
  {
    id: "trip-3",
    store: "ויקטורי",
    date: "לפני 3 ימים",
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
  { label: "שני", purchases: 122, savings: 18 },
  { label: "שלישי", purchases: 188, savings: 32 },
  { label: "רביעי", purchases: 96, savings: 14 },
  { label: "חמישי", purchases: 242, savings: 45 },
  { label: "שישי", purchases: 318, savings: 58 },
  { label: "שבת", purchases: 408, savings: 76 },
  { label: "ראשון", purchases: 164, savings: 22 },
];

const DEFAULT_PROFILE = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  budget: 1200,
  emoji: "😊",
  avatarBg: "mint",
  supermarket: "",
  restrictions: [],
  household: [],
  role: "user",
};

const storageKeyForUser = (userId) => `smartcart-polished-state-${userId}`;
const RESTRICTIONS = ["טבעוני", "צמחוני", "ללא לקטוז", "ללא גלוטן", "ללא אגוזים"];
const RESTRICTION_MATCH = {
  "טבעוני": "Vegan",
  "צמחוני": "Vegetarian",
  "ללא לקטוז": "Lactose-free",
  "ללא גלוטן": "Gluten-free",
  "ללא אגוזים": "Nut-free",
};

const STANDARD_BASKET = [
  { id: "weekly-dairy", label: "מוצר חלב שבועי", category: "Dairy", match: ["חמאה", "Sour Cream", "שמנת", "Milk"], cadence: "כל שבוע" },
  { id: "pantry-base", label: "בסיס מזווה", category: "Pantry", match: ["אורז יסמין", "rice", "Pasta"], cadence: "פעמיים בחודש" },
  { id: "healthy-veg", label: "ירק/תוספת בריאה", category: "Produce", match: ["שעועית", "Tomatoes", "Produce"], cadence: "כל קנייה" },
  { id: "snack-control", label: "נשנוש מבוקר", category: "Pantry", match: ["במבה", "אפרופו", "Popcorn"], cadence: "לפי צורך" },
  { id: "smart-swap", label: "חלופת חיסכון", category: "Savings", match: ["SmartBrand"], cadence: "כשיש הצעה" },
];

function createDefaultState(profile) {
  return {
    list: [],
    profile,
  };
}

function isRemovedHouseholdContact(member) {
  const normalizedName = String(member?.name || "").trim().toLowerCase();
  return ["נועה לוי", "נעה לוי", "noa levi"].includes(normalizedName);
}

function profileFromSupabase(user, dbProfile = null) {
  const metadata = user?.user_metadata || {};
  const emailName = user?.email?.split("@")[0] || "";
  return {
    ...DEFAULT_PROFILE,
    firstName: dbProfile?.first_name || metadata.first_name || emailName,
    lastName: dbProfile?.last_name || metadata.last_name || "",
    email: dbProfile?.email || user?.email || "",
    budget: Number(dbProfile?.monthly_budget || DEFAULT_PROFILE.budget),
    emoji: dbProfile?.avatar_emoji || DEFAULT_PROFILE.emoji,
    avatarBg: dbProfile?.avatar_bg || DEFAULT_PROFILE.avatarBg,
    supermarket: dbProfile?.preferred_supermarket || "",
    role: dbProfile?.role || user?.app_metadata?.role || "user",
    restrictions: [],
    household: [],
  };
}

function dbProfileFromState(userId, state) {
  return {
    user_id: userId,
    email: state.profile.email,
    first_name: state.profile.firstName || "",
    last_name: state.profile.lastName || "",
    role: state.profile.role || "user",
    monthly_budget: Number(state.profile.budget || 1200),
    preferred_supermarket: state.profile.supermarket || "",
    avatar_emoji: state.profile.emoji || "😊",
    avatar_bg: state.profile.avatarBg || "mint",
  };
}

function normalizeStoredState(baseProfile, storedState) {
  const parsed = storedState || {};
  const parsedProfile = parsed.profile || {};
  const household = Array.isArray(parsedProfile.household)
    ? parsedProfile.household.filter((member) => !isRemovedHouseholdContact(member))
    : [];
  return {
    ...parsed,
    list: Array.isArray(parsed.list) ? parsed.list : [],
    profile: {
      ...baseProfile,
      ...parsedProfile,
      email: baseProfile.email,
      role: baseProfile.role,
      household,
    },
  };
}

function loadState(userId, baseProfile = DEFAULT_PROFILE) {
  try {
    const saved = userId ? localStorage.getItem(storageKeyForUser(userId)) : null;
    if (saved) return normalizeStoredState(baseProfile, JSON.parse(saved));
  } catch {
    // Ignore corrupted client state and fall back to defaults.
  }
  return createDefaultState(baseProfile);
}

function App() {
  const [activeView, setActiveView] = useState("home");
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState(isSupabaseConfigured ? "" : "Supabase is not configured.");
  const [state, setState] = useState(() => createDefaultState(DEFAULT_PROFILE));
  const [selectedId, setSelectedId] = useState(CATALOG[1].id);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [referralOpen, setReferralOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [toast, setToast] = useState("");
  const user = session?.user || null;
  const activeUserId = user?.id || null;
  const syncStatusRef = useRef(isSupabaseConfigured ? "connecting" : "local");
  const remoteReadyRef = useRef(false);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    document.documentElement.lang = "he";
    document.documentElement.dir = "rtl";
    document.title = `SmartCart | ${state.profile.firstName} ${state.profile.lastName}`;
  }, [state.profile.firstName, state.profile.lastName]);

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
      setAuthError("");
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    remoteReadyRef.current = false;

    if (!activeUserId || !user) {
      syncStatusRef.current = "signed-out";
      return () => {
        cancelled = true;
      };
    }

    syncStatusRef.current = "syncing";
    Promise.all([fetchSmartCartProfile(activeUserId), fetchSmartCartState(activeUserId)])
      .then(async ([dbProfile, remoteState]) => {
        if (cancelled) return;
        const baseProfile = profileFromSupabase(user, dbProfile);
        const localState = loadState(activeUserId, baseProfile);
        const nextState = remoteState ? normalizeStoredState(baseProfile, remoteState) : localState;

        setState(nextState);
        remoteReadyRef.current = true;
        syncStatusRef.current = "synced";

        if (!dbProfile) await saveSmartCartProfile(dbProfileFromState(activeUserId, nextState));
        if (!remoteState) await saveSmartCartState(activeUserId, nextState);
      })
      .catch((error) => {
        if (!cancelled) {
          setAuthError(error.message || "טעינת חשבון SmartCart נכשלה.");
          remoteReadyRef.current = true;
          syncStatusRef.current = "offline";
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeUserId, user]);

  useEffect(() => {
    if (!activeUserId) return undefined;
    localStorage.setItem(storageKeyForUser(activeUserId), JSON.stringify(state));

    if (!isSupabaseConfigured || !remoteReadyRef.current) return undefined;

    syncStatusRef.current = "syncing";
    window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      Promise.all([
        saveSmartCartState(activeUserId, state),
        saveSmartCartProfile(dbProfileFromState(activeUserId, state)),
      ])
        .then(() => {
          syncStatusRef.current = "synced";
        })
        .catch(() => {
          syncStatusRef.current = "offline";
        });
    }, 450);

    return () => window.clearTimeout(saveTimerRef.current);
  }, [state, activeUserId]);
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
  const activeBudget = Math.max(1, Number(state.profile.budget) || 1);
  const progress = Math.min(100, Math.round((spent / activeBudget) * 100));
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

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setActiveView("home");
    setState(createDefaultState(DEFAULT_PROFILE));
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

  function addHouseholdMember(name, role = "שותף/ה") {
    if (!name.trim()) return;
    setState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        household: [
          ...current.profile.household,
          { name: name.trim(), role, badge: "קונה חדש/ה" },
        ],
      },
    }));
    setInviteOpen(false);
    flash("אדם חדש נוסף למשק הבית");
  }

  function handleReferral(email) {
    if (!email.includes("@") || email.endsWith("@example.com")) {
      flash("הכניסי כתובת אימייל תקינה להזמנה");
      return;
    }
    setReferralOpen(false);
    flash(`הזמנת שותף הוכנה עבור ${email}`);
  }

  if (authLoading) {
    return <AuthShell title="SmartCart" message="טוענים את החשבון שלך..." />;
  }

  if (!user) {
    return <AuthScreen authError={authError} setAuthError={setAuthError} />;
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
            ["scanner", "סריקה", "החלפות בזמן אמת"],
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

        <div className="user-switcher">
          <span>משתמש מחובר</span>
          <div className="user-switch active">
            <b>{state.profile.emoji || "😊"}</b>
            <small>{state.profile.email}</small>
          </div>
          {state.profile.role === "admin" && <span className="admin-badge">Admin</span>}
          <button className="ghost-button" onClick={signOut} type="button">
            יציאה
          </button>
        </div>
      </aside>

      <main className="workspace">
        {activeView !== "home" && (
          <header className="topbar glass-panel">
            <div>
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
            firstName={state.profile.firstName}
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
            onBudgetChange={(value) => updateProfile("budget", value)}
            onSelectStore={(store) => updateProfile("supermarket", store)}
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
      <GuideAssistant
        isOpen={assistantOpen}
        onNavigate={setActiveView}
        onToggle={() => setAssistantOpen((open) => !open)}
      />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function AuthShell({ title, message }) {
  return (
    <main className="auth-shell" dir="rtl">
      <section className="auth-panel glass-panel">
        <span className="auth-logo">SC</span>
        <h1>{title}</h1>
        <p>{message}</p>
      </section>
    </main>
  );
}

function AuthScreen({ authError, setAuthError }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("maycohen5588@gmail.com");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  async function submitAuth(event) {
    event.preventDefault();
    setAuthError("");
    setNotice("");
    setLoading(true);

    try {
      if (!supabase) throw new Error("Supabase לא מוגדר בסביבת ההרצה.");
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
            },
          },
        });
        if (error) throw error;
        setNotice("המשתמש נוצר. אם Supabase דורש אימות מייל, צריך לאשר את המייל לפני כניסה.");
      }
    } catch (error) {
      setAuthError(error.message || "הפעולה נכשלה. בדקי את הפרטים ונסי שוב.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell" dir="rtl">
      <section className="auth-panel glass-panel">
        <span className="auth-logo">SC</span>
        <p className="kicker">SmartCart</p>
        <h1>{mode === "signin" ? "כניסה למערכת" : "יצירת משתמש חדש"}</h1>
        <p>המערכת משתמשת עכשיו במייל וסיסמה דרך Supabase Auth.</p>

        <form className="auth-form" onSubmit={submitAuth}>
          {mode === "signup" && (
            <div className="auth-row">
              <input placeholder="שם פרטי" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
              <input placeholder="שם משפחה" value={lastName} onChange={(event) => setLastName(event.target.value)} />
            </div>
          )}
          <input autoComplete="email" dir="ltr" placeholder="email@example.com" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input autoComplete={mode === "signin" ? "current-password" : "new-password"} dir="ltr" minLength={6} placeholder="סיסמה" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {authError && <p className="auth-error">{authError}</p>}
          {notice && <p className="auth-notice">{notice}</p>}
          <button className="primary-button" disabled={loading} type="submit">
            {loading ? "רגע..." : mode === "signin" ? "כניסה" : "הרשמה"}
          </button>
        </form>

        <button className="ghost-button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setAuthError(""); setNotice(""); }} type="button">
          {mode === "signin" ? "אין לך משתמש? הרשמה" : "יש לך משתמש? כניסה"}
        </button>
      </section>
    </main>
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
            <span className="diet-pill" key={tag}>{DIETARY_LABELS[tag] || tag}</span>
          ))}
          <span className={compatible ? "diet-pill success" : "diet-pill alert"}>
            {compatible ? "תואם לפרופיל" : "בדקי התאמות"}
          </span>
        </div>

        <div className="price-strip">
          <span>מחיר מקורי</span>
          <strong>₪{product.price.toFixed(2)}</strong>
        </div>
        <small className="price-disclaimer scanner-disclaimer">
          המחיר מבוסס על בדיקות אחרונות ועשוי להשתנות לפי סניף, מבצע, זמינות ועדכוני ספקים.
        </small>

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

function HomeView({ budget, spent, saved, progress, emoji, avatarBg, firstName, onCatalog, onNavigate }) {
  const remaining = Math.max(0, budget - spent);
  const ringOffset = 213.6 - (213.6 * Math.min(100, Math.max(0, 100 - progress))) / 100;
  const displayName = firstName?.trim() || "משתמשת";

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
          <h2>שלום {displayName}</h2>
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
        <button className="home-secondary-action" onClick={onCatalog} type="button">
          + פתחי קטלוג והוסיפי מוצר
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
            <span>◉</span>
            תובנות
          </button>
        </section>

        <section className="home-tip-card">
          <div className="home-tip-image">🥬</div>
          <div>
            <h4>טיפ שבועי</h4>
            <p>מעבר לחלופת SmartBrand יכול לחסוך לך עד ₪15 בקנייה הקרובה.</p>
          </div>
          <button onClick={() => onNavigate("dashboard")} type="button">›</button>
        </section>
      </main>

      <nav className="home-bottom-nav">
        <button className="active" onClick={() => onNavigate("home")} type="button">
          <span>⌂</span>
          בית
        </button>
        <button onClick={() => onNavigate("dashboard")} type="button">
          <span>◉</span>
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
        <span>קטגוריה מובילה: <b>{learning.favoriteCategoryLabel}</b></span>
        <span>המערכת זיהתה <b>{learning.swapRate}%</b> נטייה להחלפות חיסכון</span>
        <span>חיסכון צפוי לקנייה הבאה: <b>₪{learning.projectedSavings}</b></span>
      </div>
    </section>
  );
}

function SetupView({ budget, supermarket, onSelectStore, onBudgetChange, onStart }) {
  const stores = [
    ["שופרסל", "0.4 ק״מ", "shopping_cart"],
    ["רמי לוי", "1.2 ק״מ", "local_mall"],
    ["יוחננוף", "1.5 ק״מ", "shopping_cart"],
    ["ויקטורי", "1.8 ק״מ", "shopping_cart"],
    ["קרפור", "2.0 ק״מ", "shopping_cart"],
    ["יינות ביתן", "2.3 ק״מ", "shopping_cart"],
    ["מגה בעיר", "2.5 ק״מ", "shopping_cart"],
    ["מחסני השוק", "2.8 ק״מ", "shopping_cart"],
    ["חצי חינם", "3.0 ק״מ", "shopping_cart"],
    ["אושר עד", "3.4 ק״מ", "shopping_cart"],
    ["טיב טעם", "3.6 ק״מ", "shopping_cart"],
    ["קשת טעמים", "3.9 ק״מ", "shopping_cart"],
    ["פרשמרקט", "4.1 ק״מ", "shopping_cart"],
    ["בר כל", "4.3 ק״מ", "shopping_cart"],
    ["יש חסד", "4.5 ק״מ", "shopping_cart"],
    ["AM:PM", "0.7 ק״מ", "shopping_cart"],
    ["סופר יודה", "1.0 ק״מ", "shopping_cart"],
    ["yellow", "1.6 ק״מ", "shopping_cart"],
    ["סיטי מרקט", "2.2 ק״מ", "shopping_cart"],
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
            {stores.map(([name, distance, icon]) => (
              <button
                className={name === supermarket ? "store-option selected" : "store-option"}
                key={name}
                onClick={() => icon !== "add" && onSelectStore(name)}
                type="button"
              >
                <span>{icon === "add" ? "+" : "🛒"}</span>
                <div>
                  <strong>{name}</strong>
                  <small>{distance}</small>
                </div>
                {name === supermarket && <b>✓</b>}
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
              <input
                min="50"
                max="10000"
                onChange={(event) => onBudgetChange(Number(event.target.value) || 0)}
                step="50"
                type="number"
                value={budget}
              />
            </div>
            <input
              className="setup-range"
              max="10000"
              min="50"
              onChange={(event) => onBudgetChange(Number(event.target.value))}
              step="50"
              type="range"
              value={Math.min(10000, Math.max(50, Number(budget) || 50))}
            />
            <div className="range-labels">
              <span>₪50</span>
              <span>₪10,000</span>
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
            <span>🧾</span>
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
                    <small>{item.brand} - דירוג בריאות {item.health}</small>
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
            <p>בחירת אווטאר</p>
            <div className="emoji-options" aria-label="בחירת אווטאר">
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
          <button className="primary-button" onClick={onInvite} type="button">+ הוספת אדם</button>
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
  const [manualName, setManualName] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [manualCategory, setManualCategory] = useState("Pantry");
  const categories = ["All", ...new Set(CATALOG.map((item) => item.category))].map((key) => [key, CATEGORY_LABELS[key] || key]);
  const categoryOptions = categories.filter(([key]) => key !== "All");
  const filtered = CATALOG.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const haystack = `${item.name} ${item.brand} ${item.category}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });
  const addManualProduct = () => {
    const name = manualName.trim();
    const price = Number(manualPrice);
    if (!name || Number.isNaN(price) || price <= 0) return;
    onAdd({
      id: `manual-${Date.now()}`,
      upc: "ידני",
      name,
      brand: "מוצר שהוסף ידנית",
      category: manualCategory,
      price,
      health: "B",
      dietary: ["Vegetarian"],
      image: produceImage("🛒"),
      alternative: null,
    }, false);
    setManualName("");
    setManualPrice("");
  };
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
          {categories.map(([tag, label]) => (
            <button className={category === tag ? "tag active" : "tag"} key={tag} onClick={() => setCategory(tag)} type="button">
              {label}
            </button>
          ))}
        </div>
        <div className="manual-product-form">
          <div>
            <p className="kicker">הוספה ידנית</p>
            <h3>מוצר שלא קיים בקטלוג</h3>
          </div>
          <input placeholder="שם מוצר" value={manualName} onChange={(event) => setManualName(event.target.value)} />
          <div className="manual-product-row">
            <input min="0" placeholder="מחיר" step="0.1" type="number" value={manualPrice} onChange={(event) => setManualPrice(event.target.value)} />
            <select value={manualCategory} onChange={(event) => setManualCategory(event.target.value)}>
              {categoryOptions.map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <button className="primary-button" disabled={!manualName.trim() || Number(manualPrice) <= 0} onClick={addManualProduct} type="button">
            הוספת מוצר חדש
          </button>
          <small className="price-disclaimer">
            המחיר שמופיע באתר מבוסס על בדיקות אחרונות ועשוי להיות שונה מהמחיר האמיתי בשוק בגלל מבצעים, סניפים, זמינות, עדכוני ספקים וסיבות נוספות.
          </small>
        </div>
        <div className="drawer-list">
          {filtered.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.name}</strong>
              <span>{CATEGORY_LABELS[item.category] || item.category} - ₪{item.price.toFixed(2)}</span>
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
  const [role, setRole] = useState("שותף/ה");
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-card glass-panel">
        <button className="icon-button" onClick={onClose} type="button">X</button>
        <p className="kicker">משק בית משותף</p>
        <h2>הוספת אדם</h2>
        <input placeholder="שם מלא" value={name} onChange={(event) => setName(event.target.value)} />
        <select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="שותף/ה">שותף/ה</option>
          <option value="מנהל/ת">מנהל/ת</option>
          <option value="קונה קבוע/ה">קונה קבוע/ה</option>
          <option value="ילד/ה">ילד/ה</option>
        </select>
        <button className="primary-button" onClick={() => onSubmit(name, role)} type="button">הוספה למשק הבית</button>
      </div>
    </div>
  );
}

function CachedImage({ src, alt, onLightbox }) {
  const [displaySrc, setDisplaySrc] = useState(src);
  useEffect(() => {
    let cancelled = false;
    async function cacheImage() {
      if (!("caches" in window) || !src.startsWith("http")) {
        setDisplaySrc(src);
        return;
      }
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

function GuideAssistant({ isOpen, onToggle, onNavigate }) {
  const [question, setQuestion] = useState("");
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "היי, אני העוזר של SmartCart. אפשר לשאול אותי איך מתחילים קנייה, איך מוסיפים מוצר, איך משתמשים בסורק, איפה רואים תקציב או איך משנים פרופיל.",
    },
  ]);

  const quickActions = [
    ["איך מתחילים?", "setup"],
    ["איך מוסיפים מוצר?", "list"],
    ["איך סורקים?", "scanner"],
    ["מה זה התובנות ולמה הן משמשות?", "dashboard"],
  ];

  async function ask(text = question) {
    const clean = text.trim();
    if (!clean || thinking) return;
    const fallbackAnswer = getAssistantAnswer(clean);
    setMessages((current) => [
      ...current,
      { from: "user", text: clean },
    ]);
    setQuestion("");
    setThinking(true);
    window.setTimeout(async () => {
      const apiAnswer = await getApiAssistantAnswer(clean, messages);
      const finalAnswer = apiAnswer || fallbackAnswer.text;
      setMessages((current) => [...current, { from: "bot", text: finalAnswer }]);
      setThinking(false);
      if (fallbackAnswer.view) onNavigate(fallbackAnswer.view);
    }, 650);
  }

  return (
    <div className="guide-assistant" dir="rtl">
      {isOpen && (
        <section className="guide-panel glass-panel" aria-label="עוזר SmartCart">
          <div className="guide-head">
            <div>
              <strong>עוזר SmartCart</strong>
              <small>הדרכה ושאלות למשתמשים חדשים</small>
            </div>
            <span className="ai-badge">מבוסס AI</span>
            <button className="icon-button" onClick={onToggle} type="button">X</button>
          </div>
          <small className="assistant-note">
            העוזר יכול לטעות. מומלץ לבדוק מחירים, מבצעים ומידע תזונתי מול הסופר והמוצר בפועל.
          </small>

          <div className="guide-messages">
            {messages.map((message, index) => (
              <p className={message.from === "bot" ? "guide-message bot" : "guide-message user"} key={`${message.from}-${index}`}>
                {message.text}
              </p>
            ))}
            {thinking && (
              <p className="guide-message bot thinking">
                <span />
                <span />
                <span />
                חושב רגע...
              </p>
            )}
          </div>

          <div className="guide-quick-actions">
            {quickActions.map(([label, view]) => (
              <button
                key={label}
                onClick={() => {
                  onNavigate(view);
                  ask(label);
                }}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <form
            className="guide-form"
            onSubmit={(event) => {
              event.preventDefault();
              ask();
            }}
          >
            <input
              placeholder="שאלי אותי משהו..."
              disabled={thinking}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
            <button disabled={thinking} type="submit">{thinking ? "חושב..." : "שליחה"}</button>
          </form>
        </section>
      )}

      <button className="guide-fab" onClick={onToggle} type="button" aria-label="פתיחת עוזר SmartCart">
        <span className="help-mark" aria-hidden="true">?</span>
      </button>
    </div>
  );
}

async function getApiAssistantAnswer(question, history) {
  try {
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.answer || null;
  } catch {
    return null;
  }
}

function getAssistantAnswer(question) {
  const text = question.toLowerCase();
  if (text.includes("שלום") || text.includes("היי") || text.includes("הי ") || text.includes("בוקר טוב") || text.includes("ערב טוב")) {
    return {
      view: null,
      text: "היי מאי, איזה כיף שאת כאן. אני העוזר של SmartCart ואפשר לשאול אותי גם על האתר וגם סתם איך להתחיל להשתמש בו.",
    };
  }
  if (text.includes("מה קורה") || text.includes("מה נשמע") || text.includes("מה שלומך") || text.includes("איך אתה") || text.includes("איך את")) {
    return {
      view: null,
      text: "הכול טוב, תודה ששאלת. אני כאן כדי לעזור לך לעשות קנייה חכמה יותר, למצוא מוצרים, להבין תובנות ולשמור על התקציב.",
    };
  }
  if (text.includes("תודה") || text.includes("תודה רבה") || text.includes("אלופה") || text.includes("מעולה")) {
    return {
      view: null,
      text: "בשמחה. אני נשאר כאן אם תרצי עוד עזרה, הסבר על מסך מסוים או הכוונה בקנייה.",
    };
  }
  if (text.includes("מי אתה") || text.includes("מי את") || text.includes("מה אתה") || text.includes("מה את")) {
    return {
      view: null,
      text: "אני עוזר ההדרכה של SmartCart. אני מסביר איך להשתמש באתר, עוזר למצוא פעולות, ומכוון אותך למסך הנכון לפי השאלה.",
    };
  }
  if (text.includes("מה אפשר לשאול") || text.includes("מה אתה יודע") || text.includes("עזרה") || text.includes("help")) {
    return {
      view: null,
      text: "אפשר לשאול אותי על התחלת קנייה, בחירת סופר, סריקת מוצר, הוספת מוצר ידנית, תקציב, רשימת קניות, תובנות, פרופיל, אווטאר ומשק בית.",
    };
  }
  if (text.includes("למה") && text.includes("smartcart")) {
    return {
      view: null,
      text: "SmartCart נועדה לעזור לך לקנות בצורה מודעת: להבין כמה את מוציאה, לבחור חלופות משתלמות, ולבנות רשימת קניות שמתאימה להרגלים של הבית.",
    };
  }
  if (text.includes("התח") || text.includes("קנייה") || text.includes("סופר")) {
    return {
      view: "setup",
      text: "כדי להתחיל קנייה לוחצים על 'התחילי קנייה', בוחרים סופר, מגדירים תקציב וזמן, ואז ממשיכים לסריקה.",
    };
  }
  if (text.includes("סריק") || text.includes("ברקוד") || text.includes("מוצר לדימוי")) {
    return {
      view: "scanner",
      text: "בעמוד סריקה בוחרים מוצר מהרשימה המדומה. מיד רואים מחיר, דירוג בריאות, התאמה לפרופיל והצעת החלפה אם קיימת.",
    };
  }
  if (text.includes("קטלוג") || text.includes("להוסיף מוצר") || text.includes("הוספה") || text.includes("מוצר חדש")) {
    return {
      view: "list",
      text: "כדי להוסיף מוצר פותחים קטלוג, מחפשים מוצר ולוחצים 'הוספה'. אם המוצר לא קיים, יש אזור 'הוספה ידנית' שבו מכניסים שם, מחיר וקטגוריה.",
    };
  }
  if (text.includes("תקציב") || text.includes("מחיר") || text.includes("חריגה") || text.includes("נשאר")) {
    return {
      view: "list",
      text: "התקציב מופיע בסרגל הצד וברשימת הקניות. אם הקנייה מתקרבת ל-85% מהתקציב, המערכת מסמנת אזהרה ומדגישה את מצב התקציב.",
    };
  }
  if (text.includes("רשימה") || text.includes("צ׳ק") || text.includes("סימון")) {
    return {
      view: "list",
      text: "ברשימת הקניות אפשר לסמן מוצרים שנקנו, למחוק מוצרים, לראות קטגוריות ולבדוק כמה נשאר בתקציב.",
    };
  }
  if (text.includes("תובנות") || text.includes("חיסכון") || text.includes("גרף") || text.includes("קבלה")) {
    return {
      view: "dashboard",
      text: "התובנות הן אזור שמנתח את הקניות שלך: כמה הוצאת, כמה חסכת, אילו החלפות משתלמות עשית ומה אפשר לשפר בקנייה הבאה. הן עוזרות להבין את הרגלי הקנייה ולשלוט טוב יותר בתקציב.",
    };
  }
  if (text.includes("פרופיל") || text.includes("אווטאר") || text.includes("תזונה") || text.includes("משק בית")) {
    return {
      view: "profile",
      text: "בפרופיל אפשר לערוך שם, אימייל, כתובת, תקציב, סופר מועדף, לבחור אווטאר, להגדיר העדפות תזונה ולהוסיף אנשים למשק הבית.",
    };
  }
  if (text.includes("החלפה") || text.includes("swap") || text.includes("בריא") || text.includes("זול")) {
    return {
      view: "scanner",
      text: "כאשר למוצר יש חלופה, SmartCart מציגה כרטיס 'נסי את זה במקום' עם מחיר חדש, דירוג בריאות וחיסכון צפוי. אפשר לבחור 'החלפה וחיסכון'.",
    };
  }
  return {
    view: null,
    text: "אפשר לשאול אותי על התחלת קנייה, סריקה, קטלוג, הוספת מוצר, תקציב, רשימת קניות, תובנות או פרופיל. למשל: 'איך מוסיפים מוצר חדש?'",
  };
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
      return "סריקה";
  }
}

function buildLearningModel(list, budget) {
  const categoryTotals = list.reduce((totals, item) => {
    totals[item.category] = (totals[item.category] || 0) + 1;
    return totals;
  }, {});
  const favoriteCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "Pantry";
  const favoriteCategoryLabel = CATEGORY_LABELS[favoriteCategory] || favoriteCategory;
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
    favoriteCategoryLabel,
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
        value: favoriteCategoryLabel,
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

/* eslint-disable no-irregular-whitespace */
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
  All: "׳”׳›׳",
  Produce: "׳₪׳™׳¨׳•׳× ׳•׳™׳¨׳§׳•׳×",
  Dairy: "׳׳•׳¦׳¨׳™ ׳—׳׳‘",
  Cheese: "׳’׳‘׳™׳ ׳•׳×",
  Meat: "׳‘׳©׳¨׳™׳",
  Deli: "׳ ׳§׳ ׳™׳§׳™׳",
  Cleaning: "׳ ׳™׳§׳™׳•׳",
  Pantry: "׳׳–׳•׳•׳”",
  Drinks: "׳©׳×׳™׳™׳”",
  DryGoods: "׳׳•׳¦׳¨׳™ ׳™׳¡׳•׳“ ׳™׳‘׳©׳™׳",
  Pasta: "׳₪׳¡׳˜׳•׳× ׳•׳׳˜׳¨׳™׳•׳×",
  Sauces: "׳©׳׳ ׳™׳ ׳•׳¨׳˜׳‘׳™׳",
  Canned: "׳©׳™׳׳•׳¨׳™׳ ׳•׳׳•׳›׳ ׳™׳",
  Bakery: "׳׳—׳׳™׳ ׳•׳׳׳₪׳™׳",
  Frozen: "׳§׳₪׳•׳׳™׳",
  Hygiene: "׳ ׳™׳™׳¨ ׳•׳”׳™׳’׳™׳™׳ ׳”",
  Storage: "׳—׳“ ׳₪׳¢׳׳™ ׳•׳׳—׳¡׳•׳",
  Snacks: "׳ ׳©׳ ׳•׳©׳™׳ ׳•׳׳×׳•׳§׳™׳",
};

const DIETARY_LABELS = {
  Vegan: "׳˜׳‘׳¢׳•׳ ׳™",
  Vegetarian: "׳¦׳׳—׳•׳ ׳™",
  Lactose: "׳׳›׳™׳ ׳׳§׳˜׳•׳–",
  "Lactose-free": "׳׳׳ ׳׳§׳˜׳•׳–",
  "Gluten-free": "׳׳׳ ׳’׳׳•׳˜׳",
  "Nut-free": "׳׳׳ ׳׳’׳•׳–׳™׳",
  "Sugar-free": "׳׳׳ ׳¡׳•׳›׳¨",
  Household: "׳׳©׳§ ׳‘׳™׳×",
};

const BULK_CATALOG_SECTIONS = [
  ["DryGoods", "׳׳–׳•׳•׳” ׳‘׳¡׳™׳¡׳™", "נ¥£", 5.9, "׳׳•׳¨׳– ׳׳‘׳, ׳׳•׳¨׳– ׳‘׳¡׳׳˜׳™, ׳׳•׳¨׳– ׳׳׳, ׳₪׳×׳™׳×׳™׳, ׳‘׳•׳¨׳’׳•׳, ׳§׳•׳¡׳§׳•׳¡, ׳§׳™׳ ׳•׳׳”, ׳¢׳“׳©׳™׳ ׳™׳¨׳•׳§׳•׳×, ׳¢׳“׳©׳™׳ ׳›׳×׳•׳׳•׳×, ׳—׳•׳׳•׳¡ ׳™׳‘׳©, ׳©׳¢׳•׳¢׳™׳× ׳׳‘׳ ׳”, ׳©׳¢׳•׳¢׳™׳× ׳׳“׳•׳׳”, ׳’׳¨׳™׳¡׳™׳, ׳§׳׳— ׳׳‘׳, ׳§׳׳— ׳׳׳, ׳§׳׳— ׳×׳•׳₪׳—, ׳¡׳•׳›׳¨ ׳׳‘׳, ׳¡׳•׳›׳¨ ׳—׳•׳, ׳׳‘׳§׳× ׳¡׳•׳›׳¨, ׳׳׳—, ׳₪׳׳₪׳ ׳©׳—׳•׳¨, ׳₪׳₪׳¨׳™׳§׳” ׳׳×׳•׳§׳”, ׳₪׳₪׳¨׳™׳§׳” ׳—׳¨׳™׳₪׳”, ׳›׳•׳¨׳›׳•׳, ׳›׳׳•׳, ׳§׳™׳ ׳׳•׳, ׳׳‘׳§׳× ׳©׳•׳, ׳׳‘׳§׳× ׳׳¨׳§ ׳¢׳•׳£, ׳׳‘׳§׳× ׳׳¨׳§ ׳‘׳¦׳, ׳₪׳™׳¨׳•׳¨׳™ ׳׳—׳, ׳©׳•׳׳©׳•׳, ׳˜׳—׳™׳ ׳” ׳’׳•׳׳׳™׳×, ׳“׳‘׳©, ׳¡׳™׳׳׳, ׳¨׳™׳‘׳”, ׳—׳׳׳× ׳‘׳•׳˜׳ ׳™׳, ׳©׳•׳§׳•׳׳“ ׳׳׳¨׳™׳—׳”, ׳§׳§׳׳•, ׳׳‘׳§׳× ׳׳₪׳™׳™׳”, ׳¡׳•׳“׳” ׳׳©׳×׳™׳™׳”, ׳×׳׳¦׳™׳× ׳•׳ ׳™׳"],
  ["Pasta", "׳₪׳¡׳˜׳•׳× ׳•׳׳˜׳¨׳™׳•׳×", "נ", 7.9, "׳₪׳¡׳˜׳” ׳¡׳₪׳’׳˜׳™, ׳₪׳¡׳˜׳” ׳₪׳ ׳”, ׳₪׳¡׳˜׳” ׳₪׳•׳–׳™׳׳™, ׳₪׳¡׳˜׳” ׳₪׳¨׳₪׳¨׳™׳, ׳₪׳¡׳˜׳” ׳׳§׳¨׳•׳ ׳™, ׳₪׳¡׳˜׳” ׳׳׳׳”, ׳₪׳¡׳˜׳” ׳׳׳ ׳’׳׳•׳˜׳, ׳׳˜׳¨׳™׳•׳× ׳‘׳™׳¦׳™׳, ׳׳˜׳¨׳™׳•׳× ׳׳•׳¨׳–, ׳ ׳•׳“׳׳¡ ׳׳”׳§׳₪׳¦׳”, ׳₪׳×׳™׳×׳™׳ ׳׳₪׳•׳™׳™׳, ׳§׳•׳¡׳§׳•׳¡ ׳׳”׳™׳¨ ׳”׳›׳ ׳”, ׳¨׳‘׳™׳•׳׳™ ׳׳•׳›׳, ׳ ׳™׳•׳§׳™, ׳¨׳•׳˜׳‘ ׳¢׳’׳‘׳ ׳™׳•׳× ׳׳₪׳¡׳˜׳”, ׳¨׳¡׳§ ׳¢׳’׳‘׳ ׳™׳•׳×, ׳¢׳’׳‘׳ ׳™׳•׳× ׳׳¨׳•׳¡׳§׳•׳×, ׳¢׳’׳‘׳ ׳™׳•׳× ׳§׳•׳‘׳™׳•׳×, ׳¨׳•׳˜׳‘ ׳©׳׳ ׳× ׳׳₪׳¡׳˜׳”, ׳₪׳¡׳˜׳•, ׳–׳™׳×׳™׳ ׳׳₪׳¡׳˜׳”, ׳×׳™׳¨׳¡ ׳׳§׳•׳₪׳¡׳”, ׳₪׳˜׳¨׳™׳•׳× ׳׳©׳•׳׳¨׳•׳×, ׳˜׳•׳ ׳” ׳׳₪׳¡׳˜׳”"],
  ["Sauces", "׳©׳׳ ׳™׳ ׳•׳¨׳˜׳‘׳™׳", "נ«™", 8.9, "׳©׳׳ ׳§׳ ׳•׳׳”, ׳©׳׳ ׳–׳™׳×, ׳©׳׳ ׳—׳׳ ׳™׳•׳×, ׳©׳׳ ׳׳‘׳•׳§׳“׳•, ׳©׳׳ ׳©׳•׳׳©׳•׳, ׳¡׳₪׳¨׳™׳™ ׳©׳׳, ׳—׳•׳׳¥ ׳¨׳’׳™׳, ׳—׳•׳׳¥ ׳×׳₪׳•׳—׳™׳, ׳—׳•׳׳¥ ׳‘׳׳¡׳׳™, ׳¨׳•׳˜׳‘ ׳¡׳•׳™׳”, ׳¨׳•׳˜׳‘ ׳¦׳³׳™׳׳™ ׳׳×׳•׳§, ׳¨׳•׳˜׳‘ ׳˜׳¨׳™׳׳§׳™, ׳§׳˜׳©׳•׳₪, ׳׳™׳•׳ ׳–, ׳—׳¨׳“׳, ׳¨׳•׳˜׳‘ ׳‘׳¨׳‘׳™׳§׳™׳•, ׳¨׳•׳˜׳‘ ׳©׳•׳, ׳¨׳•׳˜׳‘ ׳׳׳£ ׳”׳׳™׳™׳, ׳¨׳•׳˜׳‘ ׳׳¡׳׳˜, ׳׳™׳׳•׳ ׳׳©׳•׳׳¨, ׳׳™׳¥ ׳׳™׳׳•׳, ׳׳׳— ׳’׳¡, ׳׳׳— ׳׳™׳׳•׳, ׳¢׳׳™ ׳“׳₪׳ ׳”, ׳¦׳³׳™׳׳™ ׳’׳¨׳•׳¡, ׳׳•׳¨׳’׳ ׳•, ׳‘׳–׳™׳׳™׳§׳•׳ ׳™׳‘׳©, ׳–׳¢׳×׳¨, ׳×׳‘׳׳™׳ ׳¢׳ ׳”׳׳©, ׳×׳‘׳׳™׳ ׳©׳•׳•׳׳¨׳׳”, ׳×׳‘׳׳™׳ ׳׳§׳¦׳™׳¦׳•׳×, ׳×׳‘׳׳™׳ ׳׳₪׳™׳¦׳”"],
  ["Canned", "׳©׳™׳׳•׳¨׳™׳ ׳•׳׳•׳›׳ ׳™׳", "נ¥«", 6.9, "׳˜׳•׳ ׳” ׳‘׳©׳׳, ׳˜׳•׳ ׳” ׳‘׳׳™׳, ׳×׳™׳¨׳¡ ׳׳©׳•׳׳¨, ׳׳₪׳•׳ ׳” ׳•׳’׳–׳¨, ׳—׳•׳׳•׳¡ ׳׳©׳•׳׳¨, ׳©׳¢׳•׳¢׳™׳× ׳‘׳¨׳•׳˜׳‘ ׳¢׳’׳‘׳ ׳™׳•׳×, ׳₪׳˜׳¨׳™׳•׳× ׳—׳×׳•׳›׳•׳×, ׳׳׳₪׳₪׳•׳ ׳™׳ ׳—׳׳•׳¦׳™׳, ׳–׳™׳×׳™׳ ׳™׳¨׳•׳§׳™׳, ׳–׳™׳×׳™׳ ׳©׳—׳•׳¨׳™׳, ׳₪׳׳₪׳ ׳§׳׳•׳™, ׳—׳׳‘ ׳§׳•׳§׳•׳¡, ׳׳¨׳§ ׳ ׳׳¡, ׳׳ ׳” ׳—׳׳”, ׳§׳¨׳§׳¨׳™׳ ׳׳™׳©׳™׳™׳, ׳—׳˜׳™׳₪׳™ ׳׳ ׳¨׳’׳™׳”, ׳’׳¨׳ ׳•׳׳”, ׳“׳’׳ ׳™ ׳‘׳•׳§׳¨, ׳§׳•׳¨׳ ׳₪׳׳§׳¡, ׳©׳™׳‘׳•׳׳× ׳©׳•׳¢׳"],
  ["Drinks", "׳©׳×׳™׳™׳”", "נ¥₪", 5.9, "׳׳™׳ ׳׳™׳ ׳¨׳׳™׳, ׳¡׳•׳“׳”, ׳§׳•׳׳”, ׳§׳•׳׳” ׳–׳™׳¨׳•, ׳¡׳₪׳¨׳™׳™׳˜, ׳₪׳׳ ׳˜׳”, ׳׳™׳¥ ׳×׳₪׳•׳–׳™׳, ׳׳™׳¥ ׳¢׳ ׳‘׳™׳, ׳׳™׳¥ ׳×׳₪׳•׳—׳™׳, ׳×׳” ׳§׳¨, ׳׳™׳™׳¡ ׳§׳₪׳”, ׳§׳₪׳” ׳©׳—׳•׳¨, ׳ ׳¡ ׳§׳₪׳”, ׳§׳₪׳¡׳•׳׳•׳× ׳§׳₪׳”, ׳§׳₪׳” ׳ ׳׳¡, ׳×׳” ׳¨׳’׳™׳, ׳×׳” ׳™׳¨׳•׳§, ׳×׳” ׳ ׳¢׳ ׳¢, ׳×׳” ׳§׳׳•׳׳™׳, ׳©׳•׳§׳•, ׳—׳׳‘ ׳¨׳’׳™׳, ׳—׳׳‘ ׳“׳ ׳׳§׳˜׳•׳–, ׳—׳׳‘ ׳¡׳•׳™׳”, ׳—׳׳‘ ׳©׳§׳“׳™׳, ׳—׳׳‘ ׳©׳™׳‘׳•׳׳× ׳©׳•׳¢׳, ׳׳©׳§׳” ׳׳ ׳¨׳’׳™׳”, ׳×׳¨׳›׳™׳– ׳₪׳˜׳, ׳×׳¨׳›׳™׳– ׳¢׳ ׳‘׳™׳, ׳×׳¨׳›׳™׳– ׳׳™׳׳•׳ ׳¢׳ ׳¢"],
  ["Bakery", "׳׳—׳׳™׳ ׳•׳׳׳₪׳™׳", "נ¥–", 7.5, "׳׳—׳ ׳׳—׳™׳“, ׳׳—׳ ׳₪׳¨׳•׳¡, ׳׳—׳ ׳׳׳, ׳׳—׳ ׳§׳, ׳׳—׳ ׳›׳•׳¡׳׳™׳, ׳׳—׳ ׳©׳™׳₪׳•׳, ׳׳—׳׳ ׳™׳•׳× ׳¨׳’׳™׳׳•׳×, ׳׳—׳׳ ׳™׳•׳× ׳׳׳׳•׳×, ׳₪׳™׳×׳•׳×, ׳₪׳™׳×׳•׳× ׳׳§׳׳— ׳׳׳, ׳‘׳™׳™׳’׳, ׳˜׳•׳¨׳˜׳™׳•׳×, ׳׳׳₪׳•׳×, ׳—׳׳”, ׳‘׳׳’׳˜, ׳’׳³׳‘׳˜׳”, ׳₪׳¨׳™׳›׳™׳•׳× ׳׳•׳¨׳–, ׳₪׳¨׳™׳›׳™׳•׳× ׳×׳™׳¨׳¡, ׳¦׳ ׳™׳׳™׳, ׳˜׳•׳¡׳˜׳¢׳™׳, ׳§׳¨׳§׳¨׳™׳ ׳׳׳•׳—׳™׳, ׳§׳¨׳§׳¨׳™׳ ׳׳—׳™׳˜׳” ׳׳׳׳”, ׳§׳¨׳§׳¨׳™׳ ׳¢׳ ׳©׳•׳׳©׳•׳, ׳§׳¨׳§׳¨׳™׳ ׳“׳§׳™׳, ׳₪׳×׳™׳‘׳¨, ׳¢׳•׳’׳™׳•׳× ׳™׳‘׳©׳•׳×, ׳¢׳•׳’׳™׳•׳× ׳©׳•׳§׳•׳׳“ ׳¦׳³׳™׳₪׳¡, ׳¢׳•׳’׳™׳•׳× ׳׳׳•׳—׳•׳×, ׳‘׳™׳¡׳§׳•׳•׳™׳˜׳™׳, ׳’׳¨׳™׳¡׳™׳ ׳™"],
  ["Dairy", "׳׳§׳¨׳¨ ׳—׳׳‘", "נ¥›", 6.9, "׳—׳׳‘, ׳‘׳™׳¦׳™׳, ׳’׳‘׳™׳ ׳” ׳׳‘׳ ׳”, ׳’׳‘׳™׳ ׳” ׳‘׳•׳׳’׳¨׳™׳×, ׳’׳‘׳™׳ ׳× ׳₪׳˜׳”, ׳’׳‘׳™׳ ׳× ׳©׳׳ ׳×, ׳™׳•׳’׳•׳¨׳˜ ׳׳‘׳, ׳™׳•׳’׳•׳¨׳˜ ׳‘׳˜׳¢׳׳™׳, ׳׳¢׳“׳ ׳™׳, ׳©׳׳ ׳× ׳׳×׳•׳§׳”, ׳©׳׳ ׳× ׳׳‘׳™׳©׳•׳, ׳׳¨׳’׳¨׳™׳ ׳”, ׳’׳‘׳™׳ ׳” ׳׳’׳•׳¨׳“׳×, ׳׳•׳¦׳¨׳׳”, ׳₪׳¨׳׳–׳"],
  ["Produce", "׳×׳•׳¦׳¨׳× ׳˜׳¨׳™׳™׳”", "נ¥¬", 4.9, "׳‘׳¦׳ ׳׳‘׳, ׳‘׳¦׳ ׳¡׳’׳•׳, ׳©׳•׳, ׳‘׳˜׳˜׳”, ׳₪׳׳₪׳ ׳¦׳”׳•׳‘, ׳—׳¡׳”, ׳›׳¨׳•׳‘, ׳₪׳˜׳¨׳•׳–׳™׳׳™׳”, ׳›׳•׳¡׳‘׳¨׳”, ׳©׳׳™׳¨, ׳ ׳¢׳ ׳¢, ׳׳™׳׳•׳, ׳׳‘׳•׳§׳“׳•, ׳§׳™׳©׳•׳׳™׳, ׳—׳¦׳™׳׳™׳, ׳₪׳˜׳¨׳™׳•׳× ׳˜׳¨׳™׳•׳×, ׳×׳₪׳•׳–׳™׳, ׳¢׳ ׳‘׳™׳, ׳׳’׳¡׳™׳, ׳׳₪׳¨׳¡׳§׳™׳, ׳©׳–׳™׳₪׳™׳, ׳×׳•׳×׳™׳, ׳׳׳•׳, ׳׳‘׳˜׳™׳—"],
  ["Meat", "׳§׳¦׳‘׳™׳™׳” ׳•׳“׳’׳™׳", "נ¥©", 24.9, "׳₪׳¨׳’׳™׳•׳×, ׳©׳•׳§׳™׳™׳, ׳›׳ ׳₪׳™׳™׳, ׳‘׳©׳¨ ׳˜׳—׳•׳, ׳§׳¦׳™׳¦׳•׳× ׳׳•׳›׳ ׳•׳×, ׳©׳ ׳™׳¦׳׳™׳, ׳ ׳§׳ ׳™׳§׳™׳•׳×, ׳”׳׳‘׳•׳¨׳’׳¨ ׳§׳₪׳•׳, ׳“׳’ ׳¡׳׳׳•׳, ׳“׳’ ׳׳׳ ׳•׳, ׳˜׳•׳ ׳” ׳˜׳¨׳™׳™׳” ׳׳• ׳§׳₪׳•׳׳”, ׳§׳‘׳‘, ׳©׳•׳•׳׳¨׳׳” ׳§׳₪׳•׳׳”"],
  ["Frozen", "׳§׳₪׳•׳׳™׳", "נ§", 12.9, "׳™׳¨׳§׳•׳× ׳§׳₪׳•׳׳™׳, ׳‘׳¨׳•׳§׳•׳׳™ ׳§׳₪׳•׳, ׳©׳¢׳•׳¢׳™׳× ׳™׳¨׳•׳§׳”, ׳׳₪׳•׳ ׳” ׳§׳₪׳•׳׳”, ׳×׳™׳¨׳¡ ׳§׳₪׳•׳, ׳¦׳³׳™׳₪׳¡ ׳§׳₪׳•׳, ׳‘׳•׳¨׳§׳¡׳™׳, ׳’׳³׳—׳ ׳•׳, ׳׳׳׳•׳•׳—, ׳₪׳™׳¦׳” ׳§׳₪׳•׳׳”, ׳©׳ ׳™׳¦׳ ׳×׳™׳¨׳¡, ׳”׳׳‘׳•׳¨׳’׳¨ ׳¦׳׳—׳•׳ ׳™, ׳’׳׳™׳“׳•׳×, ׳§׳¨׳—"],
  ["Cleaning", "׳ ׳™׳§׳™׳•׳ ׳׳‘׳™׳×", "נ§½", 9.9, "׳˜׳‘׳׳™׳•׳× ׳׳׳“׳™׳—, ׳׳׳— ׳׳׳“׳™׳—, ׳ ׳•׳–׳ ׳”׳‘׳¨׳§׳” ׳׳׳“׳™׳—, ׳¡׳₪׳•׳’׳™׳ ׳׳›׳׳™׳, ׳¡׳§׳•׳¦׳³׳™׳, ׳׳˜׳׳™׳•׳× ׳ ׳™׳§׳•׳™, ׳׳˜׳׳™׳•׳× ׳׳™׳§׳¨׳•׳₪׳™׳™׳‘׳¨, ׳ ׳™׳™׳¨ ׳¡׳•׳₪׳’, ׳׳’׳‘׳•׳ ׳™׳ ׳׳ ׳™׳§׳•׳™ ׳›׳׳׳™, ׳׳’׳‘׳•׳ ׳™׳ ׳׳¨׳¦׳₪׳”, ׳׳§׳•׳ ׳•׳׳™׳§׳”, ׳׳¡׳™׳¨ ׳©׳•׳׳ ׳™׳, ׳¡׳₪׳¨׳™׳™ ׳ ׳™׳§׳•׳™ ׳›׳׳׳™, ׳¡׳₪׳¨׳™׳™ ׳—׳׳•׳ ׳•׳×, ׳—׳•׳׳¨ ׳׳ ׳™׳§׳•׳™ ׳¨׳¦׳₪׳”, ׳—׳•׳׳¨ ׳׳ ׳™׳§׳•׳™ ׳©׳™׳¨׳•׳×׳™׳, ׳’׳³׳ ׳׳¡׳׳”, ׳׳¡׳™׳¨ ׳׳‘׳ ׳™׳×, ׳—׳•׳׳¨ ׳׳ ׳™׳§׳•׳™ ׳׳׳‘׳˜׳™׳”, ׳׳‘׳§׳× ׳›׳‘׳™׳¡׳”, ׳׳¨׳›׳ ׳›׳‘׳™׳¡׳”, ׳׳¡׳™׳¨ ׳›׳×׳׳™׳, ׳׳‘׳©׳ ׳›׳‘׳™׳¡׳”, ׳©׳§׳™׳•׳× ׳׳©׳₪׳” ׳§׳˜׳ ׳•׳×, ׳©׳§׳™׳•׳× ׳׳©׳₪׳” ׳’׳“׳•׳׳•׳×, ׳›׳₪׳₪׳•׳× ׳ ׳™׳§׳™׳•׳, ׳׳˜׳׳˜׳, ׳™׳¢׳”, ׳׳’׳‘, ׳¡׳׳¨׳˜׳•׳˜ ׳¨׳¦׳₪׳”, ׳ ׳•׳–׳ ׳׳—׳™׳˜׳•׳™ ׳™׳“׳™׳™׳"],
  ["Hygiene", "׳ ׳™׳™׳¨ ׳•׳”׳™׳’׳™׳™׳ ׳”", "נ§´", 10.9, "׳ ׳™׳™׳¨ ׳˜׳•׳׳׳˜, ׳˜׳™׳©׳•, ׳׳’׳‘׳•׳ ׳™׳ ׳׳—׳™׳, ׳׳’׳‘׳•׳ ׳™׳ ׳׳™׳ ׳˜׳™׳׳™׳™׳, ׳¡׳‘׳•׳ ׳™׳“׳™׳™׳, ׳¡׳‘׳•׳ ׳’׳•׳£, ׳©׳׳₪׳•, ׳׳¨׳›׳ ׳©׳™׳¢׳¨, ׳׳©׳—׳× ׳©׳™׳ ׳™׳™׳, ׳׳‘׳¨׳©׳•׳× ׳©׳™׳ ׳™׳™׳, ׳׳™ ׳₪׳”, ׳“׳׳•׳“׳•׳¨׳ ׳˜, ׳¡׳›׳™׳ ׳™ ׳’׳™׳׳•׳—, ׳§׳¦׳£ ׳’׳™׳׳•׳—, ׳×׳—׳‘׳•׳©׳•׳× ׳”׳™׳’׳™׳™׳ ׳™׳•׳×, ׳˜׳׳₪׳•׳ ׳™׳, ׳₪׳“׳™׳ ׳™׳•׳׳™׳™׳, ׳§׳¨׳ ׳’׳•׳£, ׳§׳¨׳ ׳™׳“׳™׳™׳"],
  ["Storage", "׳—׳“ ׳₪׳¢׳׳™ ׳•׳׳—׳¡׳•׳", "נ“¦", 8.9, "׳¦׳׳—׳•׳× ׳—׳“ ׳₪׳¢׳׳™׳•׳×, ׳›׳•׳¡׳•׳× ׳—׳“ ׳₪׳¢׳׳™׳•׳×, ׳¡׳›׳•׳´׳ ׳—׳“ ׳₪׳¢׳׳™, ׳׳₪׳™׳•׳×, ׳ ׳™׳™׳¨ ׳›׳¡׳£, ׳ ׳™׳™׳¨ ׳׳₪׳™׳™׳”, ׳ ׳™׳™׳׳•׳ ׳ ׳¦׳׳“, ׳©׳§׳™׳•׳× ׳׳•׳›׳, ׳©׳§׳™׳•׳× ׳¡׳ ׳“׳•׳•׳™׳¥׳³, ׳§׳•׳₪׳¡׳׳•׳× ׳׳—׳¡׳•׳, ׳§׳•׳₪׳¡׳׳•׳× ׳—׳“ ׳₪׳¢׳׳™׳•׳×, ׳×׳‘׳ ׳™׳•׳× ׳׳׳•׳׳™׳ ׳™׳•׳, ׳ ׳¨׳•׳× ׳©׳‘׳×, ׳’׳₪׳¨׳•׳¨׳™׳, ׳׳¦׳×"],
  ["Snacks", "׳ ׳©׳ ׳•׳©׳™׳ ׳•׳׳×׳•׳§׳™׳", "נ«", 6.9, "׳‘׳™׳¡׳׳™, ׳×׳₪׳•׳¦׳³׳™׳₪׳¡, ׳“׳•׳¨׳™׳˜׳•׳¡, ׳₪׳•׳₪׳§׳•׳¨׳, ׳׳’׳•׳–׳™׳, ׳©׳§׳“׳™׳, ׳’׳¨׳¢׳™׳ ׳™׳, ׳—׳׳•׳¦׳™׳•׳×, ׳©׳•׳§׳•׳׳“, ׳—׳˜׳™׳₪׳™ ׳©׳•׳§׳•׳׳“, ׳•׳•׳₪׳׳™׳, ׳¢׳•׳’׳™׳•׳×, ׳¢׳•׳’׳•׳× ׳׳™׳©׳™׳•׳×, ׳׳¡׳˜׳™׳§׳™׳, ׳¡׳•׳›׳¨׳™׳•׳×, ׳—׳˜׳™׳₪׳™ ׳—׳׳‘׳•׳, ׳—׳˜׳™׳₪׳™ ׳’׳¨׳ ׳•׳׳”"],
];

const BULK_PRICE_OVERRIDES = {
  "׳‘׳™׳¦׳™׳": 14.9,
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
    name: "׳—׳׳׳”",
    brand: "Tnuva",
    category: "Dairy",
    price: 12.9,
    health: "B",
    dietary: ["Vegetarian", "Lactose"],
    image: butterImage,
    alternative: {
      name: "SmartBrand ׳׳׳¨׳— ׳׳•׳₪׳—׳× ׳©׳•׳׳",
      price: 9.4,
      health: "A",
      dietary: ["Vegetarian", "Lactose-free"],
      insight: "׳—׳•׳¡׳ ג‚×3.50 ׳•׳׳×׳׳™׳ ׳™׳•׳×׳¨ ׳׳׳™ ׳©׳׳¢׳“׳™׳₪׳” ׳₪׳—׳•׳× ׳׳§׳˜׳•׳–.",
    },
  },
  {
    id: "cereal-organic",
    upc: "7290001302279",
    name: "׳‘׳׳‘׳”",
    brand: "Osem, ׳׳•׳¡׳",
    category: "Pantry",
    price: 8.9,
    health: "C",
    dietary: ["Vegetarian"],
    image: produceImage("נ¿"),
    alternative: {
      name: "SmartBrand ׳₪׳•׳₪׳§׳•׳¨׳ ׳˜׳‘׳¢׳™",
      price: 5.9,
      health: "B",
      dietary: ["Vegan", "Gluten-free"],
      insight: "׳—׳•׳¡׳ ג‚×3.00 ׳•׳׳•׳¨׳™׳“ ׳ ׳×׳¨׳ ׳•׳©׳•׳׳ ׳‘׳™׳—׳¡ ׳׳—׳˜׳™׳£ ׳”׳׳§׳•׳¨׳™.",
    },
  },
  {
    id: "pasta-local",
    upc: "7290017406374",
    name: "׳׳•׳¨׳– ׳™׳¡׳׳™׳",
    brand: "׳¨׳׳™ ׳׳•׳™",
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
    name: "׳׳₪׳¨׳•׳₪׳•",
    brand: "Osem, ׳׳¡׳",
    category: "Pantry",
    price: 9.9,
    health: "D",
    dietary: ["Vegan", "Gluten-free"],
    image: apropoImage,
    alternative: {
      name: "SmartBrand ׳—׳˜׳™׳£ ׳×׳™׳¨׳¡ ׳׳₪׳•׳™",
      price: 6.4,
      health: "B",
      dietary: ["Vegan", "Gluten-free", "Sugar-free"],
      insight: "׳—׳•׳¡׳ ג‚×3.50 ׳•׳׳¦׳™׳¢ ׳—׳׳•׳₪׳” ׳§׳׳” ׳™׳•׳×׳¨ ׳׳ ׳©׳ ׳•׳©.",
    },
  },
  {
    id: "olive-oil",
    upc: "7290004125455",
    name: "׳©׳׳ ׳× ׳—׳׳•׳¦׳” 15%",
    brand: "׳×׳ ׳•׳‘׳”",
    category: "Pantry",
    price: 10.9,
    health: "D",
    dietary: ["Vegetarian", "Lactose"],
    image: sourCreamImage,
    alternative: {
      name: "SmartBrand ׳©׳׳ ׳× 9%",
      price: 7.9,
      health: "C",
      dietary: ["Vegetarian"],
      insight: "׳—׳•׳¡׳ ג‚×3.00 ׳•׳׳₪׳—׳™׳× ׳׳—׳•׳–׳™ ׳©׳•׳׳.",
    },
  },
  {
    id: "tomatoes",
    upc: "7290018564059",
    name: "׳©׳¢׳•׳¢׳™׳× ׳™׳¨׳•׳§׳” ׳©׳׳׳” ׳¢׳“׳™׳ ׳”",
    brand: "׳¨׳׳™ ׳׳•׳™",
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
    name: "׳‘׳ ׳ ׳•׳× ׳˜׳¨׳™׳•׳×",
    brand: "׳×׳•׳¦׳¨׳× ׳˜׳¨׳™׳™׳”",
    category: "Produce",
    price: 6.9,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("נ"),
    alternative: null,
  },
  {
    id: "apple-red",
    upc: "PLU 4017",
    name: "׳×׳₪׳•׳— ׳׳“׳•׳",
    brand: "׳×׳•׳¦׳¨׳× ׳˜׳¨׳™׳™׳”",
    category: "Produce",
    price: 9.9,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("נ"),
    alternative: null,
  },
  {
    id: "tomato-loose",
    upc: "PLU 4664",
    name: "׳¢׳’׳‘׳ ׳™׳•׳×",
    brand: "׳×׳•׳¦׳¨׳× ׳˜׳¨׳™׳™׳”",
    category: "Produce",
    price: 7.5,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("נ…"),
    alternative: null,
  },
  {
    id: "cucumber-loose",
    upc: "PLU 4593",
    name: "׳׳׳₪׳₪׳•׳ ׳™׳",
    brand: "׳×׳•׳¦׳¨׳× ׳˜׳¨׳™׳™׳”",
    category: "Produce",
    price: 5.9,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("נ¥’"),
    alternative: null,
  },
  {
    id: "pepper-red",
    upc: "PLU 4688",
    name: "׳₪׳׳₪׳ ׳׳“׳•׳",
    brand: "׳×׳•׳¦׳¨׳× ׳˜׳¨׳™׳™׳”",
    category: "Produce",
    price: 11.9,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("נ«‘"),
    alternative: null,
  },
  {
    id: "carrot-loose",
    upc: "PLU 4562",
    name: "׳’׳–׳¨",
    brand: "׳×׳•׳¦׳¨׳× ׳˜׳¨׳™׳™׳”",
    category: "Produce",
    price: 4.9,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("נ¥•"),
    alternative: null,
  },
  {
    id: "potato-white",
    upc: "PLU 4072",
    name: "׳×׳₪׳•׳—׳™ ׳׳“׳׳” ׳׳‘׳ ׳™׳",
    brand: "׳×׳•׳¦׳¨׳× ׳˜׳¨׳™׳™׳”",
    category: "Produce",
    price: 4.5,
    health: "B",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("נ¥”"),
    alternative: null,
  },
  {
    id: "onion-dry",
    upc: "PLU 4665",
    name: "׳‘׳¦׳ ׳™׳‘׳©",
    brand: "׳×׳•׳¦׳¨׳× ׳˜׳¨׳™׳™׳”",
    category: "Produce",
    price: 3.9,
    health: "A",
    dietary: ["Vegan", "Gluten-free", "Nut-free"],
    image: produceImage("נ§…"),
    alternative: null,
  },
  {
    id: "cheese-cottage",
    upc: "7290004125011",
    name: "׳§׳•׳˜׳’' 5%",
    brand: "׳×׳ ׳•׳‘׳”",
    category: "Cheese",
    price: 6.9,
    health: "B",
    dietary: ["Vegetarian", "Lactose"],
    image: produceImage("נ§€"),
    alternative: {
      name: "SmartBrand ׳§׳•׳˜׳’' 3%",
      price: 5.8,
      health: "A",
      dietary: ["Vegetarian"],
      insight: "׳—׳•׳¡׳ ג‚×1.10 ׳•׳׳₪׳—׳™׳× ׳׳—׳•׳–׳™ ׳©׳•׳׳ ׳‘׳׳™ ׳׳•׳•׳×׳¨ ׳¢׳ ׳—׳׳‘׳•׳.",
    },
  },
  {
    id: "cheese-yellow",
    upc: "7290004125028",
    name: "׳’׳‘׳™׳ ׳” ׳¦׳”׳•׳‘׳” ׳₪׳¨׳•׳¡׳” 28%",
    brand: "׳¢׳׳§",
    category: "Cheese",
    price: 18.9,
    health: "C",
    dietary: ["Vegetarian", "Lactose"],
    image: produceImage("נ§€"),
    alternative: {
      name: "׳’׳‘׳™׳ ׳” ׳¦׳”׳•׳‘׳” 9% SmartBrand",
      price: 15.9,
      health: "B",
      dietary: ["Vegetarian"],
      insight: "׳—׳•׳¡׳ ג‚×3.00 ׳•׳׳•׳¨׳™׳“ ׳©׳•׳׳ ׳¨׳•׳•׳™ ׳‘׳׳¨׳•׳—׳•׳× ׳”׳©׳‘׳•׳¢.",
    },
  },
  {
    id: "meat-chicken-breast",
    upc: "7290012347115",
    name: "׳—׳–׳” ׳¢׳•׳£ ׳˜׳¨׳™",
    brand: "׳”׳§׳¦׳‘׳™׳™׳”",
    category: "Meat",
    price: 34.9,
    health: "A",
    dietary: ["Gluten-free", "Nut-free"],
    image: produceImage("נ—"),
    alternative: null,
  },
  {
    id: "meat-ground-beef",
    upc: "7290012347122",
    name: "׳‘׳©׳¨ ׳‘׳§׳¨ ׳˜׳—׳•׳",
    brand: "׳”׳§׳¦׳‘׳™׳™׳”",
    category: "Meat",
    price: 42.9,
    health: "C",
    dietary: ["Gluten-free", "Nut-free"],
    image: produceImage("נ¥©"),
    alternative: {
      name: "׳‘׳§׳¨ ׳˜׳—׳•׳ ׳¨׳–׳” 10%",
      price: 39.9,
      health: "B",
      dietary: ["Gluten-free"],
      insight: "׳—׳•׳¡׳ ג‚×3.00 ׳•׳׳₪׳—׳™׳× ׳©׳•׳׳ ׳‘׳™׳—׳¡ ׳׳‘׳©׳¨ ׳¨׳’׳™׳.",
    },
  },
  {
    id: "deli-turkey",
    upc: "7290012347214",
    name: "׳₪׳¡׳˜׳¨׳׳” ׳”׳•׳“׳• ׳“׳§׳™׳§׳”",
    brand: "׳׳¢׳“׳ ׳™׳™׳”",
    category: "Deli",
    price: 16.9,
    health: "C",
    dietary: ["Gluten-free"],
    image: produceImage("נ¥×"),
    alternative: {
      name: "׳₪׳¡׳˜׳¨׳׳” ׳׳•׳₪׳—׳×׳× ׳ ׳×׳¨׳",
      price: 15.5,
      health: "B",
      dietary: ["Gluten-free"],
      insight: "׳—׳•׳¡׳ ג‚×1.40 ׳•׳׳§׳˜׳™׳ ׳¦׳¨׳™׳›׳× ׳ ׳×׳¨׳ ׳‘׳ ׳©׳ ׳•׳©׳™׳ ׳•׳›׳¨׳™׳›׳™׳.",
    },
  },
  {
    id: "deli-salami",
    upc: "7290012347221",
    name: "׳ ׳§׳ ׳™׳§ ׳¡׳׳׳™ ׳₪׳¨׳•׳¡",
    brand: "׳׳¢׳“׳ ׳™׳™׳”",
    category: "Deli",
    price: 19.9,
    health: "D",
    dietary: ["Gluten-free"],
    image: produceImage("נ¥“"),
    alternative: {
      name: "׳ ׳§׳ ׳™׳§ ׳”׳•׳“׳• ׳׳•׳₪׳—׳× ׳©׳•׳׳",
      price: 17.9,
      health: "C",
      dietary: ["Gluten-free"],
      insight: "׳—׳•׳¡׳ ג‚×2.00 ׳•׳׳¦׳™׳¢ ׳—׳׳•׳₪׳” ׳§׳׳” ׳™׳•׳×׳¨ ׳׳›׳¨׳™׳›׳™׳.",
    },
  },
  {
    id: "cleaning-dish-soap",
    upc: "7290012347313",
    name: "׳¡׳‘׳•׳ ׳›׳׳™׳ ׳׳™׳׳•׳",
    brand: "׳¡׳ ׳•",
    category: "Cleaning",
    price: 8.9,
    health: "B",
    dietary: ["Household"],
    image: produceImage("נ§½"),
    alternative: {
      name: "SmartBrand ׳¡׳‘׳•׳ ׳›׳׳™׳ ׳׳¨׳•׳›׳–",
      price: 6.9,
      health: "B",
      dietary: ["Household"],
      insight: "׳—׳•׳¡׳ ג‚×2.00 ׳•׳׳×׳׳™׳ ׳׳§׳ ׳™׳™׳” ׳—׳•׳“׳©׳™׳× ׳§׳‘׳•׳¢׳”.",
    },
  },
  {
    id: "cleaning-laundry-gel",
    upc: "7290012347320",
    name: "׳’'׳ ׳›׳‘׳™׳¡׳” 3 ׳׳™׳˜׳¨",
    brand: "׳‘׳“׳™׳",
    category: "Cleaning",
    price: 29.9,
    health: "B",
    dietary: ["Household"],
    image: produceImage("נ§´"),
    alternative: {
      name: "SmartBrand ׳’'׳ ׳›׳‘׳™׳¡׳” ׳—׳¡׳›׳•׳ ׳™",
      price: 23.9,
      health: "B",
      dietary: ["Household"],
      insight: "׳—׳•׳¡׳ ג‚×6.00 ׳‘׳׳•׳¦׳¨ ׳ ׳™׳§׳™׳•׳ ׳©׳ ׳§׳ ׳” ׳›׳׳¢׳˜ ׳›׳ ׳—׳•׳“׳©.",
    },
  },
  {
    id: "cleaning-trash-bags",
    upc: "7290012347337",
    name: "׳©׳§׳™׳•׳× ׳׳©׳₪׳” ׳—׳–׳§׳•׳×",
    brand: "׳ ׳™׳§׳•׳",
    category: "Cleaning",
    price: 12.9,
    health: "B",
    dietary: ["Household"],
    image: produceImage("נ§»"),
    alternative: null,
  },
  ...BULK_CATALOG_ITEMS,
];

const TRIPS = [
  {
    id: "trip-1",
    store: "׳¨׳׳™ ׳׳•׳™",
    date: "׳”׳™׳•׳, 14:30",
    purchases: 342,
    savings: 58,
    items: [
      ["׳‘׳׳‘׳”", 8.9, 3],
      ["׳׳•׳¨׳– ׳™׳¡׳׳™׳", 11.9, 0],
      ["׳©׳¢׳•׳¢׳™׳× ׳™׳¨׳•׳§׳” ׳©׳׳׳” ׳¢׳“׳™׳ ׳”", 12.4, 0],
    ],
  },
  {
    id: "trip-2",
    store: "׳©׳•׳₪׳¨׳¡׳ ׳“׳™׳",
    date: "׳׳×׳׳•׳, 09:15",
    purchases: 418,
    savings: 42,
    items: [
      ["׳©׳׳ ׳× ׳—׳׳•׳¦׳” 15%", 10.9, 3],
      ["׳׳₪׳¨׳•׳₪׳•", 9.9, 3.5],
      ["׳—׳׳׳”", 12.9, 3.5],
    ],
  },
  {
    id: "trip-3",
    store: "׳•׳™׳§׳˜׳•׳¨׳™",
    date: "׳׳₪׳ ׳™ 3 ׳™׳׳™׳",
    purchases: 215,
    savings: 24,
    items: [
      ["SmartBrand ׳—׳˜׳™׳£ ׳×׳™׳¨׳¡ ׳׳₪׳•׳™", 6.4, 3.5],
      ["SmartBrand ׳₪׳•׳₪׳§׳•׳¨׳ ׳˜׳‘׳¢׳™", 5.9, 3],
      ["SmartBrand ׳©׳׳ ׳× 9%", 7.9, 3],
    ],
  },
];

const CHART_DATA = [
  { label: "׳©׳ ׳™", purchases: 122, savings: 18 },
  { label: "׳©׳׳™׳©׳™", purchases: 188, savings: 32 },
  { label: "׳¨׳‘׳™׳¢׳™", purchases: 96, savings: 14 },
  { label: "׳—׳׳™׳©׳™", purchases: 242, savings: 45 },
  { label: "׳©׳™׳©׳™", purchases: 318, savings: 58 },
  { label: "׳©׳‘׳×", purchases: 408, savings: 76 },
  { label: "׳¨׳׳©׳•׳", purchases: 164, savings: 22 },
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
const RESTRICTIONS = ["׳˜׳‘׳¢׳•׳ ׳™", "׳¦׳׳—׳•׳ ׳™", "׳׳׳ ׳׳§׳˜׳•׳–", "׳׳׳ ׳’׳׳•׳˜׳", "׳׳׳ ׳׳’׳•׳–׳™׳"];
const RESTRICTION_MATCH = {
  "׳˜׳‘׳¢׳•׳ ׳™": "Vegan",
  "׳¦׳׳—׳•׳ ׳™": "Vegetarian",
  "׳׳׳ ׳׳§׳˜׳•׳–": "Lactose-free",
  "׳׳׳ ׳’׳׳•׳˜׳": "Gluten-free",
  "׳׳׳ ׳׳’׳•׳–׳™׳": "Nut-free",
};

const STANDARD_BASKET = [
  { id: "weekly-dairy", label: "׳׳•׳¦׳¨ ׳—׳׳‘ ׳©׳‘׳•׳¢׳™", category: "Dairy", match: ["׳—׳׳׳”", "Sour Cream", "׳©׳׳ ׳×", "Milk"], cadence: "׳›׳ ׳©׳‘׳•׳¢" },
  { id: "pantry-base", label: "׳‘׳¡׳™׳¡ ׳׳–׳•׳•׳”", category: "Pantry", match: ["׳׳•׳¨׳– ׳™׳¡׳׳™׳", "rice", "Pasta"], cadence: "׳₪׳¢׳׳™׳™׳ ׳‘׳—׳•׳“׳©" },
  { id: "healthy-veg", label: "׳™׳¨׳§/׳×׳•׳¡׳₪׳× ׳‘׳¨׳™׳׳”", category: "Produce", match: ["׳©׳¢׳•׳¢׳™׳×", "Tomatoes", "Produce"], cadence: "׳›׳ ׳§׳ ׳™׳™׳”" },
  { id: "snack-control", label: "׳ ׳©׳ ׳•׳© ׳׳‘׳•׳§׳¨", category: "Pantry", match: ["׳‘׳׳‘׳”", "׳׳₪׳¨׳•׳₪׳•", "Popcorn"], cadence: "׳׳₪׳™ ׳¦׳•׳¨׳" },
  { id: "smart-swap", label: "׳—׳׳•׳₪׳× ׳—׳™׳¡׳›׳•׳", category: "Savings", match: ["SmartBrand"], cadence: "׳›׳©׳™׳© ׳”׳¦׳¢׳”" },
];

function createDefaultState(profile) {
  return {
    list: [],
    profile,
  };
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
  return {
    ...parsed,
    list: Array.isArray(parsed.list) ? parsed.list : [],
    profile: {
      ...baseProfile,
      ...parsedProfile,
      email: baseProfile.email,
      role: baseProfile.role,
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
          setAuthError(error.message || "Failed to load your SmartCart account.");
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
    flash(useAlternative ? `׳”׳—׳׳₪׳× ׳×׳§׳¦׳™׳‘ ׳‘׳•׳¦׳¢׳”: ׳ ׳—׳¡׳›׳• ג‚×${savedValue.toFixed(2)}` : "׳”׳׳•׳¦׳¨ ׳”׳׳§׳•׳¨׳™ ׳ ׳•׳¡׳£");
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

  function addHouseholdMember(name, role = "׳©׳•׳×׳£/׳”") {
    if (!name.trim()) return;
    setState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        household: [
          ...current.profile.household,
          { name: name.trim(), role, badge: "׳§׳•׳ ׳” ׳—׳“׳©/׳”" },
        ],
      },
    }));
    setInviteOpen(false);
    flash("׳׳“׳ ׳—׳“׳© ׳ ׳•׳¡׳£ ׳׳׳©׳§ ׳”׳‘׳™׳×");
  }

  function handleReferral(email) {
    if (!email.includes("@") || email.endsWith("@example.com")) {
      flash("׳”׳›׳ ׳™׳¡׳™ ׳›׳×׳•׳‘׳× ׳׳™׳׳™׳™׳ ׳×׳§׳™׳ ׳” ׳׳”׳–׳׳ ׳”");
      return;
    }
    setReferralOpen(false);
    flash(`׳”׳–׳׳ ׳× ׳©׳•׳×׳£ ׳”׳•׳›׳ ׳” ׳¢׳‘׳•׳¨ ${email}`);
  }

  if (authLoading) {
    return <AuthShell title="SmartCart" message="Loading your account..." />;
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
            <small>׳׳¢׳¨׳›׳× ׳§׳ ׳™׳•׳× ׳—׳›׳׳”</small>
          </div>
        </button>

        <nav className="side-nav">
          {[
            ["home", "׳‘׳™׳×", "׳¡׳§׳™׳¨׳” ׳™׳•׳׳™׳×"],
            ["setup", "׳”׳›׳ ׳”", "׳‘׳—׳™׳¨׳× ׳¡׳•׳₪׳¨ ׳•׳×׳§׳¦׳™׳‘"],
            ["scanner", "׳¡׳¨׳™׳§׳”", "׳”׳—׳׳₪׳•׳× ׳‘׳–׳׳ ׳׳׳×"],
            ["list", "׳¨׳©׳™׳׳× ׳§׳ ׳™׳•׳×", "׳×׳§׳¦׳™׳‘ ׳•׳¦'׳§׳׳™׳¡׳˜"],
            ["dashboard", "׳×׳•׳‘׳ ׳•׳×", "׳ ׳™׳×׳•׳— ׳—׳™׳¡׳›׳•׳"],
            ["profile", "׳₪׳¨׳•׳₪׳™׳", "׳”׳¢׳“׳₪׳•׳× ׳”׳‘׳™׳×"],
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
          <span>׳׳¦׳‘ ׳”׳×׳§׳¦׳™׳‘</span>
          <strong>ג‚×{spent.toFixed(0)} / ג‚×{state.profile.budget}</strong>
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
                ׳₪׳×׳—׳™ ׳§׳˜׳׳•׳’
              </button>
            <button className="primary-button" onClick={() => setActiveView("setup")} type="button">
              ׳”׳×׳—׳™׳׳™ ׳¡׳¨׳™׳§׳”
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
      if (!supabase) throw new Error("Supabase is not configured.");
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
      setAuthError(error.message || "Authentication failed.");
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
          <input autoComplete={mode === "signin" ? "current-password" : "new-password"} dir="ltr" minLength={6} placeholder="Password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
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
          <p>׳¡׳¨׳•׳§ ׳‘׳¨׳§׳•׳“</p>
        </div>

        <label className="field-label" htmlFor="simulated-item">׳׳•׳¦׳¨ ׳׳“׳™׳׳•׳™ ׳¡׳¨׳™׳§׳”</label>
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
            {compatible ? "׳×׳•׳׳ ׳׳₪׳¨׳•׳₪׳™׳" : "׳‘׳“׳§׳™ ׳”׳×׳׳׳•׳×"}
          </span>
        </div>

        <div className="price-strip">
          <span>׳׳—׳™׳¨ ׳׳§׳•׳¨׳™</span>
          <strong>ג‚×{product.price.toFixed(2)}</strong>
        </div>
        <small className="price-disclaimer scanner-disclaimer">
          ׳”׳׳—׳™׳¨ ׳׳‘׳•׳¡׳¡ ׳¢׳ ׳‘׳“׳™׳§׳•׳× ׳׳—׳¨׳•׳ ׳•׳× ׳•׳¢׳©׳•׳™ ׳׳”׳©׳×׳ ׳•׳× ׳׳₪׳™ ׳¡׳ ׳™׳£, ׳׳‘׳¦׳¢, ׳–׳׳™׳ ׳•׳× ׳•׳¢׳“׳›׳•׳ ׳™ ׳¡׳₪׳§׳™׳.
        </small>

        {product.alternative && (
          <div className="swap-widget">
            <p className="kicker">׳ ׳¡׳™ ׳׳× ׳–׳” ׳‘׳׳§׳•׳</p>
            <h3>{product.alternative.name}</h3>
            <p>{product.alternative.insight}</p>
            <div className="compare-grid">
              <span>׳‘׳¨׳™׳׳•׳× {product.health} &rarr; {product.alternative.health}</span>
              <span>ג‚×{product.price.toFixed(2)} &rarr; ג‚×{product.alternative.price.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="button-row">
          <button className="ghost-button" onClick={() => onAdd(product, false)} type="button">
            ׳”׳•׳¡׳™׳₪׳™ ׳׳§׳•׳¨׳™
          </button>
          <button
            className="primary-button swap-button"
            disabled={!product.alternative}
            onClick={() => onAdd(product, true)}
            type="button"
          >
            ׳”׳—׳׳₪׳” ׳•׳—׳™׳¡׳›׳•׳
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
          <span className="material-fallback">נ›’</span>
          <h1>SmartCart</h1>
        </div>
        <button className={`home-avatar avatar-bg-${avatarBg || "mint"}`} onClick={() => onNavigate("profile")} type="button">
          {emoji || "נ›’"}
        </button>
      </header>

      <main className="home-content">
        <section className="home-greeting">
          <h2>׳©׳׳•׳ ׳׳׳™</h2>
          <p>׳׳•׳›׳ ׳” ׳׳§׳ ׳™׳™׳” ׳—׳›׳׳” ׳•׳׳•׳“׳¢׳× ׳”׳™׳•׳?</p>
        </section>

        <section className="home-budget-card">
          <div>
            <p>׳×׳§׳¦׳™׳‘ ׳—׳•׳“׳©׳™</p>
            <h3>
              ג‚×{remaining.toFixed(0)}
              <span>׳ ׳•׳×׳¨׳•</span>
            </h3>
            <small>׳ ׳—׳¡׳›׳• ג‚×{saved.toFixed(0)} ׳׳”׳—׳׳₪׳•׳× ׳—׳›׳׳•׳×</small>
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
          <span>נ›’</span>
          ׳”׳×׳—׳™׳׳™ ׳§׳ ׳™׳™׳”
        </button>
        <button className="home-secondary-action" onClick={onCatalog} type="button">
          + ׳₪׳×׳—׳™ ׳§׳˜׳׳•׳’ ׳•׳”׳•׳¡׳™׳₪׳™ ׳׳•׳¦׳¨
        </button>

        <section className="home-quick-grid">
          <button onClick={onCatalog} type="button">
            <span>ן¼‹</span>
            ׳”׳•׳¡׳₪׳× ׳׳•׳¦׳¨
          </button>
          <button onClick={() => onNavigate("scanner")} type="button">
            <span>ג–¦</span>
            ׳¡׳¨׳™׳§׳× ׳‘׳¨׳§׳•׳“
          </button>
          <button onClick={() => onNavigate("list")} type="button">
            <span>ג˜‘</span>
            ׳¦׳₪׳™׳™׳” ׳‘׳¨׳©׳™׳׳•׳×
          </button>
          <button onClick={() => onNavigate("dashboard")} type="button">
            <span>ג—</span>
            ׳×׳•׳‘׳ ׳•׳×
          </button>
        </section>

        <section className="home-tip-card">
          <div className="home-tip-image">נ¥¬</div>
          <div>
            <h4>׳˜׳™׳₪ ׳©׳‘׳•׳¢׳™</h4>
            <p>׳׳¢׳‘׳¨ ׳׳—׳׳•׳₪׳× SmartBrand ׳™׳›׳•׳ ׳׳—׳¡׳•׳ ׳׳ ׳¢׳“ ג‚×15 ׳‘׳§׳ ׳™׳™׳” ׳”׳§׳¨׳•׳‘׳”.</p>
          </div>
          <button onClick={() => onNavigate("dashboard")} type="button">ג€¹</button>
        </section>
      </main>

      <nav className="home-bottom-nav">
        <button className="active" onClick={() => onNavigate("home")} type="button">
          <span>ג‚</span>
          ׳‘׳™׳×
        </button>
        <button onClick={() => onNavigate("dashboard")} type="button">
          <span>ג—«</span>
          ׳“׳©׳‘׳•׳¨׳“
        </button>
        <button className="scan-fab" onClick={() => onNavigate("setup")} type="button">
          <span>ג–¦</span>
          ׳¡׳¨׳™׳§׳”
        </button>
        <button onClick={() => onNavigate("list")} type="button">
          <span>ג˜‘</span>
          ׳¨׳©׳™׳׳•׳×
        </button>
        <button onClick={() => onNavigate("profile")} type="button">
          <span>ג—</span>
          ׳₪׳¨׳•׳₪׳™׳
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
          <h2>׳¨׳©׳™׳׳× ׳§׳ ׳™׳•׳× ׳¡׳˜׳ ׳“׳¨׳˜׳™׳× ׳•׳—׳›׳׳”</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button" onClick={onOpenList} type="button">׳₪׳×׳—׳™ ׳¨׳©׳™׳׳”</button>
          <button className="primary-button" onClick={onOpenInsights} type="button">׳¨׳׳™ ׳×׳•׳‘׳ ׳•׳×</button>
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
        <span>׳§׳˜׳’׳•׳¨׳™׳” ׳׳•׳‘׳™׳׳”: <b>{learning.favoriteCategoryLabel}</b></span>
        <span>׳”׳׳¢׳¨׳›׳× ׳–׳™׳”׳×׳” <b>{learning.swapRate}%</b> ׳ ׳˜׳™׳™׳” ׳׳”׳—׳׳₪׳•׳× ׳—׳™׳¡׳›׳•׳</span>
        <span>׳—׳™׳¡׳›׳•׳ ׳¦׳₪׳•׳™ ׳׳§׳ ׳™׳™׳” ׳”׳‘׳׳”: <b>ג‚×{learning.projectedSavings}</b></span>
      </div>
    </section>
  );
}

function SetupView({ budget, supermarket, onSelectStore, onStart }) {
  const stores = [
    ["׳©׳•׳₪׳¨׳¡׳", "0.4 ׳§׳´׳", "shopping_cart"],
    ["׳¨׳׳™ ׳׳•׳™", "1.2 ׳§׳´׳", "local_mall"],
    ["׳™׳•׳—׳ ׳ ׳•׳£", "1.5 ׳§׳´׳", "shopping_cart"],
    ["׳•׳™׳§׳˜׳•׳¨׳™", "1.8 ׳§׳´׳", "shopping_cart"],
    ["׳§׳¨׳₪׳•׳¨", "2.0 ׳§׳´׳", "shopping_cart"],
    ["׳™׳™׳ ׳•׳× ׳‘׳™׳×׳", "2.3 ׳§׳´׳", "shopping_cart"],
    ["׳׳’׳” ׳‘׳¢׳™׳¨", "2.5 ׳§׳´׳", "shopping_cart"],
    ["׳׳—׳¡׳ ׳™ ׳”׳©׳•׳§", "2.8 ׳§׳´׳", "shopping_cart"],
    ["׳—׳¦׳™ ׳—׳™׳ ׳", "3.0 ׳§׳´׳", "shopping_cart"],
    ["׳׳•׳©׳¨ ׳¢׳“", "3.4 ׳§׳´׳", "shopping_cart"],
    ["׳˜׳™׳‘ ׳˜׳¢׳", "3.6 ׳§׳´׳", "shopping_cart"],
    ["׳§׳©׳× ׳˜׳¢׳׳™׳", "3.9 ׳§׳´׳", "shopping_cart"],
    ["׳₪׳¨׳©׳׳¨׳§׳˜", "4.1 ׳§׳´׳", "shopping_cart"],
    ["׳‘׳¨ ׳›׳", "4.3 ׳§׳´׳", "shopping_cart"],
    ["׳™׳© ׳—׳¡׳“", "4.5 ׳§׳´׳", "shopping_cart"],
    ["AM:PM", "0.7 ׳§׳´׳", "shopping_cart"],
    ["׳¡׳•׳₪׳¨ ׳™׳•׳“׳”", "1.0 ׳§׳´׳", "shopping_cart"],
    ["yellow", "1.6 ׳§׳´׳", "shopping_cart"],
    ["׳¡׳™׳˜׳™ ׳׳¨׳§׳˜", "2.2 ׳§׳´׳", "shopping_cart"],
    ["׳”׳•׳¡׳₪׳× ׳¡׳•׳₪׳¨", "׳׳™׳§׳•׳ ׳™׳“׳ ׳™", "add"],
  ];

  return (
    <section className="setup-page">
      <div className="setup-heading">
        <h2>׳‘׳•׳׳™ ׳ ׳×׳›׳•׳ ׳.</h2>
        <p>׳”׳’׳“׳™׳¨׳™ ׳׳× ׳”׳§׳ ׳™׳™׳” ׳›׳“׳™ ׳©ײ¾SmartCart ׳™׳—׳¡׳•׳ ׳׳ ׳–׳׳ ׳•׳›׳¡׳£.</p>
      </div>

      <div className="setup-grid">
        <article className="setup-card setup-store">
          <div className="setup-card-title">
            <span>נ¬</span>
            <h3>׳‘׳—׳™׳¨׳× ׳¡׳•׳₪׳¨</h3>
          </div>
          <input placeholder="׳—׳™׳₪׳•׳© ׳¡׳•׳₪׳¨..." />
          <div className="store-grid">
            {stores.map(([name, distance, icon]) => (
              <button
                className={name === supermarket ? "store-option selected" : "store-option"}
                key={name}
                onClick={() => icon !== "add" && onSelectStore(name)}
                type="button"
              >
                <span>{icon === "add" ? "+" : "נ›’"}</span>
                <div>
                  <strong>{name}</strong>
                  <small>{distance}</small>
                </div>
                {name === supermarket && <b>ג“</b>}
              </button>
            ))}
          </div>
        </article>

        <div className="setup-side">
          <article className="setup-card">
            <div className="setup-card-title">
              <span>ג‚×</span>
              <h3>׳×׳§׳¦׳™׳‘</h3>
            </div>
            <p>׳׳•׳׳׳¥ ׳׳₪׳™ ג‚×{budget} ׳©׳ ׳•׳×׳¨׳• ׳”׳—׳•׳“׳©.</p>
            <div className="setup-budget-input">
              <strong>ג‚×</strong>
              <input defaultValue="350" type="number" />
            </div>
            <input className="setup-range" defaultValue="35" type="range" />
            <div className="range-labels">
              <span>ג‚×50</span>
              <span>ג‚×1,000</span>
            </div>
          </article>

          <article className="setup-card">
            <div className="setup-card-title">
              <span>ג±</span>
              <h3>׳™׳¢׳“ ׳–׳׳</h3>
            </div>
            <div className="time-options">
              {["15 ׳“׳§׳³", "30 ׳“׳§׳³", "45 ׳“׳§׳³", "60 ׳“׳§׳³"].map((time) => (
                <button className={time === "30 ׳“׳§׳³" ? "selected" : ""} key={time} type="button">
                  {time}
                </button>
              ))}
            </div>
          </article>
        </div>

        <article className="setup-card setup-list-toggle">
          <div>
            <span>ג˜‘</span>
            <div>
              <h3>׳©׳™׳׳•׳© ׳‘׳¨׳©׳™׳׳× ׳§׳ ׳™׳•׳× ׳§׳™׳™׳׳×</h3>
              <p>׳˜׳¢׳™׳ ׳” ׳׳•׳˜׳•׳׳˜׳™׳× ׳©׳ ג€׳§׳ ׳™׳•׳× ׳©׳‘׳•׳¢׳™׳•׳×ג€ ׳¢׳ 12 ׳₪׳¨׳™׳˜׳™׳.</p>
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
          נ›’ ׳”׳×׳—׳™׳׳™ ׳§׳ ׳™׳™׳”
        </button>
        <p>SmartCart ׳×׳¡׳“׳¨ ׳׳ ׳׳¡׳׳•׳ ׳—׳›׳ ׳׳₪׳™ ׳”׳¨׳©׳™׳׳” ׳•׳”׳×׳§׳¦׳™׳‘.</p>
      </div>
    </section>
  );
}

function ShoppingListView({ categoryGroups, spent, saved, budget, progress, warning, onToggle, onRemove, onCatalog }) {
  return (
    <section className="list-layout">
      <div className={warning ? "budget-console glass-panel warning" : "budget-console glass-panel"}>
        <div>
          <p className="kicker">׳×׳§׳¦׳™׳‘ ׳‘׳–׳׳ ׳׳׳×</p>
          <h2>ג‚×{spent.toFixed(2)} ׳ ׳•׳¦׳׳•</h2>
          <span>׳׳×׳•׳ ׳׳’׳‘׳׳” ׳©׳ ג‚×{budget} - ׳ ׳—׳¡׳›׳• ג‚×{saved.toFixed(2)} ׳׳”׳—׳׳₪׳•׳×</span>
        </div>
        <div className="budget-bar">
          <i style={{ width: `${progress}%` }} />
        </div>
        {warning && <strong className="warning-copy">׳׳–׳”׳¨׳”: ׳¢׳‘׳¨׳× 85% ׳׳”׳×׳§׳¦׳™׳‘ ׳©׳”׳•׳’׳“׳¨.</strong>}
      </div>

      <div className="list-toolbar">
        <h2>׳¦'׳§׳׳™׳¡׳˜ ׳§׳ ׳™׳•׳× ׳׳™׳ ׳˜׳¨׳׳§׳˜׳™׳‘׳™</h2>
        <button className="primary-button" onClick={onCatalog} type="button">׳”׳•׳¡׳₪׳” ׳׳”׳§׳˜׳׳•׳’</button>
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
                {item.swapped && <em>׳”׳—׳׳₪׳× ׳×׳§׳¦׳™׳‘ ׳‘׳•׳¦׳¢׳” -ג‚×{item.saved.toFixed(2)}</em>}
                <b>ג‚×{item.selectedPrice.toFixed(2)}</b>
                <button onClick={() => onRemove(item.id)} type="button">׳”׳¡׳¨׳”</button>
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
            <p className="kicker">׳”׳©׳•׳•׳׳” ׳©׳‘׳•׳¢׳™׳× ׳•׳—׳•׳“׳©׳™׳×</p>
            <h2>׳§׳ ׳™׳•׳× ׳׳•׳ ׳—׳™׳¡׳›׳•׳ ׳‘׳₪׳•׳¢׳</h2>
          </div>
          <button className="ghost-button" onClick={onReferral} type="button">׳×׳•׳›׳ ׳™׳× ׳©׳™׳×׳•׳£</button>
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
              <b>ג‚×{trip.purchases}</b>
              <em>׳ ׳—׳¡׳›׳• ג‚×{trip.savings}</em>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function ProfileView({ profile, onUpdate, onToggleRestriction, onInvite }) {
  const faceOptions = ["נ˜", "נ˜", "נ₪“", "נ˜", "נ™‚", "נ˜„", "נ₪©", "נ¥°"];
  const backgroundOptions = [
    ["mint", "׳׳ ׳˜׳”"],
    ["violet", "׳¡׳’׳•׳"],
    ["sky", "׳©׳׳™׳™׳"],
    ["peach", "׳׳₪׳¨׳¡׳§"],
  ];

  return (
    <section className="profile-layout">
      <div className="profile-card glass-panel">
        <div className="avatar-picker">
          <div className={`avatar-orb avatar-bg-${profile.avatarBg || "mint"}`}>{profile.emoji || "נ˜"}</div>
          <div className="avatar-builder">
            <p>׳‘׳—׳™׳¨׳× ׳׳•׳•׳˜׳׳¨</p>
            <div className="emoji-options" aria-label="׳‘׳—׳™׳¨׳× ׳׳•׳•׳˜׳׳¨">
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
            <p>׳¦׳‘׳¢ ׳¨׳§׳¢</p>
            <div className="avatar-bg-options" aria-label="׳‘׳—׳™׳¨׳× ׳¦׳‘׳¢ ׳¨׳§׳¢ ׳׳׳•׳•׳˜׳׳¨">
              {backgroundOptions.map(([value, label]) => (
              <button
                className={profile.avatarBg === value ? `avatar-bg-option avatar-bg-${value} active` : `avatar-bg-option avatar-bg-${value}`}
                key={value}
                onClick={() => onUpdate("avatarBg", value)}
                type="button"
                title={label}
              >
                {profile.emoji || "נ˜"}
              </button>
              ))}
            </div>
          </div>
        </div>
        <div className="profile-form">
          {[
            ["firstName", "׳©׳ ׳₪׳¨׳˜׳™"],
            ["lastName", "׳©׳ ׳׳©׳₪׳—׳”"],
            ["email", "׳׳™׳׳™׳™׳ ׳¨׳׳©׳™"],
            ["address", "׳›׳×׳•׳‘׳×"],
            ["budget", "׳™׳¢׳“ ׳×׳§׳¦׳™׳‘ ׳—׳•׳“׳©׳™"],
            ["supermarket", "׳¡׳•׳₪׳¨ ׳׳•׳¢׳“׳£"],
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
        <h2>׳”׳¢׳“׳₪׳•׳× ׳×׳–׳•׳ ׳”</h2>
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
          <h2>׳׳©׳§ ׳‘׳™׳×</h2>
          <button className="primary-button" onClick={onInvite} type="button">+ ׳”׳•׳¡׳₪׳× ׳׳“׳</button>
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
      upc: "׳™׳“׳ ׳™",
      name,
      brand: "׳׳•׳¦׳¨ ׳©׳”׳•׳¡׳£ ׳™׳“׳ ׳™׳×",
      category: manualCategory,
      price,
      health: "B",
      dietary: ["Vegetarian"],
      image: produceImage("נ›’"),
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
            <p className="kicker">׳§׳˜׳׳•׳’ ׳”׳¡׳•׳₪׳¨</p>
            <h2>׳—׳™׳₪׳•׳© ׳•׳”׳•׳¡׳₪׳× ׳׳•׳¦׳¨׳™׳</h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button">X</button>
        </div>
        <input placeholder="׳—׳™׳₪׳•׳© ׳‘׳§׳˜׳׳•׳’" value={query} onChange={(event) => setQuery(event.target.value)} />
        <div className="tag-selector">
          {categories.map(([tag, label]) => (
            <button className={category === tag ? "tag active" : "tag"} key={tag} onClick={() => setCategory(tag)} type="button">
              {label}
            </button>
          ))}
        </div>
        <div className="manual-product-form">
          <div>
            <p className="kicker">׳”׳•׳¡׳₪׳” ׳™׳“׳ ׳™׳×</p>
            <h3>׳׳•׳¦׳¨ ׳©׳׳ ׳§׳™׳™׳ ׳‘׳§׳˜׳׳•׳’</h3>
          </div>
          <input placeholder="׳©׳ ׳׳•׳¦׳¨" value={manualName} onChange={(event) => setManualName(event.target.value)} />
          <div className="manual-product-row">
            <input min="0" placeholder="׳׳—׳™׳¨" step="0.1" type="number" value={manualPrice} onChange={(event) => setManualPrice(event.target.value)} />
            <select value={manualCategory} onChange={(event) => setManualCategory(event.target.value)}>
              {categoryOptions.map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <button className="primary-button" disabled={!manualName.trim() || Number(manualPrice) <= 0} onClick={addManualProduct} type="button">
            ׳”׳•׳¡׳₪׳× ׳׳•׳¦׳¨ ׳—׳“׳©
          </button>
          <small className="price-disclaimer">
            ׳”׳׳—׳™׳¨ ׳©׳׳•׳₪׳™׳¢ ׳‘׳׳×׳¨ ׳׳‘׳•׳¡׳¡ ׳¢׳ ׳‘׳“׳™׳§׳•׳× ׳׳—׳¨׳•׳ ׳•׳× ׳•׳¢׳©׳•׳™ ׳׳”׳™׳•׳× ׳©׳•׳ ׳” ׳׳”׳׳—׳™׳¨ ׳”׳׳׳™׳×׳™ ׳‘׳©׳•׳§ ׳‘׳’׳׳ ׳׳‘׳¦׳¢׳™׳, ׳¡׳ ׳™׳₪׳™׳, ׳–׳׳™׳ ׳•׳×, ׳¢׳“׳›׳•׳ ׳™ ׳¡׳₪׳§׳™׳ ׳•׳¡׳™׳‘׳•׳× ׳ ׳•׳¡׳₪׳•׳×.
          </small>
        </div>
        <div className="drawer-list">
          {filtered.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.name}</strong>
              <span>{CATEGORY_LABELS[item.category] || item.category} - ג‚×{item.price.toFixed(2)}</span>
              </div>
              <button onClick={() => onAdd(item, false)} type="button">׳”׳•׳¡׳₪׳”</button>
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
                <h2>׳—׳©׳‘׳•׳ ׳™׳× {receipt.store}</h2>
              </div>
              <button className="icon-button" onClick={onClose} type="button">X</button>
            </div>
            {receipt.items.map(([name, price, discount]) => (
              <article className="receipt-line" key={name}>
                <span>{name}</span>
                <b>ג‚×{price.toFixed(2)}</b>
                <em>-ג‚×{discount.toFixed(2)}</em>
              </article>
            ))}
            <div className="receipt-score">
              <strong>{Math.round((receipt.savings / receipt.purchases) * 100)}%</strong>
              <span>׳¦׳™׳•׳ ׳—׳™׳¡׳›׳•׳</span>
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
        <p className="kicker">׳©׳™׳×׳•׳£ ׳—׳›׳</p>
        <h2>׳”׳–׳׳ ׳× ׳©׳•׳×׳£/׳” ׳׳§׳ ׳™׳•׳×</h2>
        <p>׳”׳›׳ ׳™׳¡׳™ ׳׳™׳׳™׳™׳ ׳׳׳™׳ ׳›׳“׳™ ׳׳₪׳×׳•׳— ׳×׳•׳‘׳ ׳•׳× ׳—׳©׳‘׳•׳ ׳™׳× ׳׳©׳•׳×׳₪׳•׳×.</p>
        <input placeholder="family@domain.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        <button className="primary-button" onClick={() => onSubmit(email)} type="button">׳©׳׳™׳—׳× ׳”׳–׳׳ ׳”</button>
      </div>
    </div>
  );
}

function InviteModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("׳©׳•׳×׳£/׳”");
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-card glass-panel">
        <button className="icon-button" onClick={onClose} type="button">X</button>
        <p className="kicker">׳׳©׳§ ׳‘׳™׳× ׳׳©׳•׳×׳£</p>
        <h2>׳”׳•׳¡׳₪׳× ׳׳“׳</h2>
        <input placeholder="׳©׳ ׳׳׳" value={name} onChange={(event) => setName(event.target.value)} />
        <select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="׳©׳•׳×׳£/׳”">׳©׳•׳×׳£/׳”</option>
          <option value="׳׳ ׳”׳/׳×">׳׳ ׳”׳/׳×</option>
          <option value="׳§׳•׳ ׳” ׳§׳‘׳•׳¢/׳”">׳§׳•׳ ׳” ׳§׳‘׳•׳¢/׳”</option>
          <option value="׳™׳׳“/׳”">׳™׳׳“/׳”</option>
        </select>
        <button className="primary-button" onClick={() => onSubmit(name, role)} type="button">׳”׳•׳¡׳₪׳” ׳׳׳©׳§ ׳”׳‘׳™׳×</button>
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
      text: "׳”׳™׳™, ׳׳ ׳™ ׳”׳¢׳•׳–׳¨ ׳©׳ SmartCart. ׳׳₪׳©׳¨ ׳׳©׳׳•׳ ׳׳•׳×׳™ ׳׳™׳ ׳׳×׳—׳™׳׳™׳ ׳§׳ ׳™׳™׳”, ׳׳™׳ ׳׳•׳¡׳™׳₪׳™׳ ׳׳•׳¦׳¨, ׳׳™׳ ׳׳©׳×׳׳©׳™׳ ׳‘׳¡׳•׳¨׳§, ׳׳™׳₪׳” ׳¨׳•׳׳™׳ ׳×׳§׳¦׳™׳‘ ׳׳• ׳׳™׳ ׳׳©׳ ׳™׳ ׳₪׳¨׳•׳₪׳™׳.",
    },
  ]);

  const quickActions = [
    ["׳׳™׳ ׳׳×׳—׳™׳׳™׳?", "setup"],
    ["׳׳™׳ ׳׳•׳¡׳™׳₪׳™׳ ׳׳•׳¦׳¨?", "list"],
    ["׳׳™׳ ׳¡׳•׳¨׳§׳™׳?", "scanner"],
    ["׳׳” ׳–׳” ׳”׳×׳•׳‘׳ ׳•׳× ׳•׳׳׳” ׳”׳ ׳׳©׳׳©׳•׳×?", "dashboard"],
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
        <section className="guide-panel glass-panel" aria-label="׳¢׳•׳–׳¨ SmartCart">
          <div className="guide-head">
            <div>
              <strong>׳¢׳•׳–׳¨ SmartCart</strong>
              <small>׳”׳“׳¨׳›׳” ׳•׳©׳׳׳•׳× ׳׳׳©׳×׳׳©׳™׳ ׳—׳“׳©׳™׳</small>
            </div>
            <span className="ai-badge">׳׳‘׳•׳¡׳¡ AI</span>
            <button className="icon-button" onClick={onToggle} type="button">X</button>
          </div>
          <small className="assistant-note">
            ׳”׳¢׳•׳–׳¨ ׳™׳›׳•׳ ׳׳˜׳¢׳•׳×. ׳׳•׳׳׳¥ ׳׳‘׳“׳•׳§ ׳׳—׳™׳¨׳™׳, ׳׳‘׳¦׳¢׳™׳ ׳•׳׳™׳“׳¢ ׳×׳–׳•׳ ׳×׳™ ׳׳•׳ ׳”׳¡׳•׳₪׳¨ ׳•׳”׳׳•׳¦׳¨ ׳‘׳₪׳•׳¢׳.
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
                ׳—׳•׳©׳‘ ׳¨׳’׳¢...
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
              placeholder="׳©׳׳׳™ ׳׳•׳×׳™ ׳׳©׳”׳•..."
              disabled={thinking}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
            <button disabled={thinking} type="submit">{thinking ? "׳—׳•׳©׳‘..." : "׳©׳׳™׳—׳”"}</button>
          </form>
        </section>
      )}

      <button className="guide-fab" onClick={onToggle} type="button" aria-label="׳₪׳×׳™׳—׳× ׳¢׳•׳–׳¨ SmartCart">
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
  if (text.includes("׳©׳׳•׳") || text.includes("׳”׳™׳™") || text.includes("׳”׳™ ") || text.includes("׳‘׳•׳§׳¨ ׳˜׳•׳‘") || text.includes("׳¢׳¨׳‘ ׳˜׳•׳‘")) {
    return {
      view: null,
      text: "׳”׳™׳™ ׳׳׳™, ׳׳™׳–׳” ׳›׳™׳£ ׳©׳׳× ׳›׳׳. ׳׳ ׳™ ׳”׳¢׳•׳–׳¨ ׳©׳ SmartCart ׳•׳׳₪׳©׳¨ ׳׳©׳׳•׳ ׳׳•׳×׳™ ׳’׳ ׳¢׳ ׳”׳׳×׳¨ ׳•׳’׳ ׳¡׳×׳ ׳׳™׳ ׳׳”׳×׳—׳™׳ ׳׳”׳©׳×׳׳© ׳‘׳•.",
    };
  }
  if (text.includes("׳׳” ׳§׳•׳¨׳”") || text.includes("׳׳” ׳ ׳©׳׳¢") || text.includes("׳׳” ׳©׳׳•׳׳") || text.includes("׳׳™׳ ׳׳×׳”") || text.includes("׳׳™׳ ׳׳×")) {
    return {
      view: null,
      text: "׳”׳›׳•׳ ׳˜׳•׳‘, ׳×׳•׳“׳” ׳©׳©׳׳׳×. ׳׳ ׳™ ׳›׳׳ ׳›׳“׳™ ׳׳¢׳–׳•׳¨ ׳׳ ׳׳¢׳©׳•׳× ׳§׳ ׳™׳™׳” ׳—׳›׳׳” ׳™׳•׳×׳¨, ׳׳׳¦׳•׳ ׳׳•׳¦׳¨׳™׳, ׳׳”׳‘׳™׳ ׳×׳•׳‘׳ ׳•׳× ׳•׳׳©׳׳•׳¨ ׳¢׳ ׳”׳×׳§׳¦׳™׳‘.",
    };
  }
  if (text.includes("׳×׳•׳“׳”") || text.includes("׳×׳•׳“׳” ׳¨׳‘׳”") || text.includes("׳׳׳•׳₪׳”") || text.includes("׳׳¢׳•׳׳”")) {
    return {
      view: null,
      text: "׳‘׳©׳׳—׳”. ׳׳ ׳™ ׳ ׳©׳׳¨ ׳›׳׳ ׳׳ ׳×׳¨׳¦׳™ ׳¢׳•׳“ ׳¢׳–׳¨׳”, ׳”׳¡׳‘׳¨ ׳¢׳ ׳׳¡׳ ׳׳¡׳•׳™׳ ׳׳• ׳”׳›׳•׳•׳ ׳” ׳‘׳§׳ ׳™׳™׳”.",
    };
  }
  if (text.includes("׳׳™ ׳׳×׳”") || text.includes("׳׳™ ׳׳×") || text.includes("׳׳” ׳׳×׳”") || text.includes("׳׳” ׳׳×")) {
    return {
      view: null,
      text: "׳׳ ׳™ ׳¢׳•׳–׳¨ ׳”׳”׳“׳¨׳›׳” ׳©׳ SmartCart. ׳׳ ׳™ ׳׳¡׳‘׳™׳¨ ׳׳™׳ ׳׳”׳©׳×׳׳© ׳‘׳׳×׳¨, ׳¢׳•׳–׳¨ ׳׳׳¦׳•׳ ׳₪׳¢׳•׳׳•׳×, ׳•׳׳›׳•׳•׳ ׳׳•׳×׳ ׳׳׳¡׳ ׳”׳ ׳›׳•׳ ׳׳₪׳™ ׳”׳©׳׳׳”.",
    };
  }
  if (text.includes("׳׳” ׳׳₪׳©׳¨ ׳׳©׳׳•׳") || text.includes("׳׳” ׳׳×׳” ׳™׳•׳“׳¢") || text.includes("׳¢׳–׳¨׳”") || text.includes("help")) {
    return {
      view: null,
      text: "׳׳₪׳©׳¨ ׳׳©׳׳•׳ ׳׳•׳×׳™ ׳¢׳ ׳”׳×׳—׳׳× ׳§׳ ׳™׳™׳”, ׳‘׳—׳™׳¨׳× ׳¡׳•׳₪׳¨, ׳¡׳¨׳™׳§׳× ׳׳•׳¦׳¨, ׳”׳•׳¡׳₪׳× ׳׳•׳¦׳¨ ׳™׳“׳ ׳™׳×, ׳×׳§׳¦׳™׳‘, ׳¨׳©׳™׳׳× ׳§׳ ׳™׳•׳×, ׳×׳•׳‘׳ ׳•׳×, ׳₪׳¨׳•׳₪׳™׳, ׳׳•׳•׳˜׳׳¨ ׳•׳׳©׳§ ׳‘׳™׳×.",
    };
  }
  if (text.includes("׳׳׳”") && text.includes("smartcart")) {
    return {
      view: null,
      text: "SmartCart ׳ ׳•׳¢׳“׳” ׳׳¢׳–׳•׳¨ ׳׳ ׳׳§׳ ׳•׳× ׳‘׳¦׳•׳¨׳” ׳׳•׳“׳¢׳×: ׳׳”׳‘׳™׳ ׳›׳׳” ׳׳× ׳׳•׳¦׳™׳׳”, ׳׳‘׳—׳•׳¨ ׳—׳׳•׳₪׳•׳× ׳׳©׳×׳׳׳•׳×, ׳•׳׳‘׳ ׳•׳× ׳¨׳©׳™׳׳× ׳§׳ ׳™׳•׳× ׳©׳׳×׳׳™׳׳” ׳׳”׳¨׳’׳׳™׳ ׳©׳ ׳”׳‘׳™׳×.",
    };
  }
  if (text.includes("׳”׳×׳—") || text.includes("׳§׳ ׳™׳™׳”") || text.includes("׳¡׳•׳₪׳¨")) {
    return {
      view: "setup",
      text: "׳›׳“׳™ ׳׳”׳×׳—׳™׳ ׳§׳ ׳™׳™׳” ׳׳•׳—׳¦׳™׳ ׳¢׳ '׳”׳×׳—׳™׳׳™ ׳§׳ ׳™׳™׳”', ׳‘׳•׳—׳¨׳™׳ ׳¡׳•׳₪׳¨, ׳׳’׳“׳™׳¨׳™׳ ׳×׳§׳¦׳™׳‘ ׳•׳–׳׳, ׳•׳׳– ׳׳׳©׳™׳›׳™׳ ׳׳¡׳¨׳™׳§׳”.",
    };
  }
  if (text.includes("׳¡׳¨׳™׳§") || text.includes("׳‘׳¨׳§׳•׳“") || text.includes("׳׳•׳¦׳¨ ׳׳“׳™׳׳•׳™")) {
    return {
      view: "scanner",
      text: "׳‘׳¢׳׳•׳“ ׳¡׳¨׳™׳§׳” ׳‘׳•׳—׳¨׳™׳ ׳׳•׳¦׳¨ ׳׳”׳¨׳©׳™׳׳” ׳”׳׳“׳•׳׳”. ׳׳™׳“ ׳¨׳•׳׳™׳ ׳׳—׳™׳¨, ׳“׳™׳¨׳•׳’ ׳‘׳¨׳™׳׳•׳×, ׳”׳×׳׳׳” ׳׳₪׳¨׳•׳₪׳™׳ ׳•׳”׳¦׳¢׳× ׳”׳—׳׳₪׳” ׳׳ ׳§׳™׳™׳׳×.",
    };
  }
  if (text.includes("׳§׳˜׳׳•׳’") || text.includes("׳׳”׳•׳¡׳™׳£ ׳׳•׳¦׳¨") || text.includes("׳”׳•׳¡׳₪׳”") || text.includes("׳׳•׳¦׳¨ ׳—׳“׳©")) {
    return {
      view: "list",
      text: "׳›׳“׳™ ׳׳”׳•׳¡׳™׳£ ׳׳•׳¦׳¨ ׳₪׳•׳×׳—׳™׳ ׳§׳˜׳׳•׳’, ׳׳—׳₪׳©׳™׳ ׳׳•׳¦׳¨ ׳•׳׳•׳—׳¦׳™׳ '׳”׳•׳¡׳₪׳”'. ׳׳ ׳”׳׳•׳¦׳¨ ׳׳ ׳§׳™׳™׳, ׳™׳© ׳׳–׳•׳¨ '׳”׳•׳¡׳₪׳” ׳™׳“׳ ׳™׳×' ׳©׳‘׳• ׳׳›׳ ׳™׳¡׳™׳ ׳©׳, ׳׳—׳™׳¨ ׳•׳§׳˜׳’׳•׳¨׳™׳”.",
    };
  }
  if (text.includes("׳×׳§׳¦׳™׳‘") || text.includes("׳׳—׳™׳¨") || text.includes("׳—׳¨׳™׳’׳”") || text.includes("׳ ׳©׳׳¨")) {
    return {
      view: "list",
      text: "׳”׳×׳§׳¦׳™׳‘ ׳׳•׳₪׳™׳¢ ׳‘׳¡׳¨׳’׳ ׳”׳¦׳“ ׳•׳‘׳¨׳©׳™׳׳× ׳”׳§׳ ׳™׳•׳×. ׳׳ ׳”׳§׳ ׳™׳™׳” ׳׳×׳§׳¨׳‘׳× ׳-85% ׳׳”׳×׳§׳¦׳™׳‘, ׳”׳׳¢׳¨׳›׳× ׳׳¡׳׳ ׳× ׳׳–׳”׳¨׳” ׳•׳׳“׳’׳™׳©׳” ׳׳× ׳׳¦׳‘ ׳”׳×׳§׳¦׳™׳‘.",
    };
  }
  if (text.includes("׳¨׳©׳™׳׳”") || text.includes("׳¦׳³׳§") || text.includes("׳¡׳™׳׳•׳")) {
    return {
      view: "list",
      text: "׳‘׳¨׳©׳™׳׳× ׳”׳§׳ ׳™׳•׳× ׳׳₪׳©׳¨ ׳׳¡׳׳ ׳׳•׳¦׳¨׳™׳ ׳©׳ ׳§׳ ׳•, ׳׳׳—׳•׳§ ׳׳•׳¦׳¨׳™׳, ׳׳¨׳׳•׳× ׳§׳˜׳’׳•׳¨׳™׳•׳× ׳•׳׳‘׳“׳•׳§ ׳›׳׳” ׳ ׳©׳׳¨ ׳‘׳×׳§׳¦׳™׳‘.",
    };
  }
  if (text.includes("׳×׳•׳‘׳ ׳•׳×") || text.includes("׳—׳™׳¡׳›׳•׳") || text.includes("׳’׳¨׳£") || text.includes("׳§׳‘׳׳”")) {
    return {
      view: "dashboard",
      text: "׳”׳×׳•׳‘׳ ׳•׳× ׳”׳ ׳׳–׳•׳¨ ׳©׳׳ ׳×׳— ׳׳× ׳”׳§׳ ׳™׳•׳× ׳©׳׳: ׳›׳׳” ׳”׳•׳¦׳׳×, ׳›׳׳” ׳—׳¡׳›׳×, ׳׳™׳׳• ׳”׳—׳׳₪׳•׳× ׳׳©׳×׳׳׳•׳× ׳¢׳©׳™׳× ׳•׳׳” ׳׳₪׳©׳¨ ׳׳©׳₪׳¨ ׳‘׳§׳ ׳™׳™׳” ׳”׳‘׳׳”. ׳”׳ ׳¢׳•׳–׳¨׳•׳× ׳׳”׳‘׳™׳ ׳׳× ׳”׳¨׳’׳׳™ ׳”׳§׳ ׳™׳™׳” ׳•׳׳©׳׳•׳˜ ׳˜׳•׳‘ ׳™׳•׳×׳¨ ׳‘׳×׳§׳¦׳™׳‘.",
    };
  }
  if (text.includes("׳₪׳¨׳•׳₪׳™׳") || text.includes("׳׳•׳•׳˜׳׳¨") || text.includes("׳×׳–׳•׳ ׳”") || text.includes("׳׳©׳§ ׳‘׳™׳×")) {
    return {
      view: "profile",
      text: "׳‘׳₪׳¨׳•׳₪׳™׳ ׳׳₪׳©׳¨ ׳׳¢׳¨׳•׳ ׳©׳, ׳׳™׳׳™׳™׳, ׳›׳×׳•׳‘׳×, ׳×׳§׳¦׳™׳‘, ׳¡׳•׳₪׳¨ ׳׳•׳¢׳“׳£, ׳׳‘׳—׳•׳¨ ׳׳•׳•׳˜׳׳¨, ׳׳”׳’׳“׳™׳¨ ׳”׳¢׳“׳₪׳•׳× ׳×׳–׳•׳ ׳” ׳•׳׳”׳•׳¡׳™׳£ ׳׳ ׳©׳™׳ ׳׳׳©׳§ ׳”׳‘׳™׳×.",
    };
  }
  if (text.includes("׳”׳—׳׳₪׳”") || text.includes("swap") || text.includes("׳‘׳¨׳™׳") || text.includes("׳–׳•׳")) {
    return {
      view: "scanner",
      text: "׳›׳׳©׳¨ ׳׳׳•׳¦׳¨ ׳™׳© ׳—׳׳•׳₪׳”, SmartCart ׳׳¦׳™׳’׳” ׳›׳¨׳˜׳™׳¡ '׳ ׳¡׳™ ׳׳× ׳–׳” ׳‘׳׳§׳•׳' ׳¢׳ ׳׳—׳™׳¨ ׳—׳“׳©, ׳“׳™׳¨׳•׳’ ׳‘׳¨׳™׳׳•׳× ׳•׳—׳™׳¡׳›׳•׳ ׳¦׳₪׳•׳™. ׳׳₪׳©׳¨ ׳׳‘׳—׳•׳¨ '׳”׳—׳׳₪׳” ׳•׳—׳™׳¡׳›׳•׳'.",
    };
  }
  return {
    view: null,
    text: "׳׳₪׳©׳¨ ׳׳©׳׳•׳ ׳׳•׳×׳™ ׳¢׳ ׳”׳×׳—׳׳× ׳§׳ ׳™׳™׳”, ׳¡׳¨׳™׳§׳”, ׳§׳˜׳׳•׳’, ׳”׳•׳¡׳₪׳× ׳׳•׳¦׳¨, ׳×׳§׳¦׳™׳‘, ׳¨׳©׳™׳׳× ׳§׳ ׳™׳•׳×, ׳×׳•׳‘׳ ׳•׳× ׳׳• ׳₪׳¨׳•׳₪׳™׳. ׳׳׳©׳: '׳׳™׳ ׳׳•׳¡׳™׳₪׳™׳ ׳׳•׳¦׳¨ ׳—׳“׳©?'",
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
      return "׳‘׳™׳×";
    case "list":
      return "׳¨׳©׳™׳׳× ׳§׳ ׳™׳•׳×";
    case "dashboard":
      return "׳×׳•׳‘׳ ׳•׳× ׳—׳™׳¡׳›׳•׳";
    case "profile":
      return "׳₪׳¨׳•׳₪׳™׳ ׳—׳›׳";
    default:
      return "׳¡׳¨׳™׳§׳”";
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
        ? `׳ ׳׳׳“ ׳׳×׳•׳ ${matches.length} ׳₪׳¨׳™׳˜/׳™׳ ׳‘׳§׳ ׳™׳•׳× ׳”׳׳—׳¨׳•׳ ׳•׳×`
        : `׳”׳׳׳¦׳” ׳‘׳¡׳™׳¡׳™׳× ׳׳₪׳™ ׳¡׳ ${template.cadence}`,
      status: learned ? "׳ ׳׳׳“ ׳׳”׳¨׳’׳׳™׳" : "׳׳•׳׳׳¥ ׳׳”׳•׳¡׳™׳£",
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
        label: "׳׳׳™׳“׳× ׳¡׳",
        value: `${standardBasket.filter((item) => item.learned).length}/${STANDARD_BASKET.length}`,
        detail: "׳§׳˜׳’׳•׳¨׳™׳•׳× ׳׳”׳¨׳©׳™׳׳” ׳”׳¡׳˜׳ ׳“׳¨׳˜׳™׳× ׳©׳›׳‘׳¨ ׳–׳•׳”׳• ׳׳¦׳ ׳׳׳™",
      },
      {
        label: "׳§׳˜׳’׳•׳¨׳™׳” ׳—׳•׳–׳¨׳×",
        value: favoriteCategoryLabel,
        detail: "׳”׳§׳˜׳’׳•׳¨׳™׳” ׳©׳׳•׳₪׳™׳¢׳” ׳”׳›׳™ ׳”׳¨׳‘׳” ׳‘׳§׳ ׳™׳•׳× ׳”׳ ׳•׳›׳—׳™׳•׳×",
      },
      {
        label: "׳ ׳˜׳™׳™׳× ׳—׳™׳¡׳›׳•׳",
        value: `${swapRate}%`,
        detail: "׳©׳™׳¢׳•׳¨ ׳”׳₪׳¨׳™׳˜׳™׳ ׳©׳‘׳”׳ ׳׳׳™ ׳‘׳—׳¨׳” ׳”׳—׳׳₪׳× ׳×׳§׳¦׳™׳‘",
      },
      {
        label: "׳׳—׳¥ ׳×׳§׳¦׳™׳‘׳™",
        value: `${budgetShare}%`,
        detail: "׳›׳׳” ׳׳”׳×׳§׳¦׳™׳‘ ׳”׳—׳•׳“׳©׳™ ׳›׳‘׳¨ ׳׳ ׳•׳¦׳ ׳‘׳¨׳©׳™׳׳”",
      },
    ],
  };
}

export default App;

import { useEffect, useRef, useState, useCallback } from "react";
import { useRecipeStore } from "./store/useRecipeStore";
import { recipes, ingredientsData } from "./data";
import { recipeIcons, recipePhotos, formatRp } from "./helpers";
import { t } from "./i18n";
import { roundPrice } from "./helpers";

// ─── COLORS for chart ────────────────────────────────────────────────────────
const CHART_COLORS = [
  "#c8783a",
  "#e09050",
  "#f5b87a",
  "#8b4513",
  "#d4956a",
  "#b8860b",
  "#cd853f",
  "#deb887",
  "#f4a460",
  "#a0522d",
];

// ─── PDF EXPORT ───────────────────────────────────────────────────────────────
function exportPDF(
  recipe,
  portion,
  ingredients,
  totalCost,
  totalCalories,
  businessStats,
  lang,
) {
  const {
    costPerJar,
    revenue,
    profit,
    margin,
    jarCount,
    jarSize,
    packagingCost,
    totalPackagingCost,
  } = businessStats;
  const label = t(lang, recipe);
  const date = new Date().toLocaleDateString(lang === "id" ? "id-ID" : "en-GB");
  const rows = ingredients
    .map(
      (item) =>
        `<tr><td>${t(lang, item.name)}</td>
     <td style="text-align:right">${item.amount.toLocaleString("id-ID")}g</td>
     <td style="text-align:right;color:#c8783a;font-weight:700">${formatRp(item.cost)}</td></tr>`,
    )
    .join("");
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>${label} - ${t(lang, "appTitle")}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;600;700&display=swap');
  body{font-family:'Nunito',sans-serif;color:#3d2b1f;padding:40px;max-width:600px;margin:0 auto}
  h1{font-family:'Playfair Display',serif;color:#c8783a;font-size:28px;margin-bottom:4px}
  .sub{color:#9a7860;font-size:13px;margin-bottom:24px}
  .section{margin-bottom:24px}
  .section-title{font-family:'Playfair Display',serif;color:#8b4513;font-size:16px;border-bottom:2px solid #f0dfc8;padding-bottom:6px;margin-bottom:12px}
  table{width:100%;border-collapse:collapse}
  th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#9a7860;padding:6px 8px;border-bottom:2px solid #f0dfc8}
  td{padding:9px 8px;font-size:13px;border-bottom:1px solid #f0dfc8}
  .total-row td{font-weight:700;font-size:15px;border-top:2px dashed #f0dfc8;border-bottom:none;padding-top:12px}
  .total-row td:last-child{color:#c8783a;font-size:18px}
  .biz-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .biz-card{background:#fff8f2;border:1.5px solid #f0dfc8;border-radius:10px;padding:12px}
  .biz-label{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#9a7860;font-weight:700}
  .biz-val{font-size:18px;font-weight:700;margin-top:3px}
  .green{color:#27ae60}.red{color:#e74c3c}
  .footer{margin-top:32px;text-align:center;font-size:12px;color:#9a7860}
</style></head><body>
  <h1>🧁 ${label}</h1>
  <div class="sub">${t(lang, "appTitle")} — ${date} — ${portion}x ${t(lang, "shareBatch")}</div>
  <div class="section"><div class="section-title">🧂 ${t(lang, "ingredients")}</div>
    <table><thead><tr><th>${t(lang, "ingredient")}</th><th style="text-align:right">${t(lang, "grams")}</th><th style="text-align:right">${t(lang, "price")}</th></tr></thead>
    <tbody>${rows}
      <tr class="total-row"><td colspan="2">${t(lang, "totalCost")}</td><td style="text-align:right">${formatRp(totalCost)}</td></tr>
      <tr><td colspan="2" style="color:#9a7860;font-size:13px">${t(lang, "totalCalories")}</td><td style="text-align:right;color:#9a7860;font-size:13px">${Math.round(totalCalories).toLocaleString("id-ID")} kcal</td></tr>
    </tbody></table></div>
  <div class="section"><div class="section-title">📊 ${t(lang, "businessAnalysis")}</div>
    <div class="biz-grid">
      <div class="biz-card"><div class="biz-label">${t(lang, "totalJars")}</div><div class="biz-val">${jarCount} ${t(lang, "jar")}</div></div>
      <div class="biz-card"><div class="biz-label">${t(lang, "jarSize")}</div><div class="biz-val">${jarSize}g</div></div>
      <div class="biz-card"><div class="biz-label">${t(lang, "packagingCost")}</div><div class="biz-val">${formatRp(packagingCost)}</div></div>
      <div class="biz-card"><div class="biz-label">${t(lang, "totalPackagingCost")}</div><div class="biz-val">${formatRp(totalPackagingCost)}</div></div>
      <div class="biz-card"><div class="biz-label">${t(lang, "cogsPerPcs")}</div><div class="biz-val">${formatRp(costPerJar)}</div></div>
      <div class="biz-card"><div class="biz-label">${t(lang, "totalRevenue")}</div><div class="biz-val">${formatRp(revenue)}</div></div>
      <div class="biz-card"><div class="biz-label">${t(lang, "profitLoss")}</div><div class="biz-val ${profit >= 0 ? "green" : "red"}">${profit >= 0 ? "+" : ""}${formatRp(profit)}</div></div>
      <div class="biz-card"><div class="biz-label">${t(lang, "margin")}</div><div class="biz-val ${margin >= 0 ? "green" : "red"}">${margin.toFixed(1)}%</div></div>
    </div></div>
  <div class="footer">${t(lang, "shareGenerated")} 🍪</div>
</body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${recipe}-${date.replace(/\//g, "-")}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── SHARE ────────────────────────────────────────────────────────────────────
function buildSummaryText(
  recipe,
  portion,
  ingredients,
  totalCost,
  totalCalories,
  businessStats,
  lang,
) {
  const {
    costPerJar,
    revenue,
    profit,
    margin,
    jarCount,
    jarSize,
    packagingCost,
    totalPackagingCost,
    totalCostWithPackaging,
  } = businessStats;
  const label = t(lang, recipe);
  const date = new Date().toLocaleDateString(lang === "id" ? "id-ID" : "en-GB");
  const ingLines = ingredients
    .map(
      (item) =>
        `  • ${t(lang, item.name)}: ${item.amount.toLocaleString("id-ID")}g — ${formatRp(item.cost)}`,
    )
    .join("\n");
  return [
    `🧁 *${t(lang, "appTitle")} — ${label}*`,
    `📅 ${date} | 🔢 ${portion}x ${t(lang, "shareBatch")}`,
    ``,
    `🧂 *${t(lang, "shareIngredients")}:*`,
    ingLines,
    ``,
    `💰 *${t(lang, "totalCost")}:* ${formatRp(totalCost)}`,
    `🔥 *${t(lang, "totalCalories")}:* ${Math.round(totalCalories).toLocaleString("id-ID")} kcal`,
    ``,
    `📊 *${t(lang, "shareBusiness")}:*`,
    `  • ${t(lang, "totalJars")}: ${jarCount} ${t(lang, "jar")}`,
    `  • ${t(lang, "jarSize")}: ${jarSize}g`,
    `  • ${t(lang, "packagingCost")}: ${formatRp(packagingCost)}`,
    `  • ${t(lang, "totalPackagingCost")}: ${formatRp(totalPackagingCost)}`,
    `  • ${t(lang, "cogsPerPcs")}: ${formatRp(costPerJar)}`,
    `  • ${t(lang, "totalHpp")}: ${formatRp(totalCostWithPackaging)}`,
    `  • ${t(lang, "totalRevenue")}: ${formatRp(revenue)}`,
    `  • ${t(lang, "profitLoss")}: ${profit >= 0 ? "+" : ""}${formatRp(profit)}`,
    `  • ${t(lang, "margin")}: ${margin.toFixed(1)}%`,
    ``,
    `_${t(lang, "shareGenerated")}_ 🍪`,
  ].join("\n");
}
function ShareButton({
  recipe,
  portion,
  ingredients,
  totalCost,
  totalCalories,
  businessStats,
  lang,
}) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const text = buildSummaryText(
    recipe,
    portion,
    ingredients,
    totalCost,
    totalCalories,
    businessStats,
    lang,
  );
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setShowMenu(false);
    setTimeout(() => setCopied(false), 2500);
  };
  const handleWA = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    setShowMenu(false);
  };
  return (
    <div className="share-wrap">
      <button
        className={`share-btn${copied ? " copied" : ""}`}
        onClick={() => setShowMenu((v) => !v)}
      >
        {copied ? `✅ ${t(lang, "copied")}` : `📤 ${t(lang, "share")}`}
      </button>
      {showMenu && (
        <div className="share-menu">
          <button className="share-option" onClick={handleCopy}>
            📋 {t(lang, "copyClipboard")}
          </button>
          <button className="share-option whatsapp" onClick={handleWA}>
            💬 {t(lang, "sendWhatsApp")}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── COST BREAKDOWN CHART ─────────────────────────────────────────────────────
function CostChart({ ingredients, totalCost, lang }) {
  const [hovered, setHovered] = useState(null);
  if (!ingredients.length || totalCost === 0) return null;

  const sorted = [...ingredients].sort((a, b) => b.cost - a.cost);
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 62;
  const rInner = 34;

  const slices = sorted.reduce(
    (acc, item, i) => {
      const pct = item.cost / totalCost;
      const angle = pct * 2 * Math.PI;
      const start = acc.startAngle;
      const end = start + angle;
      const large = angle > Math.PI ? 1 : 0;
      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      const xi1 = cx + rInner * Math.cos(start);
      const yi1 = cy + rInner * Math.sin(start);
      const xi2 = cx + rInner * Math.cos(end);
      const yi2 = cy + rInner * Math.sin(end);
      acc.items.push({
        path: `M ${xi1} ${yi1} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${rInner} ${rInner} 0 ${large} 0 ${xi1} ${yi1} Z`,
        color: CHART_COLORS[i % CHART_COLORS.length],
        item,
        pct,
        midAngle: start + angle / 2,
      });
      acc.startAngle = end;
      return acc;
    },
    { startAngle: -Math.PI / 2, items: [] },
  ).items;

  return (
    <div className="chart-wrap">
      <div className="chart-donut-wrap">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((s, i) => (
            <path
              key={i}
              d={s.path}
              fill={s.color}
              stroke="var(--surface)"
              strokeWidth="2"
              opacity={hovered === null || hovered === i ? 1 : 0.4}
              style={{ cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          {/* Center label */}
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            fontSize="9"
            fill="var(--text-muted)"
            fontFamily="Nunito"
          >
            {hovered !== null
              ? `${(slices[hovered].pct * 100).toFixed(1)}%`
              : t(lang, "totalCost")}
          </text>
          <text
            x={cx}
            y={cy + 8}
            textAnchor="middle"
            fontSize="8"
            fill="var(--text)"
            fontFamily="Nunito"
            fontWeight="700"
          >
            {hovered !== null
              ? t(lang, slices[hovered].item.name).slice(0, 10)
              : formatRp(totalCost).replace("Rp ", "")}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="chart-legend">
        {slices.map((s, i) => (
          <div
            key={i}
            className={`legend-item${hovered === i ? " hovered" : ""}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="legend-dot" style={{ background: s.color }} />
            <span className="legend-name">{t(lang, s.item.name)}</span>
            <span className="legend-pct">{(s.pct * 100).toFixed(1)}%</span>
            <span className="legend-cost">{formatRp(s.item.cost)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SELLING PRICE CALCULATOR ─────────────────────────────────────────────────
function SellingPriceCalc({ costPerJar, setSellingPrice, lang }) {
  const [targetMargin, setTargetMargin] = useState(40);
  const suggested =
    targetMargin < 100 ? costPerJar / (1 - targetMargin / 100) : 0;

  return (
    <div className="calc-box">
      <div className="calc-box-title">🎯 {t(lang, "targetMarginTitle")}</div>
      <div className="calc-row">
        <label>{t(lang, "targetMarginLabel")}</label>
        <div className="calc-slider-wrap">
          <input
            type="range"
            min="1"
            max="90"
            value={targetMargin}
            onChange={(e) => setTargetMargin(Number(e.target.value))}
            className="margin-slider"
          />
          <span className="margin-pct">{targetMargin}%</span>
        </div>
      </div>
      <div className="calc-result">
        <div className="calc-result-item">
          <span className="calc-result-label">{t(lang, "cogsPerPcs")}</span>
          <span className="calc-result-val">{formatRp(costPerJar)}</span>
        </div>
        <div className="calc-result-item highlight">
          <span className="calc-result-label">{t(lang, "suggestedPrice")}</span>
          <span className="calc-result-val big">
            {formatRp(roundPrice(suggested))}
          </span>
        </div>
      </div>
      <button
        className="ctrl-btn primary"
        style={{ width: "100%", marginTop: 10 }}
        onClick={() => setSellingPrice(roundPrice(suggested))}
      >
        ✓ {t(lang, "applyPrice")}
      </button>
    </div>
  );
}

// ─── LABEL PRINT ─────────────────────────────────────────────────────────────
function LabelPrint({
  recipe,
  costPerJar,
  jarSize,
  sellingPrice,
  lang,
  onClose,
}) {
  const [form, setForm] = useState({
    brandName: "",
    weight: String(jarSize),
    phone: "",
    instagram: "",
    expDays: "14",
    customNote: "",
  });
  const [baseDate] = useState(() => new Date());

  const label = t(lang, recipe);
  const price =
    sellingPrice > 0 ? sellingPrice : Math.ceil(costPerJar / 0.6 / 100) * 100;
  const expDate = new Date(
    baseDate.getTime() + Number(form.expDays) * 86400000,
  ).toLocaleDateString(lang === "id" ? "id-ID" : "en-GB");
  const prodDate = baseDate.toLocaleDateString(
    lang === "id" ? "id-ID" : "en-GB",
  );

  const printLabel = () => {
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Label ${label}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Nunito',sans-serif;background:#f5f5f5;padding:20px}
  .page{display:flex;flex-wrap:wrap;gap:16px;justify-content:center}
  .label{
    width:85mm;height:55mm;
    background:linear-gradient(135deg,#fdf6ee 0%,#fff8f2 100%);
    border:2px solid #c8783a;border-radius:12px;
    padding:10px 12px;
    display:flex;flex-direction:column;justify-content:space-between;
    page-break-inside:avoid;
    box-shadow:0 2px 8px rgba(0,0,0,0.1);
  }
  .label-top{display:flex;justify-content:space-between;align-items:flex-start}
  .brand{font-family:'Playfair Display',serif;font-size:15px;font-weight:800;color:#8b4513}
  .product{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#c8783a;margin:3px 0}
  .weight{font-size:10px;color:#9a7860;font-weight:700}
  .price-badge{background:#c8783a;color:white;padding:4px 10px;border-radius:99px;font-size:13px;font-weight:800}
  .divider{border:none;border-top:1.5px dashed #f0dfc8;margin:4px 0}
  .label-mid{display:grid;grid-template-columns:1fr 1fr;gap:2px;font-size:8.5px;color:#9a7860}
  .label-mid span{font-weight:700;color:#3d2b1f}
  .label-bottom{display:flex;justify-content:space-between;align-items:flex-end}
  .contact{font-size:8px;color:#9a7860}
  .contact div{margin-top:1px}
  .note{font-size:8px;color:#c8783a;font-style:italic;text-align:right;max-width:50mm}
  @media print{body{background:white;padding:0}.label{box-shadow:none}}
</style></head><body>
<div class="page">
  ${[1, 2, 3, 4, 5, 6]
    .map(
      () => `
  <div class="label">
    <div class="label-top">
      <div>
        ${form.brandName ? `<div class="brand">${form.brandName}</div>` : ""}
        <div class="product">${label}</div>
        <div class="weight">Net ${form.weight}g</div>
      </div>
      <div class="price-badge">${formatRp(price)}</div>
    </div>
    <hr class="divider"/>
    <div class="label-mid">
      <div>Prod: <span>${prodDate}</span></div>
      <div>Exp: <span>${expDate}</span></div>
    </div>
    <hr class="divider"/>
    <div class="label-bottom">
      <div class="contact">
        ${form.phone ? `<div>📞 ${form.phone}</div>` : ""}
        ${form.instagram ? `<div>📸 @${form.instagram}</div>` : ""}
      </div>
      <div class="note">${form.customNote || "Homemade with ❤️"}</div>
    </div>
  </div>`,
    )
    .join("")}
</div>
<script>window.onload=()=>window.print();</script>
</body></html>`);
    win.document.close();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal label-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">🏷️ {t(lang, "printLabel")}</span>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className="modal-subtitle">{t(lang, "printLabelSub")}</p>
        <div className="price-grid">
          {[
            ["brandName", t(lang, "brandName"), "text", "Mama Bakes"],
            ["weight", t(lang, "weightGram"), "number", "250"],
            ["phone", t(lang, "phoneNum"), "text", "08123456789"],
            ["instagram", "Instagram", "text", "mamabakes"],
            ["expDays", t(lang, "expDays"), "number", "14"],
            ["customNote", t(lang, "customNote"), "text", "Homemade with ❤️"],
          ].map(([key, label_, type, placeholder]) => (
            <div key={key} className="price-row">
              <label>{label_}</label>
              <div className="price-input-wrap">
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="label-preview">
          <div className="label-prev-inner">
            {form.brandName && <div className="lp-brand">{form.brandName}</div>}
            <div className="lp-product">{label}</div>
            <div className="lp-row">
              <span>Net {form.weight}g</span>
              <span className="lp-price">{formatRp(price)}</span>
            </div>
            <div className="lp-row small">
              <span>Prod: {prodDate}</span>
              <span>Exp: {expDate}</span>
            </div>
            {(form.phone || form.instagram) && (
              <div className="lp-contact">
                {form.phone && <span>📞 {form.phone}</span>}
                {form.instagram && <span>📸 @{form.instagram}</span>}
              </div>
            )}
            {form.customNote && (
              <div className="lp-note">{form.customNote}</div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="ctrl-btn" onClick={onClose}>
            {t(lang, "done")}
          </button>
          <button className="ctrl-btn primary" onClick={printLabel}>
            🖨️ {t(lang, "printNow")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── RECIPE NOTES ─────────────────────────────────────────────────────────────
function RecipeNotes({ lang }) {
  const getNotes = useRecipeStore((s) => s.getNotes);
  const saveNotes = useRecipeStore((s) => s.saveNotes);
  const [text, setText] = useState(() => getNotes());
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);
  const handleChange = useCallback(
    (e) => {
      const val = e.target.value;
      setText(val);
      setSaved(false);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        saveNotes(val);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }, 800);
    },
    [saveNotes],
  );
  return (
    <div className="card notes-card">
      <div className="card-title">
        📝 {t(lang, "recipeNotes")}
        {saved && (
          <span className="notes-saved">✓ {t(lang, "notesSaved")}</span>
        )}
      </div>
      <textarea
        className="notes-textarea"
        placeholder={t(lang, "notesPlaceholder")}
        value={text}
        onChange={handleChange}
        rows={4}
      />
      <p className="notes-hint">{t(lang, "notesHint")}</p>
    </div>
  );
}

// ─── STEP TIMER ──────────────────────────────────────────────────────────────
// Detects minutes in step text e.g. "25 minutes", "25 menit", "25–30 minutes"
function extractMinutes(text) {
  const match = text.match(/(\d+)(?:[–-](\d+))?\s*(?:minutes?|menit)/i);
  if (!match) return null;
  // Use the larger number if range
  return parseInt(match[2] || match[1], 10);
}

function StepTimer({ step, lang }) {
  const mins = extractMinutes(step);
  const totalSecs = mins ? mins * 60 : null;

  const [secondsLeft, setSecondsLeft] = useState(totalSecs);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setFinished(true);
            // Browser notification if supported
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification("⏰ Timer selesai!", { body: step });
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, step]);

  if (!totalSecs) return null;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const pct = ((totalSecs - secondsLeft) / totalSecs) * 100;

  const handleStart = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setRunning(true);
    setFinished(false);
  };

  return (
    <div className={`step-timer${finished ? " timer-done" : ""}`}>
      <div className="timer-display">
        <span className="timer-icon">
          {finished ? "✅" : running ? "⏱️" : "⏰"}
        </span>
        <span className="timer-time">
          {mm}:{ss}
        </span>
        <span className="timer-label">
          {finished ? t(lang, "timerDone") : `${mins} ${t(lang, "timerMin")}`}
        </span>
      </div>
      <div className="timer-bar">
        <div className="timer-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="timer-controls">
        {!running && !finished && (
          <button className="timer-btn start" onClick={handleStart}>
            ▶ {t(lang, "timerStart")}
          </button>
        )}
        {running && (
          <button className="timer-btn pause" onClick={() => setRunning(false)}>
            ⏸ {t(lang, "timerPause")}
          </button>
        )}
        {(running || finished || secondsLeft < totalSecs) && (
          <button
            className="timer-btn reset"
            onClick={() => {
              setSecondsLeft(totalSecs);
              setRunning(false);
              setFinished(false);
            }}
          >
            ↺ {t(lang, "timerReset")}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function formatHistoryDate(date, lang) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleString(lang === "id" ? "id-ID" : "en-GB");
}

function HistoryModal({ onClose, lang }) {
  const history = useRecipeStore((s) => s.history);
  const clearHistory = useRecipeStore((s) => s.clearHistory);
  const removeHistory = useRecipeStore((s) => s.removeHistory);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">🕒 {t(lang, "history")}</span>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className="modal-subtitle">{t(lang, "historySub")}</p>

        {history.length === 0 ? (
          <div className="history-empty">
            <span style={{ fontSize: 36 }}>📭</span>
            <p>{t(lang, "historyEmpty")}</p>
          </div>
        ) : (
          <>
            <div className="history-list">
              {history.map((h) => (
                <div key={h.id} className="history-item">
                  <div className="history-item-top">
                    <span className="history-recipe">{t(lang, h.recipe)}</span>
                    <span className="history-date">
                      {formatHistoryDate(h.date, lang)}
                    </span>
                    <button
                      className="history-del"
                      onClick={() => removeHistory(h.id)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="history-item-stats">
                    <span>🔢 {h.portion}x</span>
                    <span>💰 {formatRp(h.totalCost)}</span>
                    <span className={h.profit >= 0 ? "green" : "red"}>
                      {h.profit >= 0 ? "+" : ""}
                      {formatRp(h.profit)}
                    </span>
                    <span>{h.margin.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="ctrl-btn" onClick={clearHistory}>
                🗑️ {t(lang, "historyClear")}
              </button>
              <button className="ctrl-btn primary" onClick={onClose}>
                ✓ {t(lang, "done")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── PRICE EDITOR MODAL ───────────────────────────────────────────────────────
function PriceEditor({ onClose, lang }) {
  const customPrices = useRecipeStore((s) => s.customPrices);
  const updatePrice = useRecipeStore((s) => s.updatePrice);
  const resetPrices = useRecipeStore((s) => s.resetPrices);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">
            💰 {t(lang, "editIngredientPrices")}
          </span>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className="modal-subtitle">{t(lang, "pricePerGram")}</p>
        <div className="price-grid">
          {Object.entries(ingredientsData).map(([key, data]) => (
            <div key={key} className="price-row">
              <label>{t(lang, key)}</label>
              <div className="price-input-wrap">
                <span className="price-default">
                  {t(lang, "defaultPrice")} {data.pricePerGram}/g
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder={data.pricePerGram}
                  value={customPrices[key] ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      const next = { ...customPrices };
                      delete next[key];
                      useRecipeStore.setState({ customPrices: next });
                      localStorage.setItem(
                        "customPrices",
                        JSON.stringify(next),
                      );
                    } else {
                      updatePrice(key, val);
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="ctrl-btn" onClick={resetPrices}>
            🔄 {t(lang, "resetAll")}
          </button>
          <button className="ctrl-btn primary" onClick={onClose}>
            ✓ {t(lang, "done")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const recipe = useRecipeStore((s) => s.recipe);
  const portion = useRecipeStore((s) => s.portion);
  const activeStep = useRecipeStore((s) => s.activeStep);
  const completedSteps = useRecipeStore((s) => s.completedSteps);
  const sellingPrice = useRecipeStore((s) => s.sellingPrice);
  const totalBatchWeight = useRecipeStore((s) => s.totalBatchWeight);
  const jarSize = useRecipeStore((s) => s.jarSize);
  const darkMode = useRecipeStore((s) => s.darkMode);
  const showPriceEditor = useRecipeStore((s) => s.showPriceEditor);
  const lang = useRecipeStore((s) => s.lang);

  const setRecipe = useRecipeStore((s) => s.setRecipe);
  const setPortion = useRecipeStore((s) => s.setPortion);
  const setActiveStep = useRecipeStore((s) => s.setActiveStep);
  const toggleStep = useRecipeStore((s) => s.toggleStep);
  const resetSteps = useRecipeStore((s) => s.resetSteps);
  const setSellingPrice = useRecipeStore((s) => s.setSellingPrice);
  const setTotalBatchWeight = useRecipeStore((s) => s.setTotalBatchWeight);
  const setJarSize = useRecipeStore((s) => s.setJarSize);
  const toggleDarkMode = useRecipeStore((s) => s.toggleDarkMode);
  const togglePriceEditor = useRecipeStore((s) => s.togglePriceEditor);
  const setLang = useRecipeStore((s) => s.setLang);
  const getCalculated = useRecipeStore((s) => s.getCalculated);
  const getBusinessStats = useRecipeStore((s) => s.getBusinessStats);
  const addHistory = useRecipeStore((s) => s.addHistory);

  const [showLabel, setShowLabel] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { ingredients, totalCost, totalCalories } = getCalculated();
  const businessStats = getBusinessStats();
  const {
    jarCount,
    packagingCost,
    totalPackagingCost,
    totalCostWithPackaging,
    costPerJar,
    revenue,
    profit,
    margin,
  } = businessStats;

  const rawSteps = recipes[recipe]?.steps;
  const safeSteps =
    rawSteps === null
      ? []
      : Array.isArray(rawSteps?.[lang])
        ? rawSteps[lang]
        : Array.isArray(rawSteps?.en)
          ? rawSteps.en
          : [];
  const progress = safeSteps.length
    ? Math.round((completedSteps.length / safeSteps.length) * 100)
    : 0;
  const stepRefs = useRef([]);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);
  useEffect(() => {
    stepRefs.current[activeStep]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [activeStep]);

  const histTimerRef = useRef(null);
  useEffect(() => {
    if (totalCost === 0) return;
    clearTimeout(histTimerRef.current);
    histTimerRef.current = setTimeout(() => {
      const { profit, margin } = getBusinessStats();
      addHistory({
        recipe,
        portion,
        totalCost: totalCostWithPackaging,
        profit,
        margin,
      });
    }, 1500);
    return () => clearTimeout(histTimerRef.current);
  }, [addHistory, getBusinessStats, portion, recipe, totalCost, totalCostWithPackaging]);

  return (
    <div className="app">
      {/* TOP CONTROLS */}
      <div className="top-controls">
        <button
          className="lang-btn"
          onClick={() => setLang(lang === "en" ? "id" : "en")}
        >
          {lang === "en" ? "🇮🇩 ID" : "🇬🇧 EN"}
        </button>
        <button className="history-btn" onClick={() => setShowHistory(true)}>
          🕒 {t(lang, "history")}
        </button>
        <button className="theme-btn" onClick={toggleDarkMode}>
          {darkMode
            ? `☀️ ${t(lang, "lightMode")}`
            : `🌙 ${t(lang, "darkMode")}`}
        </button>
      </div>

      {showPriceEditor && (
        <PriceEditor onClose={togglePriceEditor} lang={lang} />
      )}
      {showLabel && (
        <LabelPrint
          recipe={recipe}
          costPerJar={costPerJar}
          jarSize={jarSize}
          sellingPrice={sellingPrice}
          lang={lang}
          onClose={() => setShowLabel(false)}
        />
      )}
      {showHistory && (
        <HistoryModal onClose={() => setShowHistory(false)} lang={lang} />
      )}

      {/* HEADER */}
      <div className="hero-panel">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="header">
          <img src={recipeIcons[recipe]} alt="icon" className="header-icon" />
          <img
            src={recipePhotos[recipe]}
            alt={recipe}
            className="header-photo"
          />
          <div className="header-text">
            <div className="hero-pills">
              <span className="hero-pill">{t(lang, recipe)}</span>
              <span className="hero-pill muted">
                {portion}x {t(lang, "shareBatch")}
              </span>
              <span
                className={`hero-pill ${margin >= 0 ? "profit" : "loss"}`}
              >
                {t(lang, "margin")} {margin.toFixed(1)}%
              </span>
            </div>
            <h1>{t(lang, "appTitle")}</h1>
            <p>{t(lang, "appSubtitle")}</p>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-label">{t(lang, "totalCost")}</span>
            <strong className="hero-stat-value">{formatRp(totalCost)}</strong>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-label">{t(lang, "totalCalories")}</span>
            <strong className="hero-stat-value">
              {Math.round(totalCalories).toLocaleString("id-ID")} kcal
            </strong>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-label">{t(lang, "totalJars")}</span>
            <strong className="hero-stat-value">
              {jarCount} {t(lang, "jar")}
            </strong>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-label">{t(lang, "profitLoss")}</span>
            <strong
              className={`hero-stat-value ${profit >= 0 ? "profit" : "loss"}`}
            >
              {profit >= 0 ? "+" : ""}
              {formatRp(profit)}
            </strong>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="recipe-tabs">
        {Object.keys(recipes).map((key) => (
          <button
            key={key}
            className={`tab-btn${recipe === key ? " active" : ""}`}
            onClick={() => setRecipe(key)}
          >
            <img src={recipeIcons[key]} alt={key} className="tab-icon" />
            {t(lang, key)}
          </button>
        ))}
      </div>

      {/* TWO COLUMN */}
      <div className="two-col">
        {/* LEFT */}
        <div className="col-left">
          {/* SETTINGS */}
          <div className="card settings-card">
            <div className="card-title">⚙️ {t(lang, "settings")}</div>
            <div className="field">
              <label>{t(lang, "numberOfBatches")}</label>
              <input
                type="number"
                min="1"
                value={portion}
                onChange={(e) => setPortion(Number(e.target.value))}
              />
            </div>
          </div>

          {/* INGREDIENTS */}
          <div className="card ingredients-card">
            <div className="card-title">
              🧂 {t(lang, "ingredients")}
              <span className="badge">
                {portion}x {t(lang, "shareBatch")}
              </span>
              <button className="edit-price-btn" onClick={togglePriceEditor}>
                ✏️ {t(lang, "editPrices")}
              </button>
            </div>
            <table className="ing-table">
              <thead>
                <tr>
                  <th>{t(lang, "ingredient")}</th>
                  <th className="amt-col">{t(lang, "grams")}</th>
                  <th className="cost-col">{t(lang, "price")}</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((item, i) => (
                  <tr key={i}>
                    <td>{t(lang, item.name)}</td>
                    <td className="amt-col">
                      {item.amount.toLocaleString("id-ID")}g
                    </td>
                    <td className="cost-col">{formatRp(item.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="totals-panel">
              <div className="summary-row">
                <span>{t(lang, "totalCost")}</span>
                <span className="big">{formatRp(totalCost)}</span>
              </div>
              <div className="summary-row compact">
                <span>{t(lang, "totalCalories")}</span>
                <span>{Math.round(totalCalories).toLocaleString("id-ID")} kcal</span>
              </div>
            </div>
            <div className="action-btns">
              <button
                className="export-btn"
                onClick={() =>
                  exportPDF(
                    recipe,
                    portion,
                    ingredients,
                    totalCost,
                    totalCalories,
                    businessStats,
                    lang,
                  )
                }
              >
                📄 {t(lang, "exportPDF")}
              </button>
              <ShareButton
                recipe={recipe}
                portion={portion}
                ingredients={ingredients}
                totalCost={totalCost}
                totalCalories={totalCalories}
                businessStats={businessStats}
                lang={lang}
              />
            </div>
          </div>

          {/* COST CHART */}
          <div className="card business-card">
            <div className="card-title">📊 {t(lang, "costBreakdown")}</div>
            <CostChart
              ingredients={ingredients}
              totalCost={totalCost}
              lang={lang}
            />
          </div>

          {/* NOTES */}
          <RecipeNotes key={recipe} recipe={recipe} lang={lang} />
        </div>

        {/* RIGHT */}
        <div className="col-right">
          {/* BUSINESS */}
          <div className="card">
            <div className="card-title">💼 {t(lang, "businessAnalysis")}</div>
            <div className="business-inputs">
              <div className="field">
                <label>{t(lang, "sellingPrice")}</label>
                <input
                  type="number"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
              </div>
              <div className="field">
                <label>{t(lang, "yieldBatch")}</label>
                <input
                  type="number"
                  min="1"
                  value={totalBatchWeight}
                  onChange={(e) => setTotalBatchWeight(e.target.value)}
                />
              </div>
              <div className="field">
                <label>{t(lang, "jarSize")}</label>
                <select
                  value={jarSize}
                  onChange={(e) => setJarSize(e.target.value)}
                >
                  <option value={250}>{t(lang, "jar250")}</option>
                  <option value={500}>{t(lang, "jar500")}</option>
                  <option value={1000}>{t(lang, "jar1000")}</option>
                </select>
              </div>
              <div className="field">
                <label>{t(lang, "packagingCost")}</label>
                <input type="text" value={formatRp(packagingCost)} readOnly />
              </div>
            </div>
            <div className="biz-grid">
              <div className="biz-stat">
                <div className="label">{t(lang, "totalJars")}</div>
                <div className="value">
                  {jarCount} {t(lang, "jar")}
                </div>
              </div>
              <div className="biz-stat">
                <div className="label">{t(lang, "totalPackagingCost")}</div>
                <div className="value">{formatRp(totalPackagingCost)}</div>
              </div>
              <div className="biz-stat">
                <div className="label">{t(lang, "cogsPerPcs")}</div>
                <div className="value">{formatRp(costPerJar)}</div>
              </div>
              <div className="biz-stat">
                <div className="label">{t(lang, "totalRevenue")}</div>
                <div className="value">{formatRp(revenue)}</div>
              </div>
              <div className="biz-stat">
                <div className="label">{t(lang, "profitLoss")}</div>
                <div className={`value ${profit >= 0 ? "green" : "red"}`}>
                  {profit >= 0 ? "+" : ""}
                  {formatRp(profit)}
                </div>
              </div>
              <div className="biz-stat">
                <div className="label">{t(lang, "margin")}</div>
                <div className={`value ${margin >= 0 ? "green" : "red"}`}>
                  {margin.toFixed(1)}%
                </div>
              </div>
              <div className="biz-stat">
                <div className="label">{t(lang, "totalHpp")}</div>
                <div className="value">{formatRp(totalCostWithPackaging)}</div>
              </div>
            </div>

            {/* SELLING PRICE CALCULATOR */}
            <div className="calc-section">
              <SellingPriceCalc
                costPerJar={costPerJar}
                setSellingPrice={setSellingPrice}
                lang={lang}
              />
            </div>

            {/* PRINT LABEL BUTTON */}
            <button className="label-btn" onClick={() => setShowLabel(true)}>
              🏷️ {t(lang, "printLabel")}
            </button>
          </div>

          {/* STEPS */}
          <div className="card steps-card">
            <div className="card-title">👩‍🍳 {t(lang, "steps")}</div>
            {safeSteps.length === 0 ? (
              <div className="wip-notice">
                <span className="wip-icon">🚧</span>
                <strong>{t(lang, "wipTitle")}</strong>
                <p className="wip-sub">{t(lang, "wipSub")}</p>
              </div>
            ) : (
              <>
                <div className="progress-wrap">
                  <div className="progress-label">
                    <span>{t(lang, "progress")}</span>
                    <span>
                      {completedSteps.length}/{safeSteps.length} — {progress}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                {progress === 100 && (
                  <div className="done-banner">
                    🎉 {t(lang, "allDone")} {t(lang, recipe)}{" "}
                    {t(lang, "isReady")}
                  </div>
                )}
                <ol className="steps-list">
                  {safeSteps.map((step, i) => {
                    const isDone = completedSteps.includes(i);
                    const isActive = i === activeStep;
                    return (
                      <li
                        key={i}
                        ref={(el) => (stepRefs.current[i] = el)}
                        className={`step-item${isActive ? " active" : ""}${isDone ? " done" : ""}`}
                        onClick={() => toggleStep(i)}
                      >
                        <div className="step-num">{isDone ? "✓" : i + 1}</div>
                        <div className="step-content">
                          <span>{step}</span>
                          {isActive && (
                            <StepTimer key={`${lang}-${i}-${step}`} step={step} lang={lang} />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <div className="step-controls">
                  <button
                    className="ctrl-btn"
                    onClick={() => setActiveStep(Math.max(activeStep - 1, 0))}
                  >
                    ← {t(lang, "prev")}
                  </button>
                  <button
                    className="ctrl-btn primary"
                    onClick={() => toggleStep(activeStep)}
                  >
                    ✓ {t(lang, "markDone")}
                  </button>
                  <button
                    className="ctrl-btn"
                    onClick={() =>
                      setActiveStep(
                        Math.min(activeStep + 1, safeSteps.length - 1),
                      )
                    }
                  >                    {t(lang, "next")} →
                  </button>
                  <button className="ctrl-btn" onClick={resetSteps}>
                    🔄 {t(lang, "reset")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryPanel({ lang }) {
  const history = useRecipeStore((s) => s.history);
  const clearHistory = useRecipeStore((s) => s.clearHistory);

  if (!history.length) {
    return (
      <div className="card">
        <div className="card-title">📜 {t(lang, "history")}</div>
        <p>{t(lang, "historyEmpty")}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">
        📜 {t(lang, "history")}
        <button
          className="edit-price-btn"
          onClick={clearHistory}
          style={{ marginLeft: "auto" }}
        >
          {t(lang, "historyClear")}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {history.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "10px",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              background: "var(--surface2)",
            }}
          >
            <div style={{ fontWeight: 700 }}>{t(lang, item.recipe)}</div>

            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {formatHistoryDate(item.date, lang)}
            </div>

            <div>💰 {formatRp(item.totalCost)}</div>

            <div style={{ fontSize: "12px" }}>🔢 {item.portion} batch</div>
          </div>
        ))}
      </div>
    </div>
  );
}




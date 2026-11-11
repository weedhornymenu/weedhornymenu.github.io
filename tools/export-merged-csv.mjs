import fs from "node:fs";

function parseCSV(text){
  const rows = [];
  let row = [], cur = "", quoted = false;
  for (let i = 0; i < text.length; i++){
    const c = text[i];
    if (quoted){
      if (c === '"'){
        if (text[i + 1] === '"'){ cur += '"'; i++; }
        else quoted = false;
      } else cur += c;
    } else if (c === '"') quoted = true;
    else if (c === ","){ row.push(cur); cur = ""; }
    else if (c === "\n"){ row.push(cur.replace(/\r$/, "")); rows.push(row); row = []; cur = ""; }
    else cur += c;
  }
  if (cur.length || row.length){ row.push(cur.replace(/\r$/, "")); rows.push(row); }
  return rows;
}

const norm = value => {
  let s = String(value || "").normalize("NFC");
  s = s.replace(/\\n/g, " ").replace(/[\u0000-\u001f]/g, " ");
  s = s.replace(/\([^)]*\)/g, " ").replace(/（[^）]*）/g, " ");
  s = s.replace(/^(?:นาย|นางสาว|นาง)\s*/, "");
  s = s.toLowerCase().replace(/[.,'"’`]/g, " ");
  s = s.replace(/บริษัท|จำกัด|จํากัด|มหาชน/g, " ");
  s = s.replace(/\b(?:co|ltd|limited|llimited|company|public|the)\b/g, " ");
  return s.replace(/[^0-9a-z\u0e00-\u0e7f]+/g, " ").trim();
};
const stripSiteSuffix = s => String(s || "").replace(/\s*[\(（][^\)）]*[\)）]\s*$/, "").trim();
const cleanName = s => String(s || "").replace(/\\n/g, " ").replace(/\s+/g, " ").trim();
const num = v => {
  const n = parseFloat(String(v || "").replace(/,/g, ""));
  return isFinite(n) ? n : 0;
};
const pushUnique = (arr, v) => { if (v && !arr.includes(v)) arr.push(v); };
const channelCount = o => ["website","facebook","line","instagram","email","phone"].filter(k => o[k]).length;
const SYSTEM_ORDER = ["Indoor","Greenhouse","Outdoor"];

const csv = parseCSV(fs.readFileSync("gacp-certified-farms-thailand.csv", "utf8").replace(/^\uFEFF/, ""));
const header = csv.shift().map(h => h.trim());
const col = name => header.indexOf(name);
const I = {
  th: col("Name (TH)"), en: col("Name (EN)"),
  prov: col("Province (EN)"), sys: col("System (EN)"),
  area: col("Area m2 (EN)"), plants: col("Plants/Year (EN)"),
  cert: col("GACP Certificate No.")
};

const groups = new Map();
for (const r of csv){
  const en = (r[I.en] || "").trim();
  const th = (r[I.th] || "").trim();
  if (!en && !th) continue;
  const key = norm(en) || norm(th);
  if (!groups.has(key)) groups.set(key, {key, enCount:{}, thCount:{}, prov:[], sys:[], area:0, plants:0, certs:[], sites:0});
  const g = groups.get(key);
  if (en) g.enCount[en] = (g.enCount[en] || 0) + 1;
  if (th) g.thCount[th] = (g.thCount[th] || 0) + 1;
  g.sites += 1;
  g.area += num(r[I.area]);
  g.plants += num(r[I.plants]);
  pushUnique(g.prov, (r[I.prov] || "").trim());
  pushUnique(g.sys, (r[I.sys] || "").trim());
  const cert = (r[I.cert] || "").trim();
  if (cert && cert !== "-") cert.split(",").forEach(c => pushUnique(g.certs, c.trim()));
}

const mode = counts => Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || "";

const sidecar = JSON.parse(fs.readFileSync("private/gacp-contacts.json", "utf8"));
const enriched = sidecar.filter(o => o && (o.en || o.th));
const groupList = [...groups.values()];
const byKey = new Map(groupList.map(g => [g.key, g]));
const matched = new Map();
const used = new Set();
for (const o of enriched){
  const g = byKey.get(norm(o.en)) || byKey.get(norm(o.th));
  if (!g) continue;
  if (!matched.has(g.key)) matched.set(g.key, []);
  matched.get(g.key).push(o);
  used.add(o);
}

const operators = [];
for (const g of groupList){
  const ops = (matched.get(g.key) || []).slice().sort((a, b) => channelCount(b) - channelCount(a));
  const primary = ops[0] || null;
  const en = primary ? primary.en : mode(g.enCount);
  const th = mode(g.thCount) || (primary ? primary.th : "") || en;
  const o = { id: 0, no: "", th: cleanName(th || en), en: cleanName(en || th) };
  o.province = g.prov.join(", ");
  o.systems = SYSTEM_ORDER.filter(s => g.sys.includes(s)).concat(g.sys.filter(s => !SYSTEM_ORDER.includes(s))).join("; ");
  o.area = g.area || (primary && primary.area) || 0;
  o.plants = g.plants || (primary && primary.plants) || 0;
  o.cert = g.certs.length ? g.certs.join(",") : (primary ? primary.cert : "");
  o.sites = g.sites;
  ["website","facebook","line","instagram","email","phone","address"].forEach(k => { o[k] = primary ? primary[k] || "" : ""; });
  if (ops.length){
    const sources = [];
    ops.forEach(x => (x.sources || []).forEach(s => pushUnique(sources, s)));
    o.confidence = primary.confidence || "";
    o.notes = primary.notes || "";
    o.sources = sources;
  }
  operators.push(o);
}

for (const o of enriched){
  if (used.has(o) || (!o.en && !o.th)) continue;
  operators.push({
    id: 0, no: "", th: cleanName(o.th || o.en), en: cleanName(o.en),
    province: o.province, systems: o.systems,
    area: o.area || 0, plants: o.plants || 0,
    cert: o.cert || "", sites: o.sites || 1,
    website: o.website || "", facebook: o.facebook || "",
    line: o.line || "", instagram: o.instagram || "",
    email: o.email || "", phone: o.phone || "", address: o.address || "",
    confidence: o.confidence || "", notes: o.notes || "", sources: o.sources || []
  });
}

operators.sort((a, b) => b.area - a.area || String(a.en).localeCompare(String(b.en)));
operators.forEach((o, i) => {
  o.id = i + 1;
  o.no = String(i + 1);
  if (o.sites > 1){
    o.en = cleanName(stripSiteSuffix(o.en)) || o.en;
    o.th = cleanName(stripSiteSuffix(o.th)) || o.th;
  }
});

const HEAD = [
  "Name (EN)","Name (TH)","Province (EN)","System (EN)","Area m2 (EN)","Plants/Year (EN)",
  "GACP Certificate No.","Sites","Website","Facebook","LINE","Instagram","Email","Phone",
  "Address","Confidence","Notes","Sources"
];
const q = v => {
  const s = String(v == null ? "" : v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
const lines = [HEAD.map(q).join(",")];
for (const o of operators){
  lines.push([
    o.en, o.th, o.province, o.systems, o.area || "", o.plants || "", o.cert, o.sites,
    o.website, o.facebook, o.line, o.instagram, o.email, o.phone, o.address,
    o.confidence, o.notes, (o.sources || []).join(" | ")
  ].map(q).join(","));
}
fs.mkdirSync("private", { recursive: true });
fs.writeFileSync("private/gacp-farms-merged.csv", "\uFEFF" + lines.join("\r\n") + "\r\n");

const sites = operators.reduce((n, o) => n + (o.sites || 0), 0);
const withC = operators.filter(o => channelCount(o) > 0).length;
console.log(`operators: ${operators.length}`);
console.log(`sites: ${sites}`);
console.log(`with a contact: ${withC}`);
console.log(`sidecar matched: ${used.size} of ${enriched.length}`);
console.log("wrote private/gacp-farms-merged.csv");

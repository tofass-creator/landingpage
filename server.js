// Landing page + dotazník + odeslání přes Resend v jednom souboru. Node 18+, žádné závislosti.
// Spuštění: RESEND_API_KEY=... node server.js
"use strict";
const http = require("http");

const PORT = process.env.PORT || 3000;
const TO = process.env.NOTIFICATION_EMAIL || "laskakrystof3@gmail.com";
const FROM = process.env.RESEND_FROM || "Web dotazník <onboarding@resend.dev>";

const PAGE = String.raw`<!doctype html>
<html lang="cs"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Web, který přináší zakázky, ne jen vizitka</title>
<meta name="description" content="Rychlá kontrola vašeho webu a věcný plán úprav, které zvýší počet poptávek.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Source+Sans+3:wght@400;600;700&display=swap&subset=latin-ext" rel="stylesheet">
<style>
:root{--ink:#10243a;--bg:#f2f5f7;--line:#d9e1e8;--brand:#0a58ff;--brand-d:#0846cc;--sun:#ffb81c;--bad:#b3261e;--mut:#4d6074}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:18px/1.55 "Source Sans 3",system-ui,sans-serif}
h1,h2,h3{font-family:"Bricolage Grotesque",system-ui,sans-serif;line-height:1.1;margin:0 0 .5em;letter-spacing:-.02em}
h1{font-size:clamp(2.1rem,7vw,4rem);max-width:18ch;font-weight:800}
h2{font-size:clamp(1.7rem,4.5vw,2.6rem)}h3{font-size:1.2rem}
.wrap{max-width:1000px;margin:0 auto;padding:0 20px}.sec{padding:56px 20px}
.bar{display:flex;justify-content:space-between;align-items:center;padding:14px 20px;max-width:1000px;margin:0 auto}
.logo{font:800 1.1rem "Bricolage Grotesque",sans-serif}
.hero{padding-top:48px;padding-bottom:64px}.lead{font-size:1.25rem;max-width:42ch;color:var(--mut)}
.sub,.hint{color:var(--mut)}.hint{font-size:.95rem;margin:.6rem 0 0}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:54px;padding:0 28px;border:0;border-radius:10px;background:var(--brand);color:#fff;font:700 1.05rem "Source Sans 3",sans-serif;cursor:pointer;text-decoration:none;box-shadow:0 3px 0 var(--brand-d)}
.btn:hover{background:var(--brand-d)}.btn:active{transform:translateY(2px);box-shadow:none}
.btn:disabled{opacity:.6;cursor:wait}.btn-sm{min-height:42px;padding:0 18px;font-size:.95rem}
.btn.ghost{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 2px var(--line)}
:focus-visible{outline:3px solid var(--sun);outline-offset:2px}
.compare{display:grid;gap:16px;margin-top:24px}.col{padding:24px;border-radius:14px}
.col ul{margin:0;padding-left:1.1em}.col li{margin:.7em 0}
.bad{background:#e7ebef}.good{background:var(--ink);color:#fff}.good h3{color:var(--sun)}
.leaks{display:grid;margin-top:24px;border-top:2px solid var(--ink)}
.leaks article{padding:20px 0;border-bottom:1px solid var(--line)}.leaks p{margin:0;color:var(--mut)}
.steps{list-style:none;padding:0;margin:24px 0 0;display:grid;gap:16px;counter-reset:s}
.steps li{counter-increment:s;padding-left:64px;position:relative}
.steps li::before{content:counter(s);position:absolute;left:0;top:0;width:44px;height:44px;border-radius:50%;background:var(--sun);display:grid;place-items:center;font:800 1.2rem "Bricolage Grotesque",sans-serif}
.steps p{margin:0;color:var(--mut)}
.form-sec{background:#e4eaf0;max-width:none}.form-sec>*{max-width:760px;margin-left:auto;margin-right:auto}
.card{background:#fff;border-radius:16px;padding:24px 20px;margin-top:20px;box-shadow:0 8px 30px rgba(16,36,58,.08)}
.progress span{font-weight:700;font-size:.95rem}.track{height:8px;background:var(--line);border-radius:99px;margin:8px 0 22px;overflow:hidden}
.track div{height:100%;background:var(--brand);transition:width .3s}
fieldset{border:0;padding:0;margin:0}legend{font:700 1.35rem/1.25 "Bricolage Grotesque",sans-serif;margin-bottom:14px;padding:0}
.opts{display:grid;gap:10px}
.opt{display:flex;gap:14px;align-items:center;text-align:left;width:100%;min-height:64px;padding:14px 16px;border:2px solid var(--line);border-radius:12px;background:#fff;font:600 1.05rem "Source Sans 3",sans-serif;color:var(--ink);cursor:pointer}
.opt:hover{border-color:var(--brand)}.opt.sel{border-color:var(--brand);background:#eaf1ff}
.mark{flex:none;width:26px;height:26px;border-radius:50%;border:2px solid var(--line);display:grid;place-items:center;font-size:.9rem;color:#fff}
.sel .mark{background:var(--brand);border-color:var(--brand)}
label{display:block;font-weight:600;margin-bottom:14px}label small{font-weight:400;color:var(--mut)}
input,textarea{display:block;width:100%;margin-top:6px;padding:14px;border:2px solid var(--line);border-radius:10px;font:inherit;background:#fff;color:var(--ink)}
input:focus,textarea:focus{border-color:var(--brand);outline:none}
.hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.err{color:var(--bad);font-weight:600;margin:14px 0 0}
.nav{display:flex;gap:10px;margin-top:22px}.nav .btn:last-child{flex:1}
.thanks ol{padding-left:1.2em}.thanks li{margin:.6em 0}
.foot{padding-top:28px;padding-bottom:40px;color:var(--mut);font-size:.9rem}
@media(min-width:760px){.compare{grid-template-columns:1fr 1fr}.leaks{grid-template-columns:1fr 1fr;column-gap:40px}.opts{grid-template-columns:1fr 1fr}.card{padding:32px}.sec{padding:80px 20px}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
</style></head>
<body><main>
<header class="bar"><span class="logo">Web na zakázky</span><a class="btn btn-sm" href="#dotaznik">Vyplnit dotazník</a></header>

<section class="hero wrap">
<h1>Z webu, který jen visí na internetu, uděláme nástroj na poptávky.</h1>
<p class="lead">Navrhuji a upravuji weby tak, aby návštěvník rychle pochopil nabídku, získal důvěru a poslal poptávku, i z mobilu.</p>
<a class="btn" href="#dotaznik">Vyplnit krátký dotazník</a>
<p class="hint">Vyplnění zabere zhruba 1 minutu. Nezávazně.</p>
</section>

<section class="wrap sec"><h2>Vizitka vs. web na zakázky</h2>
<p class="sub">Většina webů zájemce ztratí dřív, než se ozve. Funkční struktura to mění.</p>
<div class="compare">
<div class="col bad"><h3>Web jako vizitka</h3><ul>
<li>Nejasný slib nahoře: návštěvník nepochopí, co nabízíte.</li>
<li>Kontakt schovaný v menu nebo na konci stránky.</li>
<li>Slabá důvěra: žádné reference, čísla ani tváře.</li>
<li>Zdlouhavá poptávka s deseti poli.</li></ul></div>
<div class="col good"><h3>Web na zakázky</h3><ul>
<li>Nadpis říká, komu pomáháte a s čím, hned na první obrazovce.</li>
<li>Jedno hlavní tlačítko je vidět na každé obrazovce, i na mobilu.</li>
<li>Reference, konkrétní výsledky a jména jsou u každé nabídky.</li>
<li>Poptávka zabere minutu a ptá se jen na to nejdůležitější.</li></ul></div>
</div></section>

<section class="wrap sec"><h2>Kde se nejčastěji ztrácí zakázky</h2>
<div class="leaks">
<article><h3>První obrazovka</h3><p>Za 5 sekund musí být jasné, co nabízíte, pro koho a co má návštěvník udělat dál.</p></article>
<article><h3>Cesta k poptávce</h3><p>Každý klik navíc ubírá zájemce. Poptávka by měla být na dosah z každé části stránky.</p></article>
<article><h3>Důvěra a reference</h3><p>Lidé nekupují od neznámých. Chybí recenze, fotky z práce, IČO, adresa, konkrétní čísla.</p></article>
<article><h3>Mobil a odeslání</h3><p>Většina návštěv jde z telefonu. Malá tlačítka, pomalé načítání a dlouhý formulář zákazníka odradí.</p></article>
</div></section>

<section class="wrap sec"><h2>Jak spolupráce probíhá</h2>
<ol class="steps">
<li><h3>Vyplníte klikací dotazník</h3><p>Šest rychlých otázek, zabere asi minutu.</p></li>
<li><h3>Já si prohlédnu váš web</h3><p>Projdu první obrazovku, cestu k poptávce, důvěru a mobil.</p></li>
<li><h3>Domluvíme se na úpravách</h3><p>Věcný hovor nebo schůzka nad konkrétními kroky, které přinesou poptávky.</p></li>
</ol></section>

<section id="dotaznik" class="wrap sec form-sec"><h2>Krátký dotazník</h2>
<p class="sub">Díky odpovědím se na schůzku připravím konkrétně na váš web.</p>
<div id="app" class="card"></div></section>

<footer class="wrap foot">© <span id="yr"></span> Web na zakázky</footer>
</main>
<script>
(function () {
  var TOTAL = 6;
  var Q = [
    { k: "situation", multi: false, t: "Jaká je vaše současná situace s webem?", o: [
      "Web už máme, ale moc poptávek z něj nechodí", "Web máme, ale je zastaralý nebo nepřehledný",
      "Web zatím nemáme a chceme začít od nuly", "Potřebujeme novou stránku pro konkrétní službu nebo kampaň"] },
    { k: "priorities", multi: true, t: "Co je pro vás teď hlavní priorita?", o: [
      "Získat víc reálných poptávek a zakázek", "Působit důvěryhodněji a profesionálněji než konkurence",
      "Zjednodušit objednávání / poptávkový proces pro zákazníky", "Lepší viditelnost v regionu a na mobilu"] },
    { k: "sources", multi: false, t: "Odkud vám dnes chodí většina zákazníků?", o: [
      "Hlavně přes doporučení a známé", "Z vyhledávání (Google / Seznam / Mapy)",
      "Ze sociálních sítí (Instagram / Facebook)", "Kombinace více zdrojů, ale web to neumí pořádně uzavřít"] },
    { k: "timeline", multi: false, t: "V jakém horizontu chcete úpravy nebo nový web řešit?", o: [
      "Co nejdříve (v nejbližších týdnech)", "Během 1–2 měsíců", "Zatím jen sbírám informace a porovnávám možnosti"] }
  ];
  var a = { situation: "", priorities: [], sources: "", timeline: "", website: "", name: "", contact: "", message: "", company_fax: "" };
  var step = 1, err = "", loading = false;
  var root = document.getElementById("app");
  document.getElementById("yr").textContent = new Date().getFullYear();

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function contactOk(c) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c) || c.replace(/\D/g, "").length >= 9; }
  function validate() {
    if (step === 1 && !a.situation) return "Vyberte jednu možnost.";
    if (step === 2 && !a.priorities.length) return "Vyberte alespoň jednu prioritu.";
    if (step === 3 && !a.sources) return "Vyberte jednu možnost.";
    if (step === 4 && !a.timeline) return "Vyberte jednu možnost.";
    if (step === 5) {
      if (a.name.trim().length < 3) return "Napište své jméno a příjmení.";
      if (!contactOk(a.contact.trim())) return "Zadejte platný e-mail nebo telefon (min. 9 číslic).";
    }
    return "";
  }
  function field(label, key, opt, ac) {
    var inp = el("input", { autocomplete: ac, value: a[key] });
    inp.value = a[key];
    inp.addEventListener("input", function () { a[key] = inp.value; });
    var l = el("label", { text: label + " " }, [inp]);
    if (opt) l.insertBefore(el("small", { text: "nepovinné" }), inp);
    return l;
  }
  function render() {
    root.innerHTML = "";
    root.appendChild(el("div", { class: "progress" }, [
      el("span", { text: "Krok " + step + " z " + TOTAL }),
      el("div", { class: "track" }, [el("div", { style: "width:" + (step / TOTAL * 100) + "%" })])
    ]));
    var fs = el("fieldset");
    if (step <= 4) {
      var q = Q[step - 1];
      fs.appendChild(el("legend", { text: q.t }));
      if (q.multi) fs.appendChild(el("p", { class: "hint", text: "Můžete vybrat více možností." }));
      var box = el("div", { class: "opts" });
      q.o.forEach(function (o) {
        var sel = q.multi ? a.priorities.indexOf(o) > -1 : a[q.k] === o;
        box.appendChild(el("button", { type: "button", class: "opt" + (sel ? " sel" : ""), "aria-pressed": String(sel), onclick: function () {
          err = "";
          if (q.multi) { var i = a.priorities.indexOf(o); i > -1 ? a.priorities.splice(i, 1) : a.priorities.push(o); }
          else a[q.k] = o;
          render();
        } }, [el("span", { class: "mark", "aria-hidden": "true", text: sel ? "✓" : "" }), document.createTextNode(o)]));
      });
      fs.appendChild(box);
    } else if (step === 5) {
      fs.appendChild(el("legend", { text: "Kde si můžeme váš současný web prohlédnout a kam se vám ozvat?" }));
      fs.appendChild(field("Odkaz na váš web (nebo název firmy)", "website", true, "url"));
      fs.appendChild(field("Jméno a příjmení", "name", false, "name"));
      fs.appendChild(field("E-mail nebo telefon", "contact", false, "email"));
      var hp = el("input", { class: "hp", tabindex: "-1", autocomplete: "off", "aria-hidden": "true" });
      hp.addEventListener("input", function () { a.company_fax = hp.value; });
      fs.appendChild(hp);
    } else {
      fs.appendChild(el("legend", { text: "Chcete se na něco předem zeptat nebo nám cokoliv vzkázat, abychom se na schůzku mohli co nejlépe připravit?" }));
      var ta = el("textarea", { rows: "5", maxlength: "2000", placeholder: "Např. jakou službu chcete nejvíc podpořit, co vám na současném webu nejvíc vadí nebo na co se chcete zaměřit…" });
      ta.value = a.message;
      ta.addEventListener("input", function () { a.message = ta.value; });
      fs.appendChild(ta);
    }
    root.appendChild(fs);
    if (err) root.appendChild(el("p", { class: "err", role: "alert", text: err }));
    var nav = el("div", { class: "nav" });
    if (step > 1) nav.appendChild(el("button", { type: "button", class: "btn ghost", text: "Zpět", onclick: function () { err = ""; step--; render(); } }));
    if (step < TOTAL) {
      nav.appendChild(el("button", { type: "button", class: "btn", text: "Pokračovat", onclick: function () { err = validate(); if (!err) step++; render(); } }));
    } else {
      var b = el("button", { type: "button", class: "btn", text: loading ? "Odesílám…" : "Odeslat a domluvit krátkou schůzku", onclick: submit });
      if (loading) b.disabled = true;
      nav.appendChild(b);
    }
    root.appendChild(nav);
  }
  function thanks() {
    root.innerHTML = "";
    root.setAttribute("role", "status");
    root.appendChild(el("h3", { text: "Děkuji, " + (a.name.trim().split(" ")[0] || "") + ". Dotazník je odeslaný." }));
    var ol = el("ol", { class: "thanks" });
    ["Prohlédnu si váš web" + (a.website ? " (" + a.website + ")" : "") + " a vaše odpovědi.",
     "Ozvu se vám na " + a.contact + ", obvykle do 1–2 pracovních dnů.",
     "Společně projdeme konkrétní úpravy, které přinesou víc poptávek."].forEach(function (t) { ol.appendChild(el("li", { text: t })); });
    root.appendChild(ol);
    root.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function submit() {
    loading = true; err = ""; render();
    fetch("/api/submit-lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(a) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw new Error(d.error || "Odeslání se nepodařilo."); }); })
      .then(thanks)
      .catch(function (e) { loading = false; err = e.message || "Odeslání se nepodařilo. Zkuste to prosím znovu."; render(); });
  }
  render();
})();
</script></body></html>`;

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clip = (s, n) => String(s == null ? "" : s).trim().slice(0, n);
const send = (res, code, type, body, extra) => { res.writeHead(code, Object.assign({ "Content-Type": type }, extra)); res.end(body); };
const json = (res, code, obj) => send(res, code, "application/json; charset=utf-8", JSON.stringify(obj));

// jednoduchý limit: max 5 odeslání za 10 minut z jedné IP
const hits = new Map();
function limited(ip) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter((t) => now - t < 600000);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 5;
}

async function handleLead(req, res) {
  let raw = "";
  for await (const chunk of req) { raw += chunk; if (raw.length > 20000) return json(res, 413, { error: "Příliš velká data." }); }
  let b;
  try { b = JSON.parse(raw); } catch { return json(res, 400, { error: "Neplatná data." }); }

  if (b.company_fax) return json(res, 200, { ok: true }); // honeypot

  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0].trim();
  if (limited(ip)) return json(res, 429, { error: "Příliš mnoho pokusů. Zkuste to za chvíli." });

  const name = clip(b.name, 120), contact = clip(b.contact, 160);
  const situation = clip(b.situation, 200), sources = clip(b.sources, 200), timeline = clip(b.timeline, 200);
  const website = clip(b.website, 300), message = clip(b.message, 2000);
  const priorities = Array.isArray(b.priorities) ? b.priorities.map((p) => clip(p, 200)).slice(0, 4) : [];
  const okContact = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact) || contact.replace(/\D/g, "").length >= 9;
  if (name.length < 3 || !okContact || !situation || !sources || !timeline || !priorities.length)
    return json(res, 400, { error: "Zkontrolujte prosím vyplněné údaje." });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.error("Chybí RESEND_API_KEY"); return json(res, 500, { error: "Odesílání není nastavené. Zkuste to později." }); }

  const rows = [
    ["1. Situace s webem", situation], ["2. Priority", priorities.join("\n")],
    ["3. Zdroje zákazníků", sources], ["4. Časový horizont", timeline],
    ["5a. Web / firma", website || "neuvedeno"], ["5b. Jméno", name], ["5c. E-mail / telefon", contact],
    ["6. Dotaz / vzkaz", message || "neuvedeno"],
  ];
  const html = '<div style="font-family:Arial,sans-serif;max-width:640px"><h2>Nový dotazník z webu: ' + esc(name) + '</h2>' +
    '<table style="border-collapse:collapse;width:100%">' + rows.map((r) =>
      '<tr><td style="padding:8px 12px;border-bottom:1px solid #e3e8ee;font-weight:bold;vertical-align:top;width:35%">' + esc(r[0]) + '</td>' +
      '<td style="padding:8px 12px;border-bottom:1px solid #e3e8ee;white-space:pre-line">' + esc(r[1]) + '</td></tr>').join("") + '</table></div>';
  const payload = { from: FROM, to: [TO], subject: "Nový dotazník z webu: " + name, html, text: rows.map((r) => r[0] + ": " + r[1]).join("\n") };
  if (contact.includes("@")) payload.reply_to = contact;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    if (!r.ok) { console.error("Resend error:", r.status, await r.text()); return json(res, 502, { error: "E-mail se nepodařilo odeslat. Zkuste to prosím znovu." }); }
    return json(res, 200, { ok: true });
  } catch (e) {
    console.error("Resend fetch failed:", e);
    return json(res, 502, { error: "E-mail se nepodařilo odeslat. Zkuste to prosím znovu." });
  }
}

http.createServer((req, res) => {
  const path = (req.url || "/").split("?")[0];
  if (req.method === "POST" && path === "/api/submit-lead") return handleLead(req, res);
  if (req.method === "GET" && path === "/healthz") return send(res, 200, "text/plain", "ok");
  if (req.method === "GET" && path === "/") return send(res, 200, "text/html; charset=utf-8", PAGE, { "Cache-Control": "public, max-age=300" });
  send(res, 404, "text/plain; charset=utf-8", "Nenalezeno");
}).listen(PORT, () => console.log("Běží na http://localhost:" + PORT));

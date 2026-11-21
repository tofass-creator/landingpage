"use client";
import { useState } from "react";

const TOTAL = 6;
const Q = {
  situation: { title: "Jaká je vaše současná situace s webem?", multi: false, opts: [
    "Web už máme, ale moc poptávek z něj nechodí", "Web máme, ale je zastaralý nebo nepřehledný",
    "Web zatím nemáme a chceme začít od nuly", "Potřebujeme novou stránku pro konkrétní službu nebo kampaň"] },
  priorities: { title: "Co je pro vás teď hlavní priorita?", multi: true, opts: [
    "Získat víc reálných poptávek a zakázek", "Působit důvěryhodněji a profesionálněji než konkurence",
    "Zjednodušit objednávání / poptávkový proces pro zákazníky", "Lepší viditelnost v regionu a na mobilu"] },
  sources: { title: "Odkud vám dnes chodí většina zákazníků?", multi: false, opts: [
    "Hlavně přes doporučení a známé", "Z vyhledávání (Google / Seznam / Mapy)",
    "Ze sociálních sítí (Instagram / Facebook)", "Kombinace více zdrojů, ale web to neumí pořádně uzavřít"] },
  timeline: { title: "V jakém horizontu chcete úpravy nebo nový web řešit?", multi: false, opts: [
    "Co nejdříve (v nejbližších týdnech)", "Během 1–2 měsíců", "Zatím jen sbírám informace a porovnávám možnosti"] },
} as const;
type QKey = keyof typeof Q;

export default function Questionnaire() {
  const [step, setStep] = useState(1);
  const [a, setA] = useState({ situation: "", priorities: [] as string[], sources: "", timeline: "",
    website: "", name: "", contact: "", message: "", company_fax: "" });
  const [err, setErr] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const pick = (k: QKey, v: string) => {
    setErr("");
    if (k === "priorities") {
      setA((p) => ({ ...p, priorities: p.priorities.includes(v) ? p.priorities.filter((x) => x !== v) : [...p.priorities, v] }));
    } else setA((p) => ({ ...p, [k]: v }));
  };

  const validate = () => {
    if (step === 1 && !a.situation) return "Vyberte jednu možnost.";
    if (step === 2 && a.priorities.length === 0) return "Vyberte alespoň jednu prioritu.";
    if (step === 3 && !a.sources) return "Vyberte jednu možnost.";
    if (step === 4 && !a.timeline) return "Vyberte jednu možnost.";
    if (step === 5) {
      if (a.name.trim().length < 3) return "Napište své jméno a příjmení.";
      const c = a.contact.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c) || c.replace(/\D/g, "").length >= 9;
      if (!ok) return "Zadejte platný e-mail nebo telefon (min. 9 číslic).";
    }
    return "";
  };

  const next = () => { const e = validate(); setErr(e); if (!e) setStep((s) => s + 1); };

  const submit = async () => {
    setStatus("loading"); setErr("");
    try {
      const r = await fetch("/api/submit-lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(a) });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Odeslání se nepodařilo.");
      setStatus("done");
    } catch (e) {
      setStatus("error"); setErr(e instanceof Error ? e.message : "Odeslání se nepodařilo. Zkuste to prosím znovu.");
    }
  };

  if (status === "done") return (
    <div className="card thanks" role="status">
      <h3>Děkuji, {a.name.split(" ")[0]}. Dotazník je odeslaný.</h3>
      <ol>
        <li>Prohlédnu si váš web {a.website ? `(${a.website})` : ""} a vaše odpovědi.</li>
        <li>Ozvu se vám na {a.contact}, obvykle do 1–2 pracovních dnů.</li>
        <li>Společně projdeme konkrétní úpravy, které přinesou víc poptávek.</li>
      </ol>
    </div>
  );

  const qk = (["situation", "priorities", "sources", "timeline"] as QKey[])[step - 1];

  return (
    <div className="card">
      <div className="progress" aria-label={`Krok ${step} z ${TOTAL}`}>
        <span>Krok {step} z {TOTAL}</span>
        <div className="track"><div style={{ width: `${(step / TOTAL) * 100}%` }} /></div>
      </div>

      {step <= 4 && (
        <fieldset>
          <legend>{Q[qk].title}</legend>
          {Q[qk].multi && <p className="hint">Můžete vybrat více možností.</p>}
          <div className="opts">
            {Q[qk].opts.map((o) => {
              const sel = qk === "priorities" ? a.priorities.includes(o) : a[qk] === o;
              return (
                <button type="button" key={o} className={`opt ${sel ? "sel" : ""}`} aria-pressed={sel} onClick={() => pick(qk, o)}>
                  <span className="mark" aria-hidden>{sel ? "✓" : ""}</span>{o}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {step === 5 && (
        <fieldset>
          <legend>Kde si můžeme váš současný web prohlédnout a kam se vám ozvat?</legend>
          <label>Odkaz na váš web (nebo název firmy) <small>nepovinné</small>
            <input value={a.website} onChange={(e) => setA({ ...a, website: e.target.value })} autoComplete="url" /></label>
          <label>Jméno a příjmení
            <input value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} autoComplete="name" required /></label>
          <label>E-mail nebo telefon
            <input value={a.contact} onChange={(e) => setA({ ...a, contact: e.target.value })} autoComplete="email" required /></label>
          <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden value={a.company_fax} onChange={(e) => setA({ ...a, company_fax: e.target.value })} />
        </fieldset>
      )}

      {step === 6 && (
        <fieldset>
          <legend>Chcete se na něco předem zeptat nebo nám cokoliv vzkázat, abychom se na schůzku mohli co nejlépe připravit?</legend>
          <textarea rows={5} maxLength={2000} value={a.message} onChange={(e) => setA({ ...a, message: e.target.value })}
            placeholder="Např. jakou službu chcete nejvíc podpořit, co vám na současném webu nejvíc vadí nebo na co se chcete zaměřit…" />
        </fieldset>
      )}

      {err && <p className="err" role="alert">{err}</p>}

      <div className="nav">
        {step > 1 && <button type="button" className="btn ghost" onClick={() => { setErr(""); setStep(step - 1); }} disabled={status === "loading"}>Zpět</button>}
        {step < TOTAL
          ? <button type="button" className="btn" onClick={next}>Pokračovat</button>
          : <button type="button" className="btn" onClick={submit} disabled={status === "loading"}>
              {status === "loading" ? "Odesílám…" : "Odeslat a domluvit krátkou schůzku"}</button>}
      </div>
    </div>
  );
}

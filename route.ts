import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const clip = (s: unknown, n: number) => String(s ?? "").trim().slice(0, n);

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Neplatná data." }, { status: 400 }); }

  // Honeypot: boti vyplní skryté pole, tváříme se, že vše proběhlo.
  if (b.company_fax) return NextResponse.json({ ok: true });

  const name = clip(b.name, 120);
  const contact = clip(b.contact, 160);
  const situation = clip(b.situation, 200);
  const sources = clip(b.sources, 200);
  const timeline = clip(b.timeline, 200);
  const website = clip(b.website, 300);
  const message = clip(b.message, 2000);
  const priorities = Array.isArray(b.priorities) ? b.priorities.map((p) => clip(p, 200)).slice(0, 4) : [];

  const contactOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact) || contact.replace(/\D/g, "").length >= 9;
  if (name.length < 3 || !contactOk || !situation || !sources || !timeline || priorities.length === 0) {
    return NextResponse.json({ error: "Zkontrolujte prosím vyplněné údaje." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Chybí RESEND_API_KEY");
    return NextResponse.json({ error: "Odesílání není nastavené. Zkuste to později." }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const to = process.env.NOTIFICATION_EMAIL || "laskakrystof3@gmail.com";
  const from = process.env.RESEND_FROM || "Web dotazník <onboarding@resend.dev>";

  const rows: [string, string][] = [
    ["1. Situace s webem", situation],
    ["2. Priority", priorities.join("\n")],
    ["3. Zdroje zákazníků", sources],
    ["4. Časový horizont", timeline],
    ["5a. Web / firma", website || "neuvedeno"],
    ["5b. Jméno", name],
    ["5c. E-mail / telefon", contact],
    ["6. Dotaz / vzkaz", message || "neuvedeno"],
  ];

  const html = `<div style="font-family:Arial,sans-serif;max-width:640px">
    <h2>Nový dotazník z webu: ${esc(name)}</h2>
    <table style="border-collapse:collapse;width:100%">${rows.map(([k, v]) =>
      `<tr><td style="padding:8px 12px;border-bottom:1px solid #e3e8ee;font-weight:bold;vertical-align:top;width:35%">${esc(k)}</td>
       <td style="padding:8px 12px;border-bottom:1px solid #e3e8ee;white-space:pre-line">${esc(v)}</td></tr>`).join("")}
    </table></div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const replyTo = contact.includes("@") ? contact : undefined;
  const { error } = await resend.emails.send({
    from, to: [to], subject: `Nový dotazník z webu: ${name}`, html, text, ...(replyTo && { replyTo }),
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "E-mail se nepodařilo odeslat. Zkuste to prosím znovu." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

import Questionnaire from "./Questionnaire";

const compare = [
  ["Nejasný slib nahoře: návštěvník nepochopí, co nabízíte.", "Nadpis říká, komu pomáháte a s čím, hned na první obrazovce."],
  ["Kontakt schovaný v menu nebo na konci stránky.", "Jedno hlavní tlačítko je vidět na každé obrazovce, i na mobilu."],
  ["Slabá důvěra: žádné reference, čísla ani tváře.", "Reference, konkrétní výsledky a jména jsou u každé nabídky."],
  ["Zdlouhavá poptávka s deseti poli.", "Poptávka zabere minutu a ptá se jen na to nejdůležitější."],
];
const leaks = [
  ["První obrazovka", "Za 5 sekund musí být jasné, co nabízíte, pro koho a co má návštěvník udělat dál."],
  ["Cesta k poptávce", "Každý klik navíc ubírá zájemce. Poptávka by měla být na dosah z každé části stránky."],
  ["Důvěra a reference", "Lidé nekupují od neznámých. Chybí recenze, fotky z práce, IČO, adresa, konkrétní čísla."],
  ["Mobil a odeslání", "Většina návštěv jde z telefonu. Malá tlačítka, pomalé načítání a dlouhý formulář zákazníka odradí."],
];
const steps = [
  ["Vyplníte klikací dotazník", "Šest rychlých otázek, zabere asi minutu."],
  ["Já si prohlédnu váš web", "Projdu první obrazovku, cestu k poptávce, důvěru a mobil."],
  ["Domluvíme se na úpravách", "Věcný hovor nebo schůzka nad konkrétními kroky, které přinesou poptávky."],
];

export default function Home() {
  return (
    <main>
      <header className="bar">
        <span className="logo">Web na zakázky</span>
        <a className="btn btn-sm" href="#dotaznik">Vyplnit dotazník</a>
      </header>

      <section className="hero wrap">
        <h1>Z webu, který jen visí na internetu, uděláme nástroj na poptávky.</h1>
        <p className="lead">Navrhuji a upravuji weby tak, aby návštěvník rychle pochopil nabídku, získal důvěru a poslal poptávku, i z mobilu.</p>
        <a className="btn" href="#dotaznik">Vyplnit krátký dotazník</a>
        <p className="hint">Vyplnění zabere zhruba 1 minutu. Nezávazně.</p>
      </section>

      <section className="wrap sec">
        <h2>Vizitka vs. web na zakázky</h2>
        <p className="sub">Většina webů zájemce ztratí dřív, než se ozve. Funkční struktura to mění.</p>
        <div className="compare">
          <div className="col bad"><h3>Web jako vizitka</h3><ul>{compare.map((r) => <li key={r[0]}>{r[0]}</li>)}</ul></div>
          <div className="col good"><h3>Web na zakázky</h3><ul>{compare.map((r) => <li key={r[1]}>{r[1]}</li>)}</ul></div>
        </div>
      </section>

      <section className="wrap sec">
        <h2>Kde se nejčastěji ztrácí zakázky</h2>
        <div className="leaks">
          {leaks.map(([t, d]) => (<article key={t}><h3>{t}</h3><p>{d}</p></article>))}
        </div>
      </section>

      <section className="wrap sec">
        <h2>Jak spolupráce probíhá</h2>
        <ol className="steps">
          {steps.map(([t, d]) => (<li key={t}><h3>{t}</h3><p>{d}</p></li>))}
        </ol>
      </section>

      <section id="dotaznik" className="wrap sec form-sec">
        <h2>Krátký dotazník</h2>
        <p className="sub">Díky odpovědím se na schůzku připravím konkrétně na váš web.</p>
        <Questionnaire />
      </section>

      <footer className="wrap foot">© {new Date().getFullYear()} Web na zakázky</footer>
    </main>
  );
}

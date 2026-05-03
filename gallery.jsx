// Gallery page — Nichola Lighting + Design
const { useState, useEffect, useRef } = React;

// ---------- Reveal-on-scroll ----------
const Reveal = ({ children, delay = 0, as: As = "div", className = "", style = {} }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <As ref={ref} className={className} style={{
      ...style,
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 1.1s cubic-bezier(.2,.6,.2,1) ${delay}ms, transform 1.1s cubic-bezier(.2,.6,.2,1) ${delay}ms`,
      willChange: "opacity, transform",
    }}>{children}</As>
  );
};

// ---------- Palette (matches homepage ivory) ----------
const PAL = {
  bg: "#FFFFFF",
  surface: "#F5EFE3",
  surfaceInk: "#1A1816",
  surfaceMuted: "#6B6258",
  surfaceLine: "#E8E2D4",
  ink: "#1A1816",
  muted: "#6B6258",
  accent: "#A88A5C",
  line: "#E8E2D4",
  placeholderTone: "warm",
};

// ---------- Project data ----------
const PROJECTS = {
  "aman-east-57th": {
    num: "01",
    title: "Aman — East 57th",
    titleItalic: "East 57th",
    loc: "New York, NY",
    cat: "Hospitality · Lobby",
    year: "2025",
    architect: "Denniston International",
    client: "Aman Hotels & Resorts",
    scope: "Lobby, lounge, vertical circulation",
    ctemp: "2700K · CRI 95",
    intro: "A 26-story landmark tower reimagined as urban sanctuary. Our scope covered the ground-floor lobby, lounge, and vertical circulation — a sequence of brass-clad thresholds that needed to feel candle-lit at 2pm and at midnight.",
    body: "We layered an integrated cove behind every architectural reveal, paired with low-output sculptural pendants by the studio's bespoke arm. The dim-to-warm specification holds at CRI 95 from 2700K down to 1800K, allowing the brass to read as molten at every hour. Daylight harvesting was deliberately rejected; the hotel asked for a held breath, not a circadian one.",
    images: [
      { label: "lobby — entry threshold, dimmed cove", ratio: "16 / 10", tall: false },
      { label: "lounge — sculptural pendant, brass detail", ratio: "3 / 4", tall: true },
      { label: "stair — graze wash on travertine", ratio: "3 / 4", tall: true },
      { label: "lobby — long view, evening", ratio: "16 / 9", tall: false, full: true },
      { label: "ceiling detail — integrated cove + pendant", ratio: "4 / 3", tall: false },
      { label: "elevator vestibule — accent on art", ratio: "4 / 3", tall: false },
    ],
  },
  "bergdorf-floor-5": {
    num: "02",
    title: "Bergdorf — Floor 5",
    titleItalic: "Floor 5",
    loc: "New York, NY",
    cat: "Retail · Flagship",
    year: "2024",
    architect: "Levin & Associates",
    client: "Bergdorf Goodman",
    scope: "Designer apparel floor, fitting suites",
    ctemp: "3000K · CRI 97",
    intro: "A merchandised floor at one of the most photographed retail addresses in America. The brief was unusually clean: make the clothes look like the clothes, and make the customers look like themselves.",
    body: "We removed the existing track and replaced it with a trackless ceiling of recessed, individually addressable accents on a 600mm grid. Color rendering holds at CRI 97 across the entire floor, with R9 prioritized for the reds that move the season. Fitting suites use a separate 3000K + 2200K dual-tone scheme, calibrated against window light.",
    images: [
      { label: "designer floor — long view", ratio: "16 / 9", tall: false, full: true },
      { label: "merchandising vignette — accent wash", ratio: "4 / 3", tall: false },
      { label: "fitting suite — dual-tone", ratio: "3 / 4", tall: true },
      { label: "ceiling detail — trackless grid", ratio: "3 / 4", tall: true },
      { label: "perimeter — graze on stone", ratio: "4 / 3", tall: false },
    ],
  },
  "public-library-branch-4": {
    num: "03",
    title: "Public Library, Branch 4",
    titleItalic: "Branch 4",
    loc: "Mount Vernon, NY",
    cat: "Civic · Architectural",
    year: "2024",
    architect: "City of Mount Vernon",
    client: "Mount Vernon Public Library",
    scope: "Reading hall, stacks, children's wing",
    ctemp: "2700K · CRI 90",
    intro: "Our home branch. A 1923 reading hall that had been wrapped in 4000K troffers since the 1970s — readable, but unwelcoming. We were asked to bring back the room without losing the lumen levels the librarians depend on.",
    body: "A continuous linear cove, recessed into restored plaster, lifts the original coffered ceiling. Stack-aisle fixtures use a custom asymmetric reflector to deliver IES-grade vertical illuminance to the bottom shelf without spilling onto faces. The children's wing is its own scheme: warmer, lower, and entirely free of glare from the perspective of a four-year-old.",
    images: [
      { label: "reading hall — long axis", ratio: "16 / 9", tall: false, full: true },
      { label: "stacks — asymmetric vertical wash", ratio: "3 / 4", tall: true },
      { label: "children's wing — low ambient", ratio: "4 / 3", tall: false },
      { label: "study carrel — task light detail", ratio: "4 / 3", tall: false },
      { label: "facade — evening, civic glow", ratio: "16 / 10", tall: false, full: true },
    ],
  },
  "maison-pierre": {
    num: "04",
    title: "Maison Pierre",
    titleItalic: "Pierre",
    loc: "Brooklyn, NY",
    cat: "Restaurant · Hospitality",
    year: "2025",
    architect: "Studio Foundry",
    client: "Maison Pierre Restaurant Group",
    scope: "Main dining, private dining, bar",
    ctemp: "2400K · CRI 95",
    intro: "A 60-seat dining room behind an unremarkable Brooklyn façade. The chef wanted the food on the plate to be the brightest thing in the room, and for the conversation to feel two volumes quieter as a result.",
    body: "Every fixture is on a 0–10V dimmer grouped to a single iPad. We held the plate at 200 lux and the face at 80 lux — a ratio that has done more for the restaurant's reputation than the pricing has. The bar uses a separate 2200K candle-spec scheme and is the only place in the room with hard shadow.",
    images: [
      { label: "main dining — dimmed", ratio: "16 / 9", tall: false, full: true },
      { label: "private dining — 6-top", ratio: "3 / 4", tall: true },
      { label: "bar — candle-spec, low key", ratio: "3 / 4", tall: true },
      { label: "table detail — plate at 200 lux", ratio: "4 / 3", tall: false },
    ],
  },
  "brookfield-place": {
    num: "05",
    title: "Brookfield Place — South Atrium",
    titleItalic: "South Atrium",
    loc: "New York, NY",
    cat: "Commercial · Architectural",
    year: "2023",
    architect: "Pelli Clarke Pelli",
    client: "Brookfield Properties",
    scope: "South atrium façade & interior wash",
    ctemp: "3500K · CRI 90 · DMX",
    intro: "A 200,000 sq ft glass atrium overlooking the Hudson — a daylit space for ten hours and a glowing one for the rest. The challenge was holding the architecture readable from the riverwalk without lighting the interior like a parking deck.",
    body: "We grazed the limestone columns from below with custom 24° narrow optics, then laid a low-output ambient wash across the soffit at 3500K. The full system is on DMX with three preset scenes — daylight handoff, dusk, and event — calibrated against Pelli's original façade studies.",
    images: [
      { label: "atrium — south face, dusk", ratio: "16 / 9", tall: false, full: true },
      { label: "column graze — narrow optic detail", ratio: "3 / 4", tall: true },
      { label: "soffit wash — ambient", ratio: "4 / 3", tall: false },
      { label: "riverwalk view — evening", ratio: "16 / 10", tall: false, full: true },
      { label: "control rack — DMX detail", ratio: "4 / 3", tall: false },
    ],
  },
  "the-surrey": {
    num: "06",
    title: "The Surrey",
    titleItalic: "Surrey",
    loc: "New York, NY",
    cat: "Hospitality · Suite",
    year: "2024",
    architect: "Champalimaud Design",
    client: "Corinthia Hotels",
    scope: "Suite levels, corridor, residential floor",
    ctemp: "2700K · CRI 95",
    intro: "190 keys on the Upper East Side. Our scope was the suite levels — every fixture, every dimmer, every reading lamp — on a brief that asked us to specify like the rooms were private residences.",
    body: "We worked from the bedside outward. Each suite has eight independently-dimmed circuits and a one-button 'goodnight' scene that drops every fixture in the room except a single 5W reading sconce. The corridor scheme is its own quiet thing — low ambient, deeply shielded — so the door of the suite is the brightest moment between elevator and bed.",
    images: [
      { label: "suite — bedside, layered ambient", ratio: "16 / 9", tall: false, full: true },
      { label: "bath — vanity scheme, 2700K", ratio: "3 / 4", tall: true },
      { label: "corridor — low ambient", ratio: "3 / 4", tall: true },
      { label: "living room — evening", ratio: "4 / 3", tall: false },
      { label: "dimmer detail — bedside scenes", ratio: "4 / 3", tall: false },
    ],
  },
};

// ---------- Order for prev/next navigation ----------
const ORDER = ["aman-east-57th", "bergdorf-floor-5", "public-library-branch-4", "maison-pierre", "brookfield-place", "the-surrey"];

// ---------- Placeholder ----------
const Placeholder = ({ label, ratio = "4 / 3", style = {} }) => (
  <div style={{
    position: "relative", width: "100%", aspectRatio: ratio,
    background: "#E8DFD0", overflow: "hidden", ...style,
  }}>
    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100"
      style={{ position: "absolute", inset: 0, display: "block" }}>
      <defs>
        <pattern id="g-stripes" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#DCD0BB" strokeWidth="3" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#g-stripes)" />
    </svg>
    <div style={{
      position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontSize: 11, letterSpacing: "0.12em", color: "#7A6B52",
      textTransform: "uppercase", textAlign: "center", padding: "0 16px", whiteSpace: "nowrap",
    }}>{label}</div>
  </div>
);

// ---------- Nav (matches homepage) ----------
const Nav = () => (
  <header style={{
    position: "sticky", top: 0, zIndex: 40,
    background: "#FFFFFFE6", backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderBottom: `1px solid ${PAL.line}`,
  }}>
    <div style={{
      maxWidth: 1480, margin: "0 auto", padding: "20px 48px",
      display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 24,
    }}>
      <nav style={{ display: "flex", gap: 32, fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: PAL.ink }}>
        <a href="index.html#work" style={{ color: "inherit", textDecoration: "none" }}>Work</a>
        <a href="index.html#studio" style={{ color: "inherit", textDecoration: "none" }}>Studio</a>
        <a href="index.html#services" style={{ color: "inherit", textDecoration: "none" }}>Services</a>
      </nav>
      <a href="index.html" style={{ textDecoration: "none", color: PAL.ink, textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, letterSpacing: "0.32em", textTransform: "uppercase", lineHeight: 1 }}>Nichola</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, letterSpacing: "0.18em", color: PAL.muted, marginTop: 4 }}>lighting</div>
      </a>
      <nav style={{ display: "flex", gap: 32, justifyContent: "flex-end", fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: PAL.ink }}>
        <a href="index.html#contact" style={{ color: "inherit", textDecoration: "none" }}>Contact</a>
        <a href="index.html#contact" style={{ color: PAL.accent, textDecoration: "none" }}>Inquire ↗</a>
      </nav>
    </div>
  </header>
);

// ---------- Not found ----------
const NotFound = () => (
  <div style={{ background: PAL.bg, padding: "200px 48px", textAlign: "center" }}>
    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: PAL.muted, marginBottom: 24 }}>◦ 404</div>
    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(48px, 8vw, 128px)", lineHeight: 0.95, color: PAL.ink, margin: "0 0 32px" }}>
      Project <em style={{ fontStyle: "italic" }}>not found</em>.
    </h1>
    <a href="index.html#work" style={{
      fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.24em", textTransform: "uppercase",
      color: PAL.ink, textDecoration: "none", borderBottom: `1px solid ${PAL.ink}`, paddingBottom: 6,
    }}>← Return to Selected Work</a>
  </div>
);

// ---------- Gallery ----------
const Gallery = ({ p, slug }) => {
  const idx = ORDER.indexOf(slug);
  const next = ORDER[(idx + 1) % ORDER.length];
  const prev = ORDER[(idx - 1 + ORDER.length) % ORDER.length];
  const nextP = PROJECTS[next];
  const prevP = PROJECTS[prev];

  return (
    <div style={{ background: PAL.bg, color: PAL.ink, minHeight: "100vh" }}>
      <Nav />

      {/* Breadcrumb / back */}
      <div style={{ maxWidth: 1480, margin: "0 auto", padding: "32px 48px 0" }}>
        <Reveal>
          <a href="index.html#work" style={{
            fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
            color: PAL.muted, textDecoration: "none",
          }}>← Selected Work · {p.num} / 06</a>
        </Reveal>
      </div>

      {/* Title block */}
      <section style={{ padding: "80px 48px 64px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <Reveal>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: PAL.muted, marginBottom: 32 }}>
              ◦ {p.cat} · {p.year}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
              fontSize: "clamp(64px, 10vw, 160px)", lineHeight: 0.94, letterSpacing: "-0.02em",
              color: PAL.ink, margin: 0, textWrap: "balance", maxWidth: 1300,
            }}>
              {p.title.replace(p.titleItalic, "")}<em style={{ fontStyle: "italic" }}>{p.titleItalic}</em>.
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Hero image */}
      <section style={{ padding: "0 48px 80px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <Reveal delay={200}>
            <Placeholder label={p.images[0].label} ratio="16 / 9" />
          </Reveal>
        </div>
      </section>

      {/* Project facts + intro */}
      <section style={{ padding: "0 48px 120px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 96, alignItems: "start" }}>
          <Reveal>
            <dl style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.7, borderTop: `1px solid ${PAL.line}` }}>
              {[
                ["Client", p.client],
                ["Architect", p.architect],
                ["Location", p.loc],
                ["Scope", p.scope],
                ["Color temp.", p.ctemp],
                ["Year", p.year],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24, padding: "16px 0", borderBottom: `1px solid ${PAL.line}` }}>
                  <dt style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: PAL.muted }}>{k}</dt>
                  <dd style={{ margin: 0, color: PAL.ink }}>{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 400,
                fontSize: "clamp(24px, 2.4vw, 36px)", lineHeight: 1.3, color: PAL.ink,
                margin: "0 0 40px", textWrap: "balance",
              }}>
                {p.intro}
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.75, color: PAL.muted, margin: 0, maxWidth: 720 }}>
                {p.body}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gallery grid — alternating compositions */}
      <section style={{ padding: "0 48px 120px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          {(() => {
            // Skip first image (used as hero), arrange remainder into rows
            const rest = p.images.slice(1);
            const rows = [];
            let i = 0;
            while (i < rest.length) {
              const img = rest[i];
              if (img.full) {
                rows.push([img]); i += 1;
              } else if (rest[i + 1] && !rest[i + 1].full) {
                rows.push([img, rest[i + 1]]); i += 2;
              } else {
                rows.push([img]); i += 1;
              }
            }
            return rows.map((row, rIdx) => (
              <div key={rIdx} style={{
                display: "grid",
                gridTemplateColumns: row.length === 2 ? "1fr 1fr" : "1fr",
                gap: 32,
                marginBottom: 32,
              }}>
                {row.map((img, iIdx) => (
                  <Reveal key={iIdx} delay={iIdx * 100}>
                    <figure style={{ margin: 0 }}>
                      <Placeholder label={img.label} ratio={img.ratio} />
                      <figcaption style={{
                        marginTop: 14, fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                        fontSize: 11, letterSpacing: "0.08em", color: PAL.muted, textTransform: "uppercase",
                      }}>
                        {p.num}.{String(rIdx * 2 + iIdx + 2).padStart(2, "0")} — {img.label}
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            ));
          })()}
        </div>
      </section>

      {/* Pull quote */}
      <section style={{ background: PAL.surface, padding: "120px 48px", borderTop: `1px solid ${PAL.surfaceLine}`, borderBottom: `1px solid ${PAL.surfaceLine}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: PAL.surfaceMuted, marginBottom: 28 }}>
              ◦ From the studio
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
              fontSize: "clamp(28px, 3.2vw, 48px)", lineHeight: 1.22, letterSpacing: "-0.005em",
              color: PAL.surfaceInk, margin: 0, textWrap: "balance",
            }}>
              “The room had to <em style={{ fontStyle: "italic" }}>hold</em> at every hour. Light is the only material that does that without anyone noticing.”
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div style={{ marginTop: 36, fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: PAL.surfaceMuted }}>
              Nichola Duhaney · Principal
            </div>
          </Reveal>
        </div>
      </section>

      {/* Prev / Next */}
      <section style={{ padding: "120px 48px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <Reveal>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48,
              borderTop: `1px solid ${PAL.line}`, paddingTop: 48,
            }}>
              <a href={`gallery.html?p=${prev}`} style={{
                textDecoration: "none", color: "inherit",
              }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: PAL.muted, marginBottom: 14 }}>
                  ← Previous · {prevP.num}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.05, color: PAL.ink, letterSpacing: "-0.01em" }}>
                  {prevP.title}
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: PAL.muted, marginTop: 8 }}>
                  {prevP.cat} · {prevP.year}
                </div>
              </a>
              <a href={`gallery.html?p=${next}`} style={{
                textDecoration: "none", color: "inherit", textAlign: "right",
              }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: PAL.muted, marginBottom: 14 }}>
                  Next · {nextP.num} →
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.05, color: PAL.ink, letterSpacing: "-0.01em" }}>
                  {nextP.title}
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: PAL.muted, marginTop: 8 }}>
                  {nextP.cat} · {nextP.year}
                </div>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: PAL.ink, color: PAL.bg, padding: "72px 48px 36px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, alignItems: "start" }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, letterSpacing: "0.32em", textTransform: "uppercase" }}>Nichola</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, color: PAL.accent, marginTop: 6 }}>lighting</div>
            </div>
            {[
              ["Practice", ["Retail & Flagship", "Architectural", "Hospitality", "Specification"]],
              ["Studio", ["About", "Press", "Journal", "Careers"]],
              ["Connect", ["Nichola@Nicholalighting.com", "914.667.0028", "Cell · 646.281.2972", "Fax · 914.667.2893"]],
            ].map(([h, items]) => (
              <div key={h}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.6, marginBottom: 18 }}>{h}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 2.1 }}>
                  {items.map(x => <li key={x}>{x}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 96, paddingTop: 24, borderTop: `1px solid ${PAL.surface}33`, display: "flex", justifyContent: "space-between", fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.55 }}>
            <span>© 2026 Nichola Lighting, LLC</span>
            <span>Mount Vernon · New York</span>
            <span>Site by the Studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ---------- Boot ----------
function App() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("p") || "aman-east-57th";
  const project = PROJECTS[slug];

  useEffect(() => {
    document.body.style.background = PAL.bg;
    document.body.style.color = PAL.ink;
    document.title = project ? `${project.title} — Nichola Lighting` : "Project — Nichola Lighting";
  }, [project]);

  if (!project) return <><Nav /><NotFound /></>;
  return <Gallery p={project} slug={slug} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

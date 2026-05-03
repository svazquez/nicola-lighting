// Nichola Lighting + Design — homepage
const { useState, useEffect, useRef } = React;

// ---------- Reveal-on-scroll ----------
const Reveal = ({ children, delay = 0, as: As = "div", className = "", style = {} }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <As
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 1.1s cubic-bezier(.2,.6,.2,1) ${delay}ms, transform 1.1s cubic-bezier(.2,.6,.2,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </As>
  );
};

// ---------- Palette ----------
const PALETTES = {
  ivory:   { bg: "#FFFFFF", surface: "#F5EFE3", surfaceInk: "#1A1816", surfaceMuted: "#6B6258", surfaceLine: "#E8E2D4", ink: "#1A1816", muted: "#6B6258", accent: "#A88A5C", line: "#E8E2D4", placeholderTone: "warm"  },
  stone:   { bg: "#FFFFFF", surface: "#ECE9E2", surfaceInk: "#2A2723", surfaceMuted: "#6F6A60", surfaceLine: "#E2DED4", ink: "#2A2723", muted: "#6F6A60", accent: "#8C7A5F", line: "#E2DED4", placeholderTone: "cool"  },
  noir:    { bg: "#FFFFFF", surface: "#000000", surfaceInk: "#EDE5D3", surfaceMuted: "#A89578", surfaceLine: "#222222", ink: "#000000", muted: "#5A5A5A", accent: "#A88A5C", line: "#E0E0E0", placeholderTone: "dark"  },
};

// ---------- Active section hook ----------
const useActiveSection = (ids) => {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!els.length) return;

    // Pick the section whose top is closest to (but past) ~30% from the top of the viewport.
    const onScroll = () => {
      const probe = window.innerHeight * 0.3;
      let current = null;
      for (const el of els) {
        const rect = el.getBoundingClientRect();
        if (rect.top - probe <= 0 && rect.bottom - probe > 0) {
          current = el.id;
          break;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids.join("|")]);
  return active;
};

// ---------- Nav ----------
const NavLink = ({ href, active, color, children }) => (
  <a
    href={href}
    style={{
      color: "inherit",
      textDecoration: "none",
      position: "relative",
      paddingBottom: 4,
      borderBottom: `1px solid ${active ? color : "transparent"}`,
      transition: "border-color 0.35s ease",
    }}
  >
    {children}
  </a>
);

const Nav = ({ pal }) => {
  const active = useActiveSection(["work", "studio", "services", "contact"]);
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid #222222",
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          padding: "20px 48px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 24,
        }}
      >
        <nav style={{ display: "flex", gap: 32, fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFFFFF" }}>
          <NavLink href="#work" active={active === "work"} color="#FFFFFF">Work</NavLink>
          <NavLink href="#studio" active={active === "studio"} color="#FFFFFF">Studio</NavLink>
          <NavLink href="#services" active={active === "services"} color="#FFFFFF">Services</NavLink>
        </nav>
        <a href="#" style={{ textDecoration: "none", color: "#FFFFFF", textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, letterSpacing: "0.32em", textTransform: "uppercase", lineHeight: 1 }}>
            Nichola
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, letterSpacing: "0.18em", color: pal.accent, marginTop: 4 }}>
            lighting
          </div>
        </a>
        <nav style={{ display: "flex", gap: 32, justifyContent: "flex-end", fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFFFFF" }}>
          <a href="journal.html" style={{ color: "inherit", textDecoration: "none" }}>Journal</a>
          <NavLink href="#contact" active={active === "contact"} color="#FFFFFF">Contact</NavLink>
          <a href="#contact" style={{ color: pal.accent, textDecoration: "none" }}>Inquire ↗</a>
        </nav>
      </div>
    </header>
  );
};

// ---------- Hero variants ----------
const HeroA = ({ pal }) => (
  // Type-forward, light hero with small image insets
  <section style={{ padding: "120px 48px 100px", background: pal.bg, position: "relative", overflow: "hidden" }}>
    <div style={{ maxWidth: 1480, margin: "0 auto" }}>
      <Reveal>
        <div style={{ display: "flex", gap: 14, alignItems: "center", justifyContent: "center", marginBottom: 56, fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: pal.muted }}>
          <span style={{ width: 32, height: 1, background: pal.line }}></span>
          Est. Mount Vernon, NY
          <span style={{ width: 32, height: 1, background: pal.line }}></span>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: "clamp(64px, 10vw, 168px)",
          lineHeight: 0.92,
          letterSpacing: "-0.02em",
          color: pal.ink,
          textAlign: "center",
          margin: 0,
        }}>
          LIGHT <em style={{ fontStyle: "italic", fontWeight: 400 }}>as</em><br />
          ARCHITECTURE,<br />
          <em style={{ fontStyle: "italic", fontWeight: 400 }}>not</em> ORNAMENT.
        </h1>
      </Reveal>
      <Reveal delay={300}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 48, alignItems: "end", marginTop: 80 }}>
          <div style={{ width: 220, justifySelf: "start" }}>
            <Placeholder label="facade — bryant park" ratio="4 / 5" tone={pal.placeholderTone} />
          </div>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            lineHeight: 1.6,
            color: pal.muted,
            maxWidth: 460,
            textAlign: "center",
            margin: 0,
          }}>
            A lighting design studio shaping retail, commercial, and architectural spaces across the Northeast. Twenty-three years quietly making rooms feel inevitable.
          </p>
          <div style={{ width: 220, justifySelf: "end" }}>
            <Placeholder label="retail — flagship" ratio="4 / 5" tone={pal.placeholderTone} />
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

const HeroB = ({ pal }) => (
  // Full-bleed interior with overlaid display type — dark image, white text
  <section style={{ position: "relative", height: "100vh", minHeight: 720, background: "#0D0C0A", overflow: "hidden" }}>
    <img
      src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=2400&q=80"
      alt="Dark moody architectural interior with dramatic lighting"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.55) contrast(1.05) saturate(0.7)" }}
    />
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.55) 100%)",
    }}/>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "80px 48px 56px" }}>
      <Reveal>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
          ◦ Selected work — 2024 / 2025
        </div>
      </Reveal>
      <div style={{ maxWidth: 1480, margin: "0 auto", width: "100%" }}>
        <Reveal delay={150}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: "clamp(72px, 11vw, 192px)",
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            color: "#F4EFE7",
            margin: 0,
          }}>
            We design <em style={{ fontStyle: "italic" }}>the</em><br />
            way a room<br />
            <em style={{ fontStyle: "italic" }}>remembers</em> you.
          </h1>
        </Reveal>
      </div>
      <Reveal delay={400}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "end", gap: 48, color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          <div>Mount Vernon, NY</div>
          <div style={{ textAlign: "center" }}>Retail · Commercial · Architectural</div>
          <div style={{ textAlign: "right", color: "#A88A5C" }}>Scroll ↓</div>
        </div>
      </Reveal>
    </div>
  </section>
);

const HeroC = ({ pal }) => (
  // Split — huge type left, tall image right
  <section style={{ background: pal.bg, padding: "80px 48px 100px" }}>
    <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 64, alignItems: "stretch" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingTop: 40 }}>
        <Reveal>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: pal.muted, marginBottom: 32 }}>
            Nichola Lighting — Est. 2003
          </div>
        </Reveal>
        <Reveal delay={150}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: "clamp(64px, 8.5vw, 156px)",
            lineHeight: 0.94,
            letterSpacing: "-0.02em",
            color: pal.ink,
            margin: "0 0 48px",
          }}>
            COMMERCIAL<br />
            LIGHTING <em style={{ fontStyle: "italic", fontWeight: 400 }}>with</em><br />
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>a</em> RESIDENTIAL<br />
            CONSCIENCE.
          </h1>
        </Reveal>
        <Reveal delay={350}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "end" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.65, color: pal.muted, maxWidth: 440, margin: 0 }}>
              Founded by Nichola Duhaney. Twenty-three years lighting flagships, façades, and the quiet thresholds in between — from a studio in Mount Vernon, NY.
            </p>
            <a href="#work" style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: pal.ink,
              textDecoration: "none",
              borderBottom: `1px solid ${pal.ink}`,
              paddingBottom: 6,
              whiteSpace: "nowrap",
            }}>View Selected Work →</a>
          </div>
        </Reveal>
      </div>
      <Reveal delay={250}>
        <div style={{ height: "100%", minHeight: 680 }}>
          <Placeholder label="retail flagship — madison ave" ratio="auto" tone={pal.placeholderTone} style={{ aspectRatio: "auto", height: "100%" }} />
        </div>
      </Reveal>
    </div>
  </section>
);

// ---------- Marquee ----------
const Marquee = ({ pal }) => {
  const items = ["Bergdorf Goodman", "ICON Hotels", "Aman New York", "Public Library Branch No. 4", "Met Breuer", "Maison Pierre", "Brookfield Place", "The Surrey"];
  return (
    <section style={{ background: pal.surface, borderTop: `1px solid ${pal.surfaceLine}`, borderBottom: `1px solid ${pal.surfaceLine}`, padding: "28px 0", overflow: "hidden" }}>
      <div style={{
        display: "flex",
        gap: 64,
        whiteSpace: "nowrap",
        animation: "nl-marquee 48s linear infinite",
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontSize: 22,
        color: pal.surfaceInk,
      }}>
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 64 }}>
            {it}
            <span style={{ width: 6, height: 6, borderRadius: 99, background: pal.accent, opacity: 0.6 }} />
          </span>
        ))}
      </div>
    </section>
  );
};

// ---------- Featured Work ----------
const projects = [
  { num: "01", slug: "aman-east-57th",          title: "Aman \u2014 East 57th",       loc: "New York, NY",  cat: "Hospitality / Lobby", year: "2025", label: "lobby \u2014 brass cove + sculptural pendant", tall: true,  ratio: "3 / 4" },
  { num: "02", slug: "bergdorf-floor-5",         title: "Bergdorf \u2014 Floor 5",      loc: "New York, NY",  cat: "Retail / Flagship",   year: "2024", label: "retail floor \u2014 trackless wash + accents", tall: false, ratio: "4 / 3" },
  { num: "03", slug: "public-library-branch-4",  title: "Public Library, Branch 4",     loc: "Mount Vernon, NY", cat: "Civic / Architectural", year: "2024", label: "reading hall \u2014 linear cove, 2700K",   tall: false, ratio: "4 / 3" },
  { num: "04", slug: "maison-pierre",            title: "Maison Pierre",                loc: "Brooklyn, NY",  cat: "Restaurant / Hospitality", year: "2025", label: "private dining \u2014 dimmed glow",         tall: true,  ratio: "3 / 4" },
  { num: "05", slug: "brookfield-place",         title: "Brookfield Place \u2014 South Atrium", loc: "New York, NY", cat: "Commercial / Architectural", year: "2023", label: "atrium fa\u00e7ade \u2014 grazing wash",      tall: true,  ratio: "3 / 4" },
  { num: "06", slug: "the-surrey",               title: "The Surrey",                   loc: "New York, NY",  cat: "Hospitality / Suite", year: "2024", label: "suite \u2014 layered ambient",              tall: false, ratio: "4 / 3" },
];

const ProjectCard = ({ p, pal, index }) => {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={(index % 3) * 120}>
      <a
        href={`gallery.html?p=${p.slug}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "block",
          color: pal.ink,
          textDecoration: "none",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "relative",
          overflow: "hidden",
          transform: hover ? "scale(1.0)" : "scale(1.0)",
        }}>
          <div style={{
            transition: "transform 1.4s cubic-bezier(.2,.6,.2,1), filter 0.6s ease",
            transform: hover ? "scale(1.04)" : "scale(1)",
            filter: hover ? "brightness(0.78)" : "brightness(1)",
          }}>
            <Placeholder label={p.label} ratio="4 / 3" tone={pal.placeholderTone} />
          </div>
          {/* hover overlay caption */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            padding: 32,
            color: "#F4EFE7",
            opacity: hover ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
          }}>
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 12, color: "#D9B27A" }}>
                ↗ View Case Study
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, lineHeight: 1.05, marginBottom: 8, transform: hover ? "translateY(0)" : "translateY(8px)", transition: "transform 0.6s cubic-bezier(.2,.6,.2,1)" }}>
                <em style={{ fontStyle: "italic" }}>{p.cat.split(" / ")[0]}</em> · {p.cat.split(" / ")[1]}
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, letterSpacing: "0.06em", color: "#EDE5D3", maxWidth: 360 }}>
                Layered scheme: ambient + accent + decorative. {p.year}.
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "baseline", marginTop: 20 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.18em", color: pal.muted }}>{p.num}</span>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, lineHeight: 1.15, letterSpacing: "-0.005em" }}>
              {p.title.includes("\u2014") ? (
                <>
                  {p.title.split("\u2014")[0]}
                  <em style={{ fontStyle: "italic" }}>—{p.title.split("\u2014")[1]}</em>
                </>
              ) : p.title}
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: pal.muted, marginTop: 6 }}>
              {p.loc} · {p.cat}
            </div>
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 18, color: pal.muted }}>{p.year}</span>
        </div>
      </a>
    </Reveal>
  );
};

const FeaturedWork = ({ pal }) => (
  <section id="work" style={{ background: pal.bg, padding: "140px 48px 120px" }}>
    <div style={{ maxWidth: 1480, margin: "0 auto" }}>
      <Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "end", marginBottom: 80, gap: 48 }}>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: pal.muted, marginBottom: 24 }}>
              ◦ Selected Work / 2023 — 2025
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: "clamp(48px, 6vw, 96px)",
              lineHeight: 0.96,
              letterSpacing: "-0.02em",
              color: pal.ink,
              margin: 0,
            }}>
              A quiet record <em style={{ fontStyle: "italic" }}>of</em><br />
              rooms we&apos;ve <em style={{ fontStyle: "italic" }}>tuned</em>.
            </h2>
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, lineHeight: 1.65, color: pal.muted, maxWidth: 420, justifySelf: "end", margin: 0 }}>
            We work primarily in retail and architectural lighting — flagships, façades, civic interiors. Each project begins on site, ends on a dimmer.
          </p>
        </div>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48, rowGap: 80 }}>
        <ProjectCard p={projects[0]} pal={pal} index={0} />
        <ProjectCard p={projects[1]} pal={pal} index={1} />
        <ProjectCard p={projects[2]} pal={pal} index={2} />
        <ProjectCard p={projects[3]} pal={pal} index={3} />
        <ProjectCard p={projects[4]} pal={pal} index={4} />
        <ProjectCard p={projects[5]} pal={pal} index={5} />
      </div>
      <Reveal delay={120}>
        <div style={{ textAlign: "center", marginTop: 120 }}>
          <a href="#" style={{
            fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase",
            color: pal.ink, textDecoration: "none", borderBottom: `1px solid ${pal.ink}`, paddingBottom: 8,
          }}>The Full Index — 47 Projects ↗</a>
        </div>
      </Reveal>
    </div>
  </section>
);

// ---------- Studio / About ----------
const Studio = ({ pal }) => (
  <section id="studio" style={{ background: pal.surface, padding: "140px 48px", borderTop: `1px solid ${pal.surfaceLine}` }}>
    <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 96, alignItems: "start" }}>
      <Reveal>
        <div style={{ position: "sticky", top: 120 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: pal.surfaceMuted, marginBottom: 24 }}>
            ◦ Studio
          </div>
          <Placeholder label="nichola duhaney — portrait" ratio="4 / 5" tone={pal.placeholderTone} />
          <div style={{ marginTop: 24, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 20, color: pal.surfaceInk }}>
            Nichola Duhaney
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: pal.surfaceMuted, marginTop: 4 }}>
            President &amp; CEO · Founder
          </div>
        </div>
      </Reveal>
      <div>
        <Reveal delay={120}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: "clamp(44px, 5.4vw, 84px)",
            lineHeight: 1.02,
            letterSpacing: "-0.015em",
            color: pal.surfaceInk,
            margin: "0 0 48px",
            textWrap: "balance",
          }}>
            Light is the last <em style={{ fontStyle: "italic" }}>material</em> a building <em style={{ fontStyle: "italic" }}>receives</em> — and the first one its visitors <em style={{ fontStyle: "italic" }}>feel</em>.
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, fontFamily: "Inter, sans-serif", fontSize: 15, lineHeight: 1.7, color: pal.surfaceMuted }}>
            <p style={{ margin: 0 }}>
              Nichola Lighting is an independent studio founded by Nichola Duhaney in 2003, based in Mount Vernon, New York. We work alongside architects, owners, and operators on retail flagships, hospitality interiors, and civic façades — primarily across the Eastern seaboard.
            </p>
            <p style={{ margin: 0 }}>
              The work is quiet on purpose. We are not interested in fixtures that announce themselves; we are interested in the second the room stops feeling like a room and starts feeling like a place. Twenty-three years in, that interest has not moved.
            </p>
          </div>
        </Reveal>
        <Reveal delay={300}>
          <div style={{ marginTop: 96, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, borderTop: `1px solid ${pal.surfaceLine}`, paddingTop: 48 }}>
            {[
              ["23", "Years"],
              ["140+", "Built projects"],
              ["6", "Designers on staff"],
              ["3", "IES awards"],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, lineHeight: 1, color: pal.surfaceInk, fontWeight: 400 }}>
                  {n}
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: pal.surfaceMuted, marginTop: 12 }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

// ---------- Services ----------
const Services = ({ pal }) => {
  const list = [
    { num: "01", t: "Retail & Flagship", body: "Concept-to-commission lighting design for flagships, showrooms, and merchandised environments. Color rendering, accenting strategy, and dim-to-warm specification." },
    { num: "02", t: "Architectural & Façade", body: "Exterior grazing, integrated cove, and dynamic schemes for civic, commercial, and mixed-use buildings. Photometric modeling and dark-sky compliance." },
    { num: "03", t: "Hospitality Interiors", body: "Layered ambient/accent/decorative schemes for hotels, restaurants, and lobbies — calibrated for circadian shift across the day." },
    { num: "04", t: "Specification & Documentation", body: "Construction-ready packages: fixture schedules, control narratives, mockup direction, and post-installation aiming." },
  ];
  return (
    <section id="services" style={{ background: pal.bg, padding: "140px 48px" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: pal.muted, marginBottom: 24 }}>
            ◦ Practice
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: "clamp(48px, 6vw, 96px)",
            lineHeight: 0.96,
            letterSpacing: "-0.02em",
            color: pal.ink,
            margin: "0 0 96px",
            maxWidth: 1100,
          }}>
            Four ways we <em style={{ fontStyle: "italic" }}>arrive</em> at a project.
          </h2>
        </Reveal>
        <div>
          {list.map((s, i) => (
            <Reveal key={s.num} delay={i * 80}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr 1.2fr 80px",
                gap: 48,
                alignItems: "baseline",
                padding: "44px 0",
                borderTop: `1px solid ${pal.line}`,
                ...(i === list.length - 1 ? { borderBottom: `1px solid ${pal.line}` } : {}),
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 24, color: pal.accent }}>
                  {s.num}
                </div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontSize: "clamp(32px, 3.6vw, 52px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                  color: pal.ink,
                  margin: 0,
                }}>
                  {s.t}
                </h3>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, lineHeight: 1.7, color: pal.muted, margin: 0 }}>
                  {s.body}
                </p>
                <div style={{ textAlign: "right", color: pal.muted, fontFamily: "Inter, sans-serif", fontSize: 18 }}>→</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- Pull quote / testimonial ----------
const Quote = ({ pal }) => (
  <section style={{ background: pal.surface, padding: "140px 48px", borderTop: `1px solid ${pal.surfaceLine}`, borderBottom: `1px solid ${pal.surfaceLine}` }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
      <Reveal>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: pal.surfaceMuted, marginBottom: 32 }}>
          ◦ In conversation
        </div>
      </Reveal>
      <Reveal delay={120}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: "clamp(36px, 4.2vw, 64px)",
          lineHeight: 1.18,
          letterSpacing: "-0.01em",
          color: pal.surfaceInk,
          margin: 0,
        }}>
          “Nichola treats <em style={{ fontStyle: "italic" }}>light</em> the way an editor treats a sentence — every fixture earns the room it sits in, or it doesn&apos;t make the cut.”
        </p>
      </Reveal>
      <Reveal delay={300}>
        <div style={{ marginTop: 48, fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: pal.surfaceMuted }}>
          M. Levin · Principal, Levin &amp; Associates Architecture
        </div>
      </Reveal>
    </div>
  </section>
);

// ---------- Contact / CTA ----------
const Contact = ({ pal }) => (
  <section id="contact" style={{ background: pal.bg, padding: "160px 48px 100px" }}>
    <div style={{ maxWidth: 1480, margin: "0 auto" }}>
      <Reveal>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: pal.muted, marginBottom: 32, textAlign: "center" }}>
          ◦ Begin
        </div>
      </Reveal>
      <Reveal delay={120}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: "clamp(72px, 11vw, 188px)",
          lineHeight: 0.92,
          letterSpacing: "-0.02em",
          color: pal.ink,
          margin: 0,
          textAlign: "center",
        }}>
          Tell us about<br />
          <em style={{ fontStyle: "italic" }}>your</em> room.
        </h2>
      </Reveal>
      <Reveal delay={300}>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 64 }}>
          <a href="mailto:Nichola@Nicholalighting.com" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 28,
            color: pal.ink,
            textDecoration: "none",
            borderBottom: `1px solid ${pal.ink}`,
            paddingBottom: 6,
          }}>
            Nichola@Nicholalighting.com
          </a>
        </div>
      </Reveal>
      <Reveal delay={400}>
        <div style={{
          marginTop: 96,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 48,
          paddingTop: 48,
          borderTop: `1px solid ${pal.line}`,
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          color: pal.muted,
          lineHeight: 1.7,
        }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: pal.ink, marginBottom: 12 }}>Phone</div>
            <a href="tel:+19146670028" style={{ color: "inherit", textDecoration: "none" }}>914.667.0028</a>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: pal.ink, marginBottom: 12 }}>Cell</div>
            <a href="tel:+16462812972" style={{ color: "inherit", textDecoration: "none" }}>646.281.2972</a>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: pal.ink, marginBottom: 12 }}>Fax</div>
            914.667.2893
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: pal.ink, marginBottom: 12 }}>Studio</div>
            Mount Vernon, NY<br/>
            By appointment
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

// ---------- Footer ----------
const Footer = ({ pal }) => (
  <footer style={{ background: pal.ink, color: pal.bg, padding: "72px 48px 36px" }}>
    <div style={{ maxWidth: 1480, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, alignItems: "start" }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, letterSpacing: "0.32em", textTransform: "uppercase" }}>
            Nichola
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, color: pal.accent, marginTop: 6 }}>
            lighting
          </div>
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
      <div style={{ marginTop: 96, paddingTop: 24, borderTop: `1px solid ${pal.surface}33`, display: "flex", justifyContent: "space-between", fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.55 }}>
        <span>© 2026 Nichola Lighting, LLC</span>
        <span>Mount Vernon · New York</span>
        <span>Site by the Studio</span>
      </div>
    </div>
  </footer>
);

// ---------- Defaults / App ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "B"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const pal = PALETTES.noir;

  // body bg follows palette
  useEffect(() => {
    document.body.style.background = pal.bg;
    document.body.style.color = pal.ink;
  }, [pal]);

  const Hero = tweaks.heroVariant === "A" ? HeroA : tweaks.heroVariant === "C" ? HeroC : HeroB;

  return (
    <div style={{ background: pal.bg, color: pal.ink, minHeight: "100vh" }}>
      <Nav pal={pal} />
      <Hero pal={pal} />
      <Marquee pal={pal} />
      <FeaturedWork pal={pal} />
      <Studio pal={pal} />
      <Services pal={pal} />
      <Quote pal={pal} />
      <Contact pal={pal} />
      <Footer pal={pal} />

      <TweaksPanel title="Tweaks" defaultPos={{ right: 24, bottom: 24 }}>
        <TweakSection title="Hero variant">
          <TweakRadio
            value={tweaks.heroVariant}
            onChange={(v) => setTweak("heroVariant", v)}
            options={[
              { value: "A", label: "Type-forward" },
              { value: "B", label: "Full-bleed" },
              { value: "C", label: "Split" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

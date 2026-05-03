// Journal — Vlog feed for Nichola Lighting
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

// ---------- Palette ----------
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
};

// ---------- Vlog entries ----------
// Videos are royalty-free Pexels CDN MP4s — light-related cinematography
const ENTRIES = [
  {
    num: "12",
    title: "On the brass cove at Aman",
    italic: "brass cove",
    cat: "Field notes",
    duration: "4:12",
    date: "Mar 14, 2026",
    excerpt: "We pulled a 14-foot mockup off-site before signing the spec. The brass behaves differently in the room than it does on the bench — softer at 2400K, closer to honey at 2700K. A short walkthrough of how we landed the final color temperature.",
    tags: ["Hospitality", "Color temperature", "Mockup"],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://images.unsplash.com/photo-1604607390665-9d4eb59415e1?auto=format&fit=crop&w=1600&q=70",
  },
  {
    num: "11",
    title: "Why we don't light faces from above",
    italic: "from above",
    cat: "Studio essay",
    duration: "6:48",
    date: "Feb 27, 2026",
    excerpt: "A short walkthrough of the geometry that ruins a hotel lobby — and the one we use instead. Filmed on the floor at the Surrey, with the mock-up still up.",
    tags: ["Hospitality", "First principles"],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=70",
  },
  {
    num: "10",
    title: "Mocking up dim-to-warm at 1800K",
    italic: "1800K",
    cat: "Field notes",
    duration: "3:21",
    date: "Feb 09, 2026",
    excerpt: "A bench mock-up of a candle-spec scheme for Maison Pierre. We test every fixture against three skin tones and the chef's favourite plate before we sign anything.",
    tags: ["Restaurant", "Mockup", "CRI"],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=70",
  },
  {
    num: "09",
    title: "A walk through Brookfield at dusk",
    italic: "dusk",
    cat: "Walkthrough",
    duration: "8:02",
    date: "Jan 24, 2026",
    excerpt: "Three years after commissioning. The system runs on its dusk preset for 38 minutes a day; here is what those 38 minutes look like from the riverwalk.",
    tags: ["Architectural", "DMX", "Façade"],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1600&q=70",
  },
  {
    num: "08",
    title: "What a fixture schedule actually looks like",
    italic: "actually",
    cat: "Practice",
    duration: "5:34",
    date: "Jan 06, 2026",
    excerpt: "A flip-through of the Branch 4 schedule — 312 fixtures, 14 control zones, one librarian who reads it like a recipe. We talk about the columns that matter and the ones that don't.",
    tags: ["Civic", "Documentation", "Specification"],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster: "https://images.unsplash.com/photo-1521566652839-697aa473761a?auto=format&fit=crop&w=1600&q=70",
  },
  {
    num: "07",
    title: "On the difference between 2700K and 3000K",
    italic: "the difference",
    cat: "Studio essay",
    duration: "4:55",
    date: "Dec 18, 2025",
    excerpt: "Three hundred Kelvin is a marketing number until you put it on a wall. A side-by-side test of the same fixture at both temperatures, in the same room, at three different times of day.",
    tags: ["Color temperature", "First principles"],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=70",
  },
  {
    num: "06",
    title: "Aiming a retail floor in 90 seconds",
    italic: "90 seconds",
    cat: "Field notes",
    duration: "2:08",
    date: "Dec 02, 2025",
    excerpt: "A time-lapse from the Bergdorf install. We aim every accent twice — once in plan, once with the merchandise on the rack. The second pass is the one that earns the fee.",
    tags: ["Retail", "Aiming"],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    poster: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=70",
  },
];

// ---------- Nav ----------
const Nav = () => (
  <header style={{
    position: "sticky", top: 0, zIndex: 40,
    background: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderBottom: "1px solid #222222",
  }}>
    <div style={{
      maxWidth: 1480, margin: "0 auto", padding: "20px 48px",
      display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 24,
    }}>
      <nav style={{ display: "flex", gap: 32, fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFFFFF" }}>
        <a href="index.html#work" style={{ color: "inherit", textDecoration: "none" }}>Work</a>
        <a href="index.html#studio" style={{ color: "inherit", textDecoration: "none" }}>Studio</a>
        <a href="index.html#services" style={{ color: "inherit", textDecoration: "none" }}>Services</a>
      </nav>
      <a href="index.html" style={{ textDecoration: "none", color: "#FFFFFF", textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, letterSpacing: "0.32em", textTransform: "uppercase", lineHeight: 1 }}>Nichola</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, letterSpacing: "0.18em", color: PAL.accent, marginTop: 4 }}>lighting</div>
      </a>
      <nav style={{ display: "flex", gap: 32, justifyContent: "flex-end", fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#FFFFFF" }}>
        <a href="journal.html" style={{ color: "#FFFFFF", textDecoration: "none", borderBottom: "1px solid #FFFFFF", paddingBottom: 2 }}>Journal</a>
        <a href="index.html#contact" style={{ color: "inherit", textDecoration: "none" }}>Contact</a>
        <a href="index.html#contact" style={{ color: PAL.accent, textDecoration: "none" }}>Inquire ↗</a>
      </nav>
    </div>
  </header>
);

// ---------- Video player ----------
const VideoPlayer = ({ entry, large = false }) => {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={toggle}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        background: "#1A1816",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <video
        ref={ref}
        src={entry.video}
        poster={entry.poster}
        playsInline
        preload="metadata"
        muted
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        style={{
          width: "100%", height: "100%", objectFit: "cover", display: "block",
          transition: "transform 1.4s cubic-bezier(.2,.6,.2,1), filter 0.6s ease",
          transform: hover && !playing ? "scale(1.03)" : "scale(1)",
          filter: playing ? "brightness(1)" : (hover ? "brightness(0.78)" : "brightness(0.88)"),
        }}
      />
      {/* Play button overlay */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: playing ? 0 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }}>
        <div style={{
          width: large ? 96 : 72, height: large ? 96 : 72, borderRadius: "50%",
          background: "rgba(255,255,255,0.92)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: hover ? "scale(1.08)" : "scale(1)",
          transition: "transform 0.4s cubic-bezier(.2,.6,.2,1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}>
          <svg width={large ? 28 : 22} height={large ? 28 : 22} viewBox="0 0 24 24" fill="#1A1816" style={{ marginLeft: 4 }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      {/* Duration pill */}
      <div style={{
        position: "absolute", bottom: 16, right: 16,
        background: "rgba(26,24,22,0.78)",
        color: "#F4EFE7",
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 11, letterSpacing: "0.06em",
        padding: "6px 10px",
        opacity: playing ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}>
        {entry.duration}
      </div>
    </div>
  );
};

// ---------- Featured (latest) entry ----------
const Featured = ({ entry }) => (
  <section style={{ padding: "80px 48px 100px" }}>
    <div style={{ maxWidth: 1480, margin: "0 auto" }}>
      <Reveal>
        <div style={{
          display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 32, alignItems: "baseline",
          fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: PAL.muted,
          paddingBottom: 24, marginBottom: 32,
          borderBottom: `1px solid ${PAL.line}`,
        }}>
          <span>Latest · No. {entry.num}</span>
          <span style={{ textAlign: "center" }}>{entry.cat}</span>
          <span>{entry.date}</span>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <VideoPlayer entry={entry} large />
      </Reveal>
      <Reveal delay={220}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 96, alignItems: "start", marginTop: 56 }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
            fontSize: "clamp(40px, 5vw, 76px)", lineHeight: 1.02, letterSpacing: "-0.015em",
            color: PAL.ink, margin: 0, textWrap: "balance",
          }}>
            {entry.title.split(entry.italic)[0]}<em style={{ fontStyle: "italic" }}>{entry.italic}</em>{entry.title.split(entry.italic)[1] || ""}
          </h2>
          <div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.7, color: PAL.muted, margin: "0 0 32px" }}>
              {entry.excerpt}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {entry.tags.map(t => (
                <span key={t} style={{
                  fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: PAL.muted, padding: "6px 12px", border: `1px solid ${PAL.line}`,
                }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

// ---------- Feed entry (regular card in the list) ----------
const FeedEntry = ({ entry, index, total }) => (
  <Reveal>
    <article style={{
      display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 64,
      padding: "64px 0",
      borderTop: `1px solid ${PAL.line}`,
      ...(index === total - 1 ? { borderBottom: `1px solid ${PAL.line}` } : {}),
      alignItems: "center",
    }}>
      <VideoPlayer entry={entry} />
      <div>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
          color: PAL.muted, marginBottom: 24,
        }}>
          <span>No. {entry.num} · {entry.cat}</span>
          <span>{entry.date}</span>
        </div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
          fontSize: "clamp(30px, 3.4vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.01em",
          color: PAL.ink, margin: "0 0 20px", textWrap: "balance",
        }}>
          {entry.title.split(entry.italic)[0]}<em style={{ fontStyle: "italic" }}>{entry.italic}</em>{entry.title.split(entry.italic)[1] || ""}
        </h3>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, lineHeight: 1.7, color: PAL.muted, margin: "0 0 24px" }}>
          {entry.excerpt}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {entry.tags.map(t => (
              <span key={t} style={{
                fontFamily: "Inter, sans-serif", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
                color: PAL.muted, padding: "4px 10px", border: `1px solid ${PAL.line}`,
              }}>{t}</span>
            ))}
          </div>
          <span style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11, letterSpacing: "0.08em", color: PAL.muted,
          }}>{entry.duration}</span>
        </div>
      </div>
    </article>
  </Reveal>
);

// ---------- Filter chips ----------
const Filter = ({ tags, active, onChange }) => (
  <div style={{
    display: "flex", flexWrap: "wrap", gap: 12,
    padding: "32px 0",
    borderTop: `1px solid ${PAL.line}`,
    borderBottom: `1px solid ${PAL.line}`,
    marginBottom: 8,
  }}>
    {tags.map(t => (
      <button key={t} onClick={() => onChange(t)} style={{
        fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
        padding: "10px 18px",
        background: active === t ? PAL.ink : "transparent",
        color: active === t ? PAL.bg : PAL.ink,
        border: `1px solid ${active === t ? PAL.ink : PAL.line}`,
        cursor: "pointer",
        transition: "background 0.2s, color 0.2s, border-color 0.2s",
      }}>
        {t}
      </button>
    ))}
  </div>
);

// ---------- Main ----------
function App() {
  const allTags = ["All", ...Array.from(new Set(ENTRIES.flatMap(e => e.tags)))];
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? ENTRIES : ENTRIES.filter(e => e.tags.includes(filter));
  const [featured, ...rest] = filtered;

  useEffect(() => {
    document.title = "Journal — Nichola Lighting";
  }, []);

  return (
    <div style={{ background: PAL.bg, color: PAL.ink, minHeight: "100vh" }}>
      <Nav />

      {/* Hero header */}
      <section style={{ padding: "120px 48px 60px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <Reveal>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: PAL.muted, marginBottom: 32 }}>
              ◦ Journal · A working vlog from the studio
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
              fontSize: "clamp(72px, 10vw, 168px)", lineHeight: 0.92, letterSpacing: "-0.025em",
              color: PAL.ink, margin: 0, textWrap: "balance", maxWidth: 1300,
            }}>
              Notes from the <em style={{ fontStyle: "italic" }}>floor</em>.
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
              fontSize: "clamp(20px, 1.8vw, 28px)", lineHeight: 1.45, color: PAL.muted,
              margin: "40px 0 0", maxWidth: 760,
            }}>
              Short films from mock-ups, install nights, and the bench. Filed under whatever the work was that week — usually a fixture, sometimes a question.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filter */}
      <div style={{ padding: "0 48px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <Reveal delay={300}>
            <Filter tags={allTags} active={filter} onChange={setFilter} />
          </Reveal>
        </div>
      </div>

      {/* Featured */}
      {featured && <Featured entry={featured} />}

      {/* Feed */}
      <section style={{ padding: "0 48px 120px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <Reveal>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: PAL.muted, marginBottom: 8 }}>
              ◦ Earlier in the feed
            </div>
          </Reveal>
          <div>
            {rest.map((e, i) => (
              <FeedEntry key={e.num} entry={e} index={i} total={rest.length} />
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe / sign-off */}
      <section style={{ background: PAL.surface, padding: "120px 48px", borderTop: `1px solid ${PAL.surfaceLine}`, borderBottom: `1px solid ${PAL.surfaceLine}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: PAL.surfaceMuted, marginBottom: 32 }}>
              ◦ The next one drops monthly
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
              fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.04, letterSpacing: "-0.01em",
              color: PAL.surfaceInk, margin: "0 0 40px", textWrap: "balance",
            }}>
              Get the <em style={{ fontStyle: "italic" }}>journal</em> in your inbox.
            </h2>
          </Reveal>
          <Reveal delay={220}>
            <form onSubmit={e => e.preventDefault()} style={{
              display: "flex", gap: 0, maxWidth: 540, margin: "0 auto",
              borderBottom: `1px solid ${PAL.surfaceInk}`,
            }}>
              <input
                type="email"
                placeholder="you@studio.com"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  fontFamily: "Inter, sans-serif", fontSize: 16, color: PAL.surfaceInk,
                  padding: "16px 4px",
                }}
              />
              <button type="submit" style={{
                background: "transparent", border: "none", cursor: "pointer",
                fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
                color: PAL.surfaceInk, padding: "16px 8px",
              }}>
                Subscribe →
              </button>
            </form>
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
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

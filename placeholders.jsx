// Subtly-toned SVG placeholders with monospace labels for missing photography.
const Placeholder = ({ label, ratio = "4 / 5", tone = "warm", className = "", style = {} }) => {
  const palettes = {
    warm:    { bg: "#E8DFD0", stripe: "#DCD0BB", text: "#7A6B52" },
    cool:    { bg: "#D8D6D1", stripe: "#C8C5BD", text: "#5C5A55" },
    dark:    { bg: "#2C2C2C", stripe: "#3F3F3F", text: "#888888" },
    ivory:   { bg: "#EFE8DA", stripe: "#E2D9C5", text: "#8A7A5C" },
  };
  const p = palettes[tone] || palettes.warm;
  return (
    <div
      className={`placeholder ${className}`}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: ratio,
        background: p.bg,
        overflow: "hidden",
        ...style,
      }}
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        style={{ position: "absolute", inset: 0, display: "block" }}
      >
        <defs>
          <pattern id={`stripes-${tone}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={p.stripe} strokeWidth="3" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#stripes-${tone})`} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: "10px",
          letterSpacing: "0.12em",
          color: p.text,
          textTransform: "uppercase",
          textAlign: "center",
          padding: "0 16px",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

window.Placeholder = Placeholder;

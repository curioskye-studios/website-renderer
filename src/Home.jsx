import { Link } from "react-router-dom";

export default function Home() {
  // Modern Dark Theme Palette
  const colors = {
    background: "#0f172a", 
    cardBg: "#1e293b",     
    accent: "#38bdf8",     
    text: "#f8fafc",
    textMuted: "#94a3b8"
  };

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: colors.background,
    color: colors.text,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    padding: "20px"
  };

  const cardContainerStyle = {
    display: "grid",
    gap: "16px",
    width: "100%",
    maxWidth: "320px",
    marginTop: "40px"
  };

  const linkStyle = {
    display: "block",
    padding: "18px 24px",
    fontSize: "16px",
    fontWeight: "500",
    letterSpacing: "0.5px",
    cursor: "pointer",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: colors.cardBg,
    color: colors.text,
    textDecoration: "none",
    textAlign: "center",
    transition: "all 0.2s ease-in-out",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  };

  return (
    <div style={containerStyle}>
      <header style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "8px", fontWeight: "800", letterSpacing: "-1px" }}>
          Study<span style={{ color: colors.accent }}>Hub</span>
        </h1>
        <p style={{ color: colors.textMuted, fontSize: "1rem" }}>
          Select a module to continue
        </p>
      </header>

      <div style={cardContainerStyle}>
        <Link to="/advanced-js" style={linkStyle} 
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#26334d";
            e.currentTarget.style.borderColor = colors.accent;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = colors.cardBg;
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}>
          Advanced JS Quiz
        </Link>

        <Link to="/interview-prep" style={linkStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#26334d";
            e.currentTarget.style.borderColor = colors.accent;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = colors.cardBg;
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}>
          Interview Prep
        </Link>

        <Link to="/react-quiz" style={linkStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#26334d";
            e.currentTarget.style.borderColor = colors.accent;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = colors.cardBg;
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}>
          React Quiz
        </Link>
      </div>
    </div>
  );
}
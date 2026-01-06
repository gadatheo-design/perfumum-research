export function ResearchAxisPage() {
  return (
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, margin: 0 }}>Axis title</h1>
      <p style={{ opacity: 0.8 }}>Novelty tagline</p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "16px 0" }}>
        <button>Export field notes (MD)</button>
        <button>Create constellation</button>
      </div>

      <h2 style={{ fontSize: 18 }}>Sources</h2>
      <div style={{ display: "grid", gap: 12 }}>
        <article style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 600 }}>Article title</div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>2024-04-07 · fr · Science</div>
          <a href="#" target="_blank" rel="noreferrer">Open source</a>
        </article>
      </div>
    </div>
  );
}

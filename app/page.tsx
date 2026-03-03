export default function Home() {
  return (
    <main>
      <h1 style={{ marginBottom: 8 }}>MANUS</h1>
      <p style={{ marginTop: 0 }}>Enterprise baseline: orchestrator + pipelines + revenue + memory.</p>
      <ul>
        <li><code>GET /api/health</code></li>
        <li><code>POST /api/orchestrate</code></li>
        <li><code>POST /api/checkout</code></li>
        <li><code>POST /api/stripe/webhook</code></li>
        <li><code>GET /api/dashboard</code></li>
        <li><code>POST /api/factory</code></li>
      </ul>
    </main>
  );
}

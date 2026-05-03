import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { countries, countryStats, monthlyTrend, headcountByCountry, payrollRuns, payGroupsByCountry } from "./data/payrollData";
import "./App.css";

const STATUS_CONFIG = {
  completed:  { label: "Completed",  color: "#16a34a", bg: "#dcfce7" },
  in_review:  { label: "In Review",  color: "#d97706", bg: "#fef3c7" },
  pending:    { label: "Pending",    color: "#4f46e5", bg: "#ede9fe" },
  error:      { label: "Error",      color: "#dc2626", bg: "#fee2e2" },
};

const COUNTRY_COLORS = { US: "#4f46e5", DE: "#0891b2", GB: "#d97706", BR: "#059669" };

const fmtFull = (val, symbol = "$") =>
  symbol + new Intl.NumberFormat("en-US").format(Math.round(val));

const fmtShort = (val, symbol = "") => {
  if (val >= 1_000_000) return symbol + (val / 1_000_000).toFixed(1) + "M";
  if (val >= 1_000) return symbol + (val / 1_000).toFixed(0) + "K";
  return symbol + val;
};

function KpiCard({ label, value, sub, accent }) {
  return (
    <div className="kpi-card" style={{ "--accent": accent }}>
      <div className="kpi-accent-bar" />
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      {sub && <p className="kpi-sub">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="status-badge" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}33` }}>
      <span className="status-dot" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function CountryCard({ country, selected, onClick }) {
  const stats = countryStats[country.code];
  const color = COUNTRY_COLORS[country.code];
  const scoreColor = stats.complianceScore >= 97 ? "#22c55e" : stats.complianceScore >= 95 ? "#f59e0b" : "#f87171";
  return (
    <div
      className={`country-card ${selected ? "selected" : ""}`}
      onClick={onClick}
      style={selected ? { borderColor: color, boxShadow: `0 0 0 1px ${color}` } : {}}
    >
      <div className="country-card-top">
        <div className="country-identity">
          <span className="flag">{country.flag}</span>
          <div>
            <p className="country-name">{country.name}</p>
            <p className="country-currency">{country.currency}</p>
          </div>
        </div>
        <div className="compliance-ring" style={{ "--score-color": scoreColor }}>
          <span className="compliance-value" style={{ color: scoreColor }}>{stats.complianceScore}%</span>
          <span className="compliance-label">compliance</span>
        </div>
      </div>
      <div className="country-stats">
        <div className="stat">
          <p className="stat-label">Headcount</p>
          <p className="stat-value">{stats.headcount.toLocaleString()}</p>
        </div>
        <div className="stat">
          <p className="stat-label">Gross Payroll</p>
          <p className="stat-value">{fmtShort(stats.grossPayroll, country.symbol)}</p>
        </div>
        <div className="stat">
          <p className="stat-label">On-Time</p>
          <p className="stat-value" style={{ color: stats.onTimeRate === 100 ? "#22c55e" : "#f59e0b" }}>
            {stats.onTimeRate}%
          </p>
        </div>
        <div className="stat">
          <p className="stat-label">Actions</p>
          <p className="stat-value" style={{ color: stats.pendingActions > 0 ? "#f59e0b" : "#22c55e" }}>
            {stats.pendingActions > 0 ? `⚠ ${stats.pendingActions}` : "✓ 0"}
          </p>
        </div>
      </div>
    </div>
  );
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tt-label">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {countries.find((c) => c.code === p.dataKey)?.name ?? p.name}:{" "}
          {fmtShort(p.value, "")}
        </p>
      ))}
    </div>
  );
};

const ISSUE_COLOR = (n) => n === 0 ? "#16a34a" : n <= 2 ? "#d97706" : "#dc2626";

function IssueCell({ count, note }) {
  if (count === 0) return <span className="issue-none">—</span>;
  return (
    <span className="issue-badge" style={{ color: ISSUE_COLOR(count), background: count <= 2 ? "#fef3c7" : "#fee2e2", border: `1px solid ${count <= 2 ? "#fde68a" : "#fecaca"}` }} title={note}>
      ⚠ {count} {count === 1 ? "issue" : "issues"}
    </span>
  );
}

function PayGroupsSection() {
  const [activeTab, setActiveTab] = useState("US");

  const rows = payGroupsByCountry[activeTab] ?? [];
  const country = countries.find((c) => c.code === activeTab);

  const totalGross = rows.reduce((s, r) => s + r.gross, 0);
  const totalNet   = rows.reduce((s, r) => s + r.net, 0);
  const totalIssues = rows.reduce((s, r) => s + r.issues, 0);
  const symbol = rows[0]?.symbol ?? "$";

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Pay Groups by Country</h2>
          <p className="section-sub">Current pay period · pay group breakdown per country</p>
        </div>
      </div>

      {/* Country Tabs */}
      <div className="pg-tabs">
        {countries.map((c) => {
          const runs = payGroupsByCountry[c.code] ?? [];
          const issues = runs.reduce((s, r) => s + r.issues, 0);
          return (
            <button
              key={c.code}
              className={`pg-tab ${activeTab === c.code ? "pg-tab-active" : ""}`}
              onClick={() => setActiveTab(c.code)}
            >
              <span>{c.flag} {c.name}</span>
              {issues > 0 && <span className="pg-tab-issue">{issues}</span>}
            </button>
          );
        })}
      </div>

      {/* Summary strip */}
      <div className="pg-summary">
        <div className="pg-summary-item">
          <span className="pg-summary-label">Pay Groups</span>
          <span className="pg-summary-value">{rows.length}</span>
        </div>
        <div className="pg-summary-divider" />
        <div className="pg-summary-item">
          <span className="pg-summary-label">Total Gross</span>
          <span className="pg-summary-value">{fmtFull(totalGross, symbol)}</span>
        </div>
        <div className="pg-summary-divider" />
        <div className="pg-summary-item">
          <span className="pg-summary-label">Total Net</span>
          <span className="pg-summary-value">{fmtFull(totalNet, symbol)}</span>
        </div>
        <div className="pg-summary-divider" />
        <div className="pg-summary-item">
          <span className="pg-summary-label">Open Issues</span>
          <span className="pg-summary-value" style={{ color: totalIssues > 0 ? "#dc2626" : "#16a34a" }}>
            {totalIssues > 0 ? `⚠ ${totalIssues}` : "✓ None"}
          </span>
        </div>
        <div className="pg-summary-divider" />
        <div className="pg-summary-item">
          <span className="pg-summary-label">Currency</span>
          <span className="pg-summary-value">{country?.currency}</span>
        </div>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="runs-table">
          <thead>
            <tr>
              <th>Pay Group</th>
              <th>Status</th>
              <th>Issues</th>
              <th>Pay Date</th>
              <th>Due</th>
              <th style={{ textAlign: "right" }}>Gross Pay</th>
              <th style={{ textAlign: "right" }}>Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td className="pg-group-name">{row.payGroup}</td>
                <td><StatusBadge status={row.status} /></td>
                <td><IssueCell count={row.issues} note={row.issueNote} /></td>
                <td>{row.payDate}</td>
                <td className={row.due ? "" : "muted"}>{row.due}</td>
                <td className="num amount">{fmtFull(row.gross, row.symbol)}</td>
                <td className="num muted">{fmtFull(row.net, row.symbol)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="pg-total-row">
              <td colSpan={5} className="pg-total-label">Total</td>
              <td className="num amount">{fmtFull(totalGross, symbol)}</td>
              <td className="num muted">{fmtFull(totalNet, symbol)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const totalHeadcount = Object.values(countryStats).reduce((s, c) => s + c.headcount, 0);
  const totalGross = Object.values(countryStats).reduce((s, c) => s + c.grossPayroll, 0);
  const avgCompliance = Math.round(
    Object.values(countryStats).reduce((s, c) => s + c.complianceScore, 0) / Object.keys(countryStats).length
  );
  const pendingActions = Object.values(countryStats).reduce((s, c) => s + c.pendingActions, 0);

  const filteredRuns = payrollRuns.filter((r) => {
    const byCountry = selectedCountry ? r.country === selectedCountry : true;
    const byStatus = statusFilter === "all" ? true : r.status === statusFilter;
    return byCountry && byStatus;
  });

  const barData = countries.map((c) => ({
    name: `${c.flag} ${c.code}`,
    Gross: countryStats[c.code].grossPayroll,
    Net: countryStats[c.code].netPayroll,
  }));

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="logo-mark">GP</div>
          <div>
            <h1 className="topbar-title">Global Payroll Dashboard</h1>
            <p className="topbar-meta">March 2025 · 5 Countries · {totalHeadcount.toLocaleString()} Employees</p>
          </div>
        </div>
        <div className="topbar-right">
          <span className="live-indicator"><span className="live-dot" />Live</span>
          <button className="btn-ghost">Export Report</button>
          <button className="btn-primary">+ Run Payroll</button>
        </div>
      </header>

      <div className="content">
        {/* ── KPIs ── */}
        <section className="kpi-grid">
          <KpiCard label="Total Headcount" value={totalHeadcount.toLocaleString()} sub="4 active countries" accent="#818cf8" />
          <KpiCard label="Global Gross Payroll" value={fmtShort(totalGross, "$")} sub="March 2025 (USD equiv.)" accent="#22d3ee" />
          <KpiCard label="Avg Compliance Score" value={`${avgCompliance}%`} sub="Across all regions" accent="#22c55e" />
          <KpiCard
            label="Pending Actions"
            value={pendingActions}
            sub={pendingActions > 0 ? "Require attention" : "All clear"}
            accent={pendingActions > 0 ? "#f59e0b" : "#22c55e"}
          />
        </section>

        {/* ── Country Cards ── */}
        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Country Overview</h2>
              <p className="section-sub">Click a country to filter the dashboard</p>
            </div>
            {selectedCountry && (
              <button className="btn-ghost small" onClick={() => setSelectedCountry(null)}>
                Clear filter ×
              </button>
            )}
          </div>
          <div className="country-grid">
            {countries.map((c) => (
              <CountryCard
                key={c.code}
                country={c}
                selected={selectedCountry === c.code}
                onClick={() => setSelectedCountry(selectedCountry === c.code ? null : c.code)}
              />
            ))}
          </div>
        </section>

        {/* ── Charts ── */}
        <section className="section">
          <h2 className="section-title">Data Visualizations</h2>
          <div className="charts-grid">
            {/* Trend Line */}
            <div className="chart-card span-2">
              <h3 className="chart-title">Gross Payroll Trend — Last 6 Months</h3>
              <p className="chart-sub">Monthly gross payroll by country (USD equivalent)</p>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyTrend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => fmtShort(v)} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    formatter={(val) => countries.find((c) => c.code === val)?.name}
                    wrapperStyle={{ color: "#94a3b8", fontSize: 12, paddingTop: 12 }}
                  />
                  {countries.map((c) => (
                    <Line
                      key={c.code}
                      type="monotone"
                      dataKey={c.code}
                      stroke={COUNTRY_COLORS[c.code]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Gross vs Net Payroll</h3>
              <p className="chart-sub">Current month · all countries</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => fmtShort(v)} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                  <Tooltip
                    formatter={(v, n) => [fmtFull(v, "$"), n]}
                    contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#0f172a" }}
                    labelStyle={{ color: "#64748b" }}
                  />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12, paddingTop: 12 }} />
                  <Bar dataKey="Gross" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Net" fill="#0891b2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Headcount Distribution</h3>
              <p className="chart-sub">Employees by country</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={headcountByCountry}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {headcountByCountry.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, n) => [`${v.toLocaleString()} employees`, n]}
                    contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#0f172a" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {headcountByCountry.map((d) => (
                  <div key={d.name} className="pie-row">
                    <div className="pie-row-left">
                      <span className="pie-dot" style={{ background: d.fill }} />
                      <span className="pie-name">{d.name}</span>
                    </div>
                    <span className="pie-count">{d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Payroll Runs Table ── */}
        <section className="section">
          <div className="table-controls">
            <div>
              <h2 className="section-title">Payroll Runs</h2>
              <p className="section-sub">
                Showing {filteredRuns.length} run{filteredRuns.length !== 1 ? "s" : ""}
                {selectedCountry ? ` · ${countries.find((c) => c.code === selectedCountry)?.name}` : " · All Countries"}
              </p>
            </div>
            <div className="filter-pills">
              {["all", "completed", "in_review", "pending", "error"].map((f) => (
                <button
                  key={f}
                  className={`pill ${statusFilter === f ? "pill-active" : ""}`}
                  onClick={() => setStatusFilter(f)}
                  style={statusFilter === f && f !== "all" ? { color: STATUS_CONFIG[f].color, borderColor: STATUS_CONFIG[f].color } : {}}
                >
                  {f === "all" ? "All Runs" : STATUS_CONFIG[f].label}
                </button>
              ))}
            </div>
          </div>

          <div className="table-scroll">
            <table className="runs-table">
              <thead>
                <tr>
                  <th>Run ID</th>
                  <th>Country</th>
                  <th>Pay Period</th>
                  <th>Pay Date</th>
                  <th>Employees</th>
                  <th>Gross Amount</th>
                  <th>Status</th>
                  <th>Processed By</th>
                  <th>Approved By</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredRuns.map((run) => (
                  <tr key={run.id}>
                    <td className="mono">{run.id}</td>
                    <td>
                      <span className="country-tag">
                        {run.flag} {run.country}
                      </span>
                    </td>
                    <td>{run.payPeriod}</td>
                    <td>{run.payDate}</td>
                    <td className="num">{run.employees.toLocaleString()}</td>
                    <td className="num amount">{fmtFull(run.grossAmount, run.symbol)}</td>
                    <td><StatusBadge status={run.status} /></td>
                    <td>{run.processedBy}</td>
                    <td className={run.approvedBy === "—" ? "muted" : ""}>{run.approvedBy}</td>
                    <td className="muted">{run.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRuns.length === 0 && (
              <div className="empty">No payroll runs match the current filters.</div>
            )}
          </div>
        </section>

        {/* ── Pay Groups by Country ── */}
        <PayGroupsSection />
      </div>
    </div>
  );
}

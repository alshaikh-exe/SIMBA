// src/components/Analytics/Analytics.jsx
import { useMemo, useState } from "react";
import styles from "./Analytics.module.scss";
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceDot
} from "recharts";

export default function Analytics({ data, initialItem, initialChart = "line" }) {
  // derive item list
  const itemNames = useMemo(() => {
    const set = new Set();
    data.forEach(d => Object.keys(d.items || {}).forEach(k => set.add(k)));
    return Array.from(set);
  }, [data]);

  const [selectedItem, setSelectedItem] = useState(initialItem || itemNames[0] || "");
  const [chartType, setChartType] = useState(initialChart);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(Math.max(0, data.length - 1));

  // flatten chart data
  const chartData = useMemo(() => {
    const s = Math.min(fromIdx, toIdx);
    const e = Math.max(fromIdx, toIdx);
    return data.slice(s, e + 1).map(row => ({
      semester: row.semester,
      usage: row.items?.[selectedItem] ?? 0,
    }));
  }, [data, selectedItem, fromIdx, toIdx]);

  // stats
  const stats = useMemo(() => {
    if (!chartData.length) return { total: 0, avg: 0, peakVal: 0, peakSem: "—", growthPct: 0 };
    const total = chartData.reduce((sum, r) => sum + (r.usage ?? 0), 0);
    const avg = Math.round(total / chartData.length);
    let peakVal = -Infinity, peakSem = "—";
    chartData.forEach(r => {
      if (r.usage > peakVal) { peakVal = r.usage; peakSem = r.semester; }
    });
    const first = chartData[0].usage ?? 0;
    const last = chartData[chartData.length - 1].usage ?? 0;
    const growthPct = first === 0 ? 0 : Math.round(((last - first) / first) * 100);
    return { total, avg, peakVal, peakSem, growthPct };
  }, [chartData]);

  return (
    <section className={styles.Page}>
      {/* Header */}
      <header className={styles.Header}>
        <h1>Usage Analytics</h1>
        <p className={styles.Muted}>Review item usage by semester, spot peaks, and track growth.</p>
      </header>

      {/* Controls */}
      <div className={styles.Controls}>
        <div className={styles.Control}>
          <label>Item</label>
          <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
            {itemNames.map(name => <option key={name}>{name}</option>)}
          </select>
        </div>
        <div className={styles.Control}>
          <label>Chart</label>
          <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="line">Line</option>
            <option value="bar">Bar</option>
          </select>
        </div>
        <div className={styles.Control}>
          <label>From</label>
          <select value={fromIdx} onChange={(e) => setFromIdx(Number(e.target.value))}>
            {data.map((r, i) => <option key={`${r.semester}-f`} value={i}>{r.semester}</option>)}
          </select>
        </div>
        <div className={styles.Control}>
          <label>To</label>
          <select value={toIdx} onChange={(e) => setToIdx(Number(e.target.value))}>
            {data.map((r, i) => <option key={`${r.semester}-t`} value={i}>{r.semester}</option>)}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.Stats}>
        <StatCard title="Total Usage" value={stats.total} />
        <StatCard title="Avg / Semester" value={stats.avg} />
        <StatCard title="Peak" value={stats.peakVal} sub={stats.peakSem} />
        <StatCard title="Growth" value={`${stats.growthPct}%`} sub="First → Last" />
      </div>

      {/* Chart */}
      <article className={styles.ChartCard}>
        <h2>{selectedItem || "—"} by Semester</h2>
        <div className={styles.ChartWrap}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="semester" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line dataKey="usage" stroke="#6c7293" strokeWidth={2} dot={{ r: 3 }} />
                {stats.peakVal > 0 && (
                  <ReferenceDot x={stats.peakSem} y={stats.peakVal} r={5} fill="#3d4468" stroke="#fff" />
                )}
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="semester" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" fill="#6c7293" radius={[8,8,0,0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}

function StatCard({ title, value, sub }) {
  return (
    <div className={styles.StatCard}>
      <div className={styles.StatTitle}>{title}</div>
      <div className={styles.StatValue}>{value}</div>
      {sub && <div className={styles.StatSub}>{sub}</div>}
    </div>
  );
}

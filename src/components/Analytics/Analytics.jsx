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

/**
 * Expected data shape:
 * [
 *   { semester: "Fall 2024",   items: { "Item A": 120, "Item B": 90,  "Item C": 150 } },
 *   { semester: "Spring 2025", items: { "Item A": 180, "Item B": 110, "Item C": 95  } },
 *   ...
 * ]
 */
const SAMPLE = [
  { semester: "Fall 2024",   items: { "Item A": 120, "Item B": 90,  "Item C": 150 } },
  { semester: "Spring 2025", items: { "Item A": 180, "Item B": 110, "Item C": 95  } },
  { semester: "Summer 2025", items: { "Item A": 130, "Item B": 70,  "Item C": 105 } },
  { semester: "Fall 2025",   items: { "Item A": 220, "Item B": 140, "Item C": 160 } },
];

export default function Analytics({
  data = SAMPLE,
  initialItem,            // optional: default item name
  initialChart = "line",  // "line" | "bar"
  height = 360,           // chart height
  title = "Usage Analytics",
  subtitle = "Review item usage by semester, spot peaks, and track growth."
}) {
  // derive item list from data
  const itemNames = useMemo(() => {
    const set = new Set();
    data.forEach(d => Object.keys(d.items || {}).forEach(k => set.add(k)));
    return Array.from(set);
  }, [data]);

  const [selectedItem, setSelectedItem] = useState(initialItem || itemNames[0] || "");
  const [chartType, setChartType] = useState(initialChart);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(Math.max(0, data.length - 1));

  // filter + flatten for recharts
  const chartData = useMemo(() => {
    const s = Math.min(fromIdx, toIdx);
    const e = Math.max(fromIdx, toIdx);
    return data.slice(s, e + 1).map(row => ({
      semester: row.semester,
      usage: row.items?.[selectedItem] ?? 0,
    }));
  }, [data, selectedItem, fromIdx, toIdx]);

  // quick stats
  const stats = useMemo(() => {
    if (!chartData.length) return { total: 0, avg: 0, peakVal: 0, peakSem: "—", growthPct: 0 };
    const total = chartData.reduce((sum, r) => sum + (r.usage ?? 0), 0);
    const avg = Math.round(total / chartData.length);
    let peakVal = -Infinity;
    let peakSem = "—";
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
      <header className={styles.Header}>
        <h1>{title}</h1>
        {subtitle && <p className={styles.Muted}>{subtitle}</p>}
      </header>

      <div className={styles.Controls}>
        <Control label="Item">
          <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
            {itemNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </Control>

        <Control label="Chart">
          <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="line">Line</option>
            <option value="bar">Bar</option>
          </select>
        </Control>

        <Control label="From">
          <select value={fromIdx} onChange={(e) => setFromIdx(Number(e.target.value))}>
            {data.map((r, i) => <option key={`${r.semester}-from`} value={i}>{r.semester}</option>)}
          </select>
        </Control>

        <Control label="To">
          <select value={toIdx} onChange={(e) => setToIdx(Number(e.target.value))}>
            {data.map((r, i) => <option key={`${r.semester}-to`} value={i}>{r.semester}</option>)}
          </select>
        </Control>
      </div>

      <div className={styles.Stats}>
        <StatCard title="Total Usage" value={stats.total} />
        <StatCard title="Avg / Semester" value={stats.avg} />
        <StatCard title="Peak" value={`${stats.peakVal}`} sub={stats.peakSem} />
        <StatCard title="Growth" value={`${stats.growthPct}%`} sub="First → Last" />
      </div>

      <article className={styles.ChartCard}>
        <h2>{selectedItem || "—"} by Semester</h2>
        <div className={styles.ChartWrap} style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={chartData} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="semester" tickMargin={8} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="usage" name="Usage" stroke="#6c7293" strokeWidth={2} dot={{ r: 3 }} />
                {chartData.length > 0 && (
                  <ReferenceDot
                    x={stats.peakSem}
                    y={stats.peakVal}
                    r={5}
                    fill="#3d4468"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="semester" tickMargin={8} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" name="Usage" fill="#6c7293" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}

function Control({ label, children }) {
  return (
    <div className={styles.Control}>
      <label>{label}</label>
      {children}
    </div>
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

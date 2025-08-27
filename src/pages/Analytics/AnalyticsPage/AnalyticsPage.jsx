// src/pages/AnalyticsPage/AnalyticsPage.jsx
import { useEffect, useState } from "react";
import Analytics from "../../../components/Analytics/Analytics"; 
import { getToken } from "../../../utilities/users-service"; 
import styles from "./AnalyticsPage.module.scss";

export default function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = getToken();
        const res = await fetch("/api/analytics/usage", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (res.ok) {
          setData(json.data || []);
        } else {
          setError(json.message || "Failed to load analytics");
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError("Server error while loading analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className={styles.Page}><p>Loading analytics…</p></div>;
  }
  if (error) {
    return <div className={styles.Page}><p className={styles.Error}>{error}</p></div>;
  }

  return (
    <main className={styles.Page}>
      <Analytics data={data} />
    </main>
  );
}

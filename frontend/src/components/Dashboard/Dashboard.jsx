import { useEffect, useState } from "react";

import API from "../../services/api";
import PieChart from "../Charts/PieChart";

import "./Dashboard.css";

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await API.get("history/");

      setHistory(response.data);
    } catch (error) {
      console.error("Dashboard History API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const total = history.length;

  const real = history.filter(
    (item) => item.prediction === "Real"
  ).length;

  const fake = history.filter(
    (item) => item.prediction === "Fake"
  ).length;

  const accuracy =
    total === 0
      ? 0
      : ((real / total) * 100).toFixed(1);

  return (
    <div className="dashboard">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="dashboard-header">

        <h2 className="dashboard-title">
          Dashboard
        </h2>

        <p className="dashboard-subtitle">
          Overview of your fake news detection activity
        </p>

      </div>


      {/* =========================================
          STAT CARDS
      ========================================= */}

      <div className="stats-container">

        {/* TOTAL */}

        <div className="stat-card total">

          <div className="stat-card-content">

            <h3>Total Predictions</h3>

            <h1>
              {loading ? "..." : total}
            </h1>

          </div>

        </div>


        {/* REAL */}

        <div className="stat-card real">

          <div className="stat-card-content">

            <h3>Real News</h3>

            <h1>
              {loading ? "..." : real}
            </h1>

          </div>

        </div>


        {/* FAKE */}

        <div className="stat-card fake">

          <div className="stat-card-content">

            <h3>Fake News</h3>

            <h1>
              {loading ? "..." : fake}
            </h1>

          </div>

        </div>


        {/* ACCURACY */}

        <div className="stat-card accuracy">

          <div className="stat-card-content">

            <h3>Real News Rate</h3>

            <h1>
              {loading ? "..." : `${accuracy}%`}
            </h1>

          </div>

        </div>

      </div>


      {/* =========================================
          CHART
      ========================================= */}

      <div className="chart-section">

        <div className="chart-header">

          <h2>Prediction Overview</h2>

          <p>
            Distribution of real and fake news predictions
          </p>

        </div>

        <div className="chart-content">

          {!loading && total > 0 ? (

            <PieChart
              real={real}
              fake={fake}
            />

          ) : (

            <div className="dashboard-empty">

              {loading
                ? "Loading dashboard..."
                : "No prediction data available."}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import NewsForm from "../components/NewsForm/NewsForm";
import History from "../components/History/History";
import PieChart from "../components/Charts/PieChart";
import StatsCard from "../components/StatsCard/StatsCard";
import PredictionLineChart from "../components/Charts/LineChart";

import API from "../services/api";
import "./Home.css";

function Home() {
  const [history, setHistory] = useState([]);

  // ==========================================
  // FETCH PREDICTION HISTORY
  // ==========================================

  const fetchHistory = async () => {
    try {
      const response = await API.get("history/");

      setHistory(response.data);
    } catch (error) {
      console.error("History API Error:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response:", error.response.data);
      }
    }
  };

  // ==========================================
  // LOAD HISTORY
  // ==========================================

  useEffect(() => {
    fetchHistory();
  }, []);

  // ==========================================
  // STATISTICS
  // ==========================================

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
      : Math.round((real / total) * 100);

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="home-page">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <Navbar />

      {/* ======================================
          HERO
      ====================================== */}

      <Hero />

      {/* ======================================
          DASHBOARD
      ====================================== */}

      <div className="dashboard-container">

        {/* ====================================
            STATISTICS
        ==================================== */}

        <section className="stats-section">

          <div className="section-heading">

            <div>

              <h3>
                Prediction Overview
              </h3>

              <p>
                Monitor your latest fake news detection
                statistics.
              </p>

            </div>

          </div>

          <div className="stats-grid">

            <StatsCard
              title="Total Predictions"
              value={total}
              color="#2563eb"
              icon="📄"
            />

            <StatsCard
              title="Real News"
              value={real}
              color="#22c55e"
              icon="🟢"
            />

            <StatsCard
              title="Fake News"
              value={fake}
              color="#ef4444"
              icon="🔴"
            />

            <StatsCard
              title="Accuracy"
              value={accuracy}
              color="#f59e0b"
              icon="🎯"
            />

          </div>

        </section>


        {/* ====================================
            NEWS PREDICTION
        ==================================== */}

        <section className="prediction-section">

          <div className="section-heading">

            <div>

              <h3>
                Check News
              </h3>

              <p>
                Enter a news article to determine
                whether it is likely to be real or fake.
              </p>

            </div>

            <span className="live-status">

              <span className="live-dot"></span>

              Detection Active

            </span>

          </div>

          <NewsForm
            fetchHistory={fetchHistory}
          />

        </section>


        {/* ====================================
            PREDICTION ANALYTICS
        ==================================== */}

        <section className="analytics-section">

          {/* ANALYTICS HEADING */}

          <div className="analytics-heading">

            <h2>
              Prediction Analytics
            </h2>

            <p>
              Visualize your prediction results and
              activity over time.
            </p>

          </div>


          {/* ANALYTICS CHARTS */}

          <div className="analytics-grid">

            {/* ==================================
                PIE CHART
            ================================== */}

            <div className="analytics-chart">

              <PieChart
                real={real}
                fake={fake}
              />

            </div>


            {/* ==================================
                LINE CHART
            ================================== */}

            <div className="analytics-chart">

              <PredictionLineChart
                history={history}
              />

            </div>

          </div>

        </section>


        {/* ====================================
            PREDICTION HISTORY
        ==================================== */}

        <section className="history-section">

          <div className="section-heading">

            <div>

              <h3>
                Prediction History
              </h3>

              <p>
                Review your previous news analysis
                results.
              </p>

            </div>

            <span className="history-count">

              {total}{" "}

              {total === 1
                ? "Prediction"
                : "Predictions"}

            </span>

          </div>

          <div className="history-card">

            <History
              history={history}
              setHistory={setHistory}
            />

          </div>

        </section>

      </div>

    </div>
  );
}

export default Home;
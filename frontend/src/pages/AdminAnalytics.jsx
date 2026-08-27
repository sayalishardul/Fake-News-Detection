import { useEffect, useState } from "react";

import API from "../services/api";
import AdminSidebar from "../components/Admin/AdminSidebar";

import "./AdminAnalytics.css";

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    total_users: 0,
    total_predictions: 0,
    real_news: 0,
    fake_news: 0,
  });

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH ANALYTICS
  // ==========================================

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await API.get("admin/dashboard/");

      console.log(
        "Analytics Response:",
        response.data
      );

      setAnalytics({
        total_users:
          response.data.total_users || 0,

        total_predictions:
          response.data.total_predictions || 0,

        real_news:
          response.data.real_news || 0,

        fake_news:
          response.data.fake_news || 0,
      });
    } catch (error) {
      console.error(
        "Analytics API Error:",
        error
      );

      if (error.response) {
        console.error(
          "Status:",
          error.response.status
        );

        console.error(
          "Response:",
          error.response.data
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CALCULATE PERCENTAGES
  // ==========================================

  const total = analytics.total_predictions;

  const realPercentage =
    total > 0
      ? (
          (analytics.real_news / total) *
          100
        ).toFixed(1)
      : 0;

  const fakePercentage =
    total > 0
      ? (
          (analytics.fake_news / total) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="admin-layout">

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <AdminSidebar />

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div className="admin-content">

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div className="analytics-header">

          <h1>Analytics</h1>

          <p>
            Analyze fake news detection statistics
          </p>

        </div>

        {/* ==========================================
            SUMMARY CARDS
        ========================================== */}

        <div className="analytics-cards">

          {/* TOTAL USERS */}

          <div className="analytics-card">

            <div className="analytics-card-title">
              Total Users
            </div>

            <div className="analytics-card-value">
              {loading
                ? "..."
                : analytics.total_users}
            </div>

          </div>

          {/* TOTAL PREDICTIONS */}

          <div className="analytics-card">

            <div className="analytics-card-title">
              Total Predictions
            </div>

            <div className="analytics-card-value">
              {loading
                ? "..."
                : total}
            </div>

          </div>

          {/* REAL NEWS */}

          <div className="analytics-card real-card">

            <div className="analytics-card-title">
              Real News
            </div>

            <div className="analytics-card-value">
              {loading
                ? "..."
                : analytics.real_news}
            </div>

            <div className="analytics-percentage">
              {realPercentage}%
            </div>

          </div>

          {/* FAKE NEWS */}

          <div className="analytics-card fake-card">

            <div className="analytics-card-title">
              Fake News
            </div>

            <div className="analytics-card-value">
              {loading
                ? "..."
                : analytics.fake_news}
            </div>

            <div className="analytics-percentage">
              {fakePercentage}%
            </div>

          </div>

        </div>

        {/* ==========================================
            PREDICTION OVERVIEW
        ========================================== */}

        <div className="analytics-section">

          <div className="analytics-section-header">

            <h2>
              Prediction Overview
            </h2>

            <p>
              Real news vs fake news distribution
            </p>

          </div>

          {!loading && total > 0 ? (

            <div className="analytics-chart-container">

              {/* ======================================
                  DONUT CHART
              ====================================== */}

              <div
                className="analytics-donut"
                style={{
                  background: `conic-gradient(
                    #16a34a 0% ${realPercentage}%,
                    #dc2626 ${realPercentage}% 100%
                  )`,
                }}
              >

                <div className="analytics-donut-center">

                  <strong>
                    {total}
                  </strong>

                  <span>
                    Predictions
                  </span>

                </div>

              </div>

              {/* ======================================
                  LEGEND
              ====================================== */}

              <div className="analytics-legend">

                {/* REAL */}

                <div className="legend-item">

                  <span className="legend-color real-color"></span>

                  <div>

                    <strong>
                      Real News
                    </strong>

                    <p>
                      {analytics.real_news} predictions
                    </p>

                  </div>

                  <span className="legend-percentage">
                    {realPercentage}%
                  </span>

                </div>

                {/* FAKE */}

                <div className="legend-item">

                  <span className="legend-color fake-color"></span>

                  <div>

                    <strong>
                      Fake News
                    </strong>

                    <p>
                      {analytics.fake_news} predictions
                    </p>

                  </div>

                  <span className="legend-percentage">
                    {fakePercentage}%
                  </span>

                </div>

              </div>

            </div>

          ) : (

            <div className="analytics-empty">

              {loading
                ? "Loading analytics..."
                : "No prediction data available."}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminAnalytics;
import { useEffect, useState } from "react";
import API from "../../services/api";
import "./History.css";

import { exportPDF } from "../../utils/exportPDF";
import { exportCSV } from "../../utils/exportCSV";
import { toast } from "react-toastify";

function History({ history, setHistory }) {
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // ==========================================
  // FILTER HISTORY
  // ==========================================

  useEffect(() => {
    let data = [...history];

    if (search.trim() !== "") {
      const searchText = search.toLowerCase().trim();

      data = data.filter((item) =>
        item.news?.toLowerCase().includes(searchText)
      );
    }

    if (filter !== "All") {
      data = data.filter(
        (item) => item.prediction === filter
      );
    }

    setFilteredHistory(data);
  }, [history, search, filter]);

  // ==========================================
  // CLEAR HISTORY
  // ==========================================

  const clearHistory = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all prediction history?"
      )
    ) {
      return;
    }

    try {
      await API.delete("clear-history/");

      setHistory([]);

      toast.success(
        "History cleared successfully!"
      );
    } catch (error) {
      console.error("Clear History Error:", error);

      toast.error(
        "Failed to clear prediction history."
      );
    }
  };

  // ==========================================
  // DELETE SINGLE RECORD
  // ==========================================

  const deleteHistory = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this prediction?"
      )
    ) {
      return;
    }

    try {
      await API.delete(`history/${id}/`);

      const updatedHistory = history.filter(
        (item) => item.id !== id
      );

      setHistory(updatedHistory);

      toast.success(
        "Prediction deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Delete History Error:",
        error
      );

      toast.error(
        "Unable to delete prediction."
      );
    }
  };

  // ==========================================
  // EXPORT PDF
  // ==========================================

  const handleExportPDF = () => {
    if (filteredHistory.length === 0) {
      toast.warning(
        "No prediction data available to export."
      );
      return;
    }

    exportPDF(filteredHistory);

    toast.success(
      "PDF exported successfully!"
    );
  };

  // ==========================================
  // EXPORT CSV
  // ==========================================

  const handleExportCSV = () => {
    if (filteredHistory.length === 0) {
      toast.warning(
        "No prediction data available to export."
      );
      return;
    }

    exportCSV(filteredHistory);

    toast.success(
      "CSV exported successfully!"
    );
  };

  // ==========================================
  // SCORE FORMAT
  // ==========================================

  const formatScore = (score) => {
    if (score === null || score === undefined) {
      return "N/A";
    }

    const numericScore = Number(score);

    if (Number.isNaN(numericScore)) {
      return score;
    }

    return numericScore.toFixed(4);
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  return (
    <section
      className="history"
      id="history"
    >
      <div className="history-wrapper">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="history-header">

          <div className="history-title">

            <h2>
              📜 Prediction History
            </h2>

            <p>
              Review, search and manage your
              previous fake news predictions.
            </p>

          </div>

          {history.length > 0 && (
            <button
              className="clear-btn"
              onClick={clearHistory}
            >
              🗑 Clear History
            </button>
          )}

        </div>

        {/* ======================================
            CONTROLS
        ====================================== */}

        <div className="history-controls">

          {/* Search */}

          <div className="history-search">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search prediction history..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                className="search-clear"
                onClick={() => setSearch("")}
                type="button"
              >
                ×
              </button>
            )}

          </div>

          {/* Filter */}

          <select
            className="history-filter"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="All">
              All Predictions
            </option>

            <option value="Real">
              🟢 Real News
            </option>

            <option value="Fake">
              🔴 Fake News
            </option>
          </select>

        </div>

        {/* ======================================
            EXPORT BUTTONS
        ====================================== */}

        <div className="history-actions">

          <div className="history-result-count">

            Showing{" "}
            <strong>
              {filteredHistory.length}
            </strong>{" "}
            of{" "}
            <strong>
              {history.length}
            </strong>{" "}
            predictions

          </div>

          <div className="export-buttons">

            <button
              className="pdf-btn"
              onClick={handleExportPDF}
            >
              📄 Export PDF
            </button>

            <button
              className="csv-btn"
              onClick={handleExportCSV}
            >
              📊 Export CSV
            </button>

          </div>

        </div>

        {/* ======================================
            EMPTY STATE
        ====================================== */}

        {filteredHistory.length === 0 ? (

          <div className="empty-history">

            <div className="empty-icon">
              📭
            </div>

            <h3>
              No Prediction History Found
            </h3>

            <p>
              {history.length === 0
                ? "Your prediction results will appear here after you analyze some news."
                : "Try changing your search or filter."}
            </p>

          </div>

        ) : (

          /* ====================================
             HISTORY LIST
          ==================================== */

          <div className="history-list">

            {filteredHistory.map((item) => {

              const isReal =
                item.prediction === "Real";

              return (
                <article
                  className={`history-card ${
                    isReal
                      ? "history-real"
                      : "history-fake"
                  }`}
                  key={item.id}
                >

                  {/* ==============================
                      CARD HEADER
                  ============================== */}

                  <div className="history-card-header">

                    <div
                      className={`prediction-badge ${
                        isReal
                          ? "real-badge"
                          : "fake-badge"
                      }`}
                    >
                      {isReal
                        ? "🟢 REAL NEWS"
                        : "🔴 FAKE NEWS"}
                    </div>

                    <span className="history-date">
                      🕒{" "}
                      {formatDate(
                        item.created_at
                      )}
                    </span>

                  </div>

                  {/* ==============================
                      NEWS CONTENT
                  ============================== */}

                  <div className="news-content">

                    <p className="news-text">
                      {item.news}
                    </p>

                  </div>

                  {/* ==============================
                      CARD FOOTER
                  ============================== */}

                  <div className="history-footer">

                    <div className="score-container">

                      <span className="score-label">
                        Confidence Score
                      </span>

                      <span
                        className={`score-badge ${
                          isReal
                            ? "real-score"
                            : "fake-score"
                        }`}
                      >
                        {formatScore(
                          item.score
                        )}
                      </span>

                    </div>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteHistory(
                          item.id
                        )
                      }
                    >
                      🗑 Delete
                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>
    </section>
  );
}

export default History;
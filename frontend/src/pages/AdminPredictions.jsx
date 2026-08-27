import { useEffect, useState } from "react";

import API from "../services/api";
import AdminSidebar from "../components/Admin/AdminSidebar";

import "./AdminPredictions.css";

function AdminPredictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [search, setSearch] = useState("");

  // Filter
  const [filter, setFilter] = useState("All");

  // ==========================================
  // Fetch All Predictions
  // ==========================================

  const fetchPredictions = async () => {
    try {
      const response = await API.get("admin/predictions/");

      console.log("Predictions Response:", response.data);

      // Make sure response is an array
      const predictionData = Array.isArray(response.data)
        ? response.data
        : [];

      // Sort by ID ascending
      const sortedPredictions = [...predictionData].sort(
        (a, b) => a.id - b.id
      );

      setPredictions(sortedPredictions);
    } catch (error) {
      console.error("Predictions API Error:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Load Predictions
  // ==========================================

  useEffect(() => {
    fetchPredictions();
  }, []);

  // ==========================================
  // Delete Prediction
  // ==========================================

  const handleDelete = async (predictionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this prediction?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(
        `admin/predictions/${predictionId}/delete/`
      );

      // Remove deleted prediction from UI
      setPredictions((prevPredictions) =>
        prevPredictions.filter(
          (item) => item.id !== predictionId
        )
      );

      alert("Prediction deleted successfully.");
    } catch (error) {
      console.error(
        "Delete Prediction Error:",
        error
      );

      if (error.response) {
        alert(
          error.response.data?.error ||
            error.response.data?.message ||
            "Unable to delete prediction."
        );
      } else {
        alert("Unable to delete prediction.");
      }
    }
  };

  // ==========================================
  // Search + Filter
  // ==========================================

  const filteredPredictions = predictions.filter(
    (item) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const news =
        item.news?.toLowerCase() || "";

      const prediction =
        item.prediction || "";

      const matchesSearch =
        news.includes(searchText);

      const matchesFilter =
        filter === "All" ||
        prediction === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    }
  );

  // ==========================================
  // Clear Search + Filter
  // ==========================================

  const handleClearFilters = () => {
    setSearch("");
    setFilter("All");
  };

  // ==========================================
  // Render
  // ==========================================

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

        <div className="predictions-header">

          <h1>Predictions</h1>

          <p>
            View and manage fake news detection
            predictions.
          </p>

        </div>

        {/* ==========================================
            SEARCH + FILTER
        ========================================== */}

        <div className="predictions-controls">

          {/* Search */}

          <input
            type="text"
            className="predictions-search-input"
            placeholder="Search news..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {/* Filter */}

          <select
            className="predictions-filter"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >

            <option value="All">
              All Predictions
            </option>

            <option value="Real">
              Real News
            </option>

            <option value="Fake">
              Fake News
            </option>

          </select>

          {/* Clear */}

          {(search || filter !== "All") && (
            <button
              className="clear-prediction-btn"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          )}

        </div>

        {/* ==========================================
            TABLE CARD
        ========================================== */}

        <div className="predictions-table-card">

          {/* Loading */}

          {loading ? (

            <div className="predictions-loading">
              Loading predictions...
            </div>

          ) : filteredPredictions.length === 0 ? (

            /* Empty */

            <div className="predictions-empty">

              {search || filter !== "All"
                ? "No predictions found matching your search."
                : "No predictions found."}

            </div>

          ) : (

            /* Table */

            <div className="table-wrapper">

              <table className="predictions-table">

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>News</th>
                    <th>Prediction</th>
                    <th>Score</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredPredictions.map(
                    (item) => (

                      <tr key={item.id}>

                        {/* ID */}

                        <td>
                          {item.id}
                        </td>

                        {/* NEWS */}

                        <td className="prediction-news">
                          {item.news || "-"}
                        </td>

                        {/* PREDICTION */}

                        <td>

                          <span
                            className={
                              item.prediction === "Real"
                                ? "prediction-badge real"
                                : "prediction-badge fake"
                            }
                          >
                            {item.prediction || "-"}
                          </span>

                        </td>

                        {/* SCORE */}

                        <td className="prediction-score">
                          {item.score ?? "-"}
                        </td>

                        {/* CREATED DATE */}

                        <td className="prediction-date">

                          {item.created_at
                            ? new Date(
                                item.created_at
                              ).toLocaleString()
                            : "-"}

                        </td>

                        {/* DELETE */}

                        <td>

                          <button
                            className="delete-prediction-btn"
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminPredictions;
import { useState } from "react";
import { FaSearch, FaNewspaper, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";

import API from "../../services/api";

import Loader from "../Loader/Loader";
import PredictionCard from "../PredictionCard/PredictionCard";

import "./NewsForm.css";

function NewsForm({ fetchHistory }) {
  const [news, setNews] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (news.trim() === "") {
      toast.warning("Please enter some news.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("predict/", {
        news,
      });

      setResult(response.data);

      if (fetchHistory) {
        fetchHistory();
      }

      toast.success("Prediction completed successfully!");
    } catch (error) {
      console.error("Prediction Error:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response:", error.response.data);

        toast.error(
          error.response.data?.message ||
            error.response.data?.error ||
            "Server returned an error."
        );
      } else {
        toast.error("Cannot connect to backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setNews("");
    setResult(null);
  };

  return (
    <section className="news-wrapper">

      <div className="news-card">

        {/* Header */}
        <div className="news-header">

          <div className="news-icon">
            <FaNewspaper />
          </div>

          <div>
            <h2>Fake News Detection</h2>

            <p>
              Analyze news content using our machine learning model
              to determine whether it is real or fake.
            </p>
          </div>

        </div>

        {/* Information Bar */}
        <div className="news-info">

          <div className="info-item">
            <FaShieldAlt />
            <span>AI Powered Analysis</span>
          </div>

          <div className="info-item">
            <FaSearch />
            <span>Instant Prediction</span>
          </div>

        </div>

        {/* Input Section */}
        <div className="news-input-section">

          <div className="input-label-row">

            <label htmlFor="news-input">
              News Article
            </label>

            <span>
              {news.length} characters
            </span>

          </div>

          <textarea
            id="news-input"
            placeholder="Paste the news article or headline you want to analyze..."
            value={news}
            onChange={(e) => setNews(e.target.value)}
            disabled={loading}
          />

        </div>

        {/* Buttons */}
        <div className="news-actions">

          <button
            className="detect-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            <FaSearch />

            {loading
              ? " Detecting..."
              : " Detect News"}
          </button>

          {news && !loading && (
            <button
              className="clear-news-btn"
              onClick={handleClear}
            >
              Clear
            </button>
          )}

        </div>

        {/* Loading */}
        {loading && (
          <div className="prediction-loading">
            <Loader />

            <p>
              Analyzing the news article...
            </p>
          </div>
        )}

        {/* Result */}
        {!loading && result && (
          <div className="prediction-result-section">

            <div className="result-divider">
              <span>Prediction Result</span>
            </div>

            <PredictionCard result={result} />

          </div>
        )}

      </div>

    </section>
  );
}

export default NewsForm;
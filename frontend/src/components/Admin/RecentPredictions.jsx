import { useEffect, useState } from "react";

import API from "../../services/api";

import "./RecentPredictions.css";


function RecentPredictions() {

  const [predictions, setPredictions] = useState([]);


  useEffect(() => {
    fetchPredictions();
  }, []);


  const fetchPredictions = async () => {

    try {

      const response = await API.get("history/");

      console.log(
        "Recent Predictions:",
        response.data
      );

      setPredictions(
        response.data
          .slice()
          .sort((a, b) => b.id - a.id)
          .slice(0, 8)
      );

    } catch (error) {

      console.error(
        "Recent Predictions API Error:",
        error
      );

    }
  };


  return (

    <div className="recent-predictions">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="recent-predictions-header">

        <h2>
          Recent Predictions
        </h2>

        <p>
          Latest fake news detection results
        </p>

      </div>


      {/* =========================================
          TABLE
      ========================================= */}

      <div className="recent-predictions-table-wrapper">

        <table>

          <thead>

            <tr>

              <th>ID</th>

              <th>News</th>

              <th>Prediction</th>

              <th>Score</th>

            </tr>

          </thead>


          <tbody>

            {predictions.length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  className="no-predictions"
                >
                  No Predictions Found
                </td>

              </tr>

            ) : (

              predictions.map((item) => (

                <tr key={item.id}>

                  {/* ID */}

                  <td>
                    {item.id}
                  </td>


                  {/* NEWS */}

                  <td className="news-cell">

                    {item.news
                      ? item.news.length > 60
                        ? `${item.news.substring(0, 60)}...`
                        : item.news
                      : "N/A"}

                  </td>


                  {/* PREDICTION */}

                  <td>

                    <span
                      className={
                        item.prediction === "Real"
                          ? "prediction-real"
                          : "prediction-fake"
                      }
                    >

                      {item.prediction === "Real"
                        ? "Real"
                        : "Fake"}

                    </span>

                  </td>


                  {/* SCORE */}

                  <td className="score-cell">

                    {item.score !== null &&
                    item.score !== undefined
                      ? Number(item.score).toFixed(2)
                      : "N/A"}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}


export default RecentPredictions;
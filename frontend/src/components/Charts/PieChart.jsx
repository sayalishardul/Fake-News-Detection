import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

import "./PieChart.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function PieChart({ real = 0, fake = 0 }) {

  const hasData = real > 0 || fake > 0;

  const data = {
    labels: ["Real News", "Fake News"],

    datasets: [
      {
        data: hasData ? [real, fake] : [1, 1],

        backgroundColor: [
          "#22c55e",
          "#ef4444",
        ],

        borderColor: [
          "#16a34a",
          "#dc2626",
        ],

        borderWidth: 2,

        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        position: "bottom",

        labels: {
          padding: 18,

          usePointStyle: true,

          font: {
            size: 13,
            weight: "600",
          },
        },
      },

      tooltip: {
        callbacks: {

          label: function (context) {

            if (!hasData) {
              return "No Prediction Data";
            }

            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="pie-chart-container">

      <div className="chart-title">

        <h2>
          📊 Prediction Distribution
        </h2>

        <p>
          Real vs fake news predictions
        </p>

      </div>

      <div className="pie-chart-wrapper">

        <Pie
          data={data}
          options={options}
        />

      </div>

      <div className="pie-chart-summary">

        <div className="summary-item real">

          <span className="summary-dot"></span>

          <div>
            <span>Real News</span>
            <strong>{real}</strong>
          </div>

        </div>

        <div className="summary-item fake">

          <span className="summary-dot"></span>

          <div>
            <span>Fake News</span>
            <strong>{fake}</strong>
          </div>

        </div>

        <div className="summary-item total">

          <span className="summary-icon">
            📈
          </span>

          <div>
            <span>Total</span>
            <strong>{real + fake}</strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default PieChart;
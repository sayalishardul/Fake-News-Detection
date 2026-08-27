import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./LineChart.css";

function PredictionLineChart({ history = [] }) {

  const chartData = [];

  history.forEach((item) => {

    const date = new Date(
      item.created_at
    ).toLocaleDateString();

    const existing = chartData.find(
      (item) => item.date === date
    );

    if (existing) {

      existing.total += 1;

    } else {

      chartData.push({
        date,
        total: 1,
      });

    }

  });

  return (
    <div className="line-chart-container">

      <div className="line-chart-title">

        <h2>
          📈 Prediction Trend
        </h2>

        <p>
          Prediction activity over time
        </p>

      </div>

      <div className="line-chart-wrapper">

        {chartData.length === 0 ? (

          <div className="line-chart-empty">

            <span>📊</span>

            <p>
              No prediction activity yet
            </p>

          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 5,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 11,
                  fill: "#64748b",
                }}
                axisLine={{
                  stroke: "#cbd5e1",
                }}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fontSize: 11,
                  fill: "#64748b",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#2563eb",
                }}
                activeDot={{
                  r: 6,
                }}
              />

            </LineChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
}

export default PredictionLineChart;
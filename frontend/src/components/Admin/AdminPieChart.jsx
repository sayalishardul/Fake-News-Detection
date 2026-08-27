import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AdminPieChart({ real, fake }) {

  const data = [
    {
      name: "Real News",
      value: real,
    },
    {
      name: "Fake News",
      value: fake,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#ef4444",
  ];

  return (

    <div
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "15px",
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
      }}
    >

      <h3
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Prediction Distribution
      </h3>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            outerRadius={110}
            label
          >

            {data.map((entry, index) => (

              <Cell
                key={index}
                fill={COLORS[index]}
              />

            ))}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>

  );

}

export default AdminPieChart;
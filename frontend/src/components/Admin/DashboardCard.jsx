import "./DashboardCard.css";

function DashboardCard({ title, value, color, icon: Icon }) {
  return (
    <div
      className="dashboard-card"
      style={{
        borderTop: `5px solid ${color}`,
      }}
    >
      <div className="card-header">
        <div>
          <p>{title}</p>
          <h2>{value}</h2>
        </div>

        <div
          className="dashboard-icon"
          style={{
            color: color,
          }}
        >
          {Icon && <Icon />}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
import "./StatsCard.css";

function StatsCard({
  title,
  value,
  color,
  icon,
}) {
  return (
    <div className="stats-card">
      <div
        className="stats-icon"
        style={{ background: color }}
      >
        {icon}
      </div>

      <div className="stats-content">
        <h3>{title}</h3>

        <h2>
          {title === "Accuracy"
            ? `${value}%`
            : value}
        </h2>
      </div>
    </div>
  );
}

export default StatsCard;
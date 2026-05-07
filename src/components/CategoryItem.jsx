export default function CategoryItem({ label, value, color }) {
  return (
    <div className="category-item">
      <div className="category-info">
        <span>{label}</span>

        <span>{value}%</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${value}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  );
}

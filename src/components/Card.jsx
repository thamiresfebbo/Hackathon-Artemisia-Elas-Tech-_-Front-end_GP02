export default function Card({ title, value, icon }) {
  return (
    <div className="summary-card">
      <div className="card-header">
        <span className="card-title">{title}</span>

        {icon}
      </div>

      <h2 className="card-value">R$ {value.toLocaleString("pt-BR")}</h2>
    </div>
  );
}

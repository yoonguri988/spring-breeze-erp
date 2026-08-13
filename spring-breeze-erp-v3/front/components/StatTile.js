import { Card } from "antd";

function StatTile({ icon, tone, label, value }) {
  return (
    <Card bordered className={`sb-stat tone-${tone}`} bodyStyle={{ padding: 16 }}>
      <div className="sb-stat__top" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div className="sb-stat__ico">{icon}</div>
        <div className="sb-stat__label">{label}</div>
      </div>
      <div className="sb-stat__val" style={{ fontSize: 22, fontWeight: 700 }}>
        {value ?? "-"}
      </div>
    </Card>
  );
}

export default StatTile;
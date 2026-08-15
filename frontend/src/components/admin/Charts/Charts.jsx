import "../../../styles/admin/Charts.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "Mon", users: 2 },
  { name: "Tue", users: 5 },
  { name: "Wed", users: 4 },
  { name: "Thu", users: 8 },
  { name: "Fri", users: 6 },
  { name: "Sat", users: 10 },
  { name: "Sun", users: 12 },
];

function Charts() {
  return (
    <div className="chart-card">
      <h2>📈 Weekly Users Growth</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid stroke="#222" />

          <XAxis dataKey="name" stroke="#aaa" />

          <YAxis stroke="#aaa" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="users"
            stroke="#8b5cf6"
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Charts;
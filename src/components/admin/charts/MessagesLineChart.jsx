import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useTheme } from '../../../hooks/useTheme'

function formatDate(d) {
  try { return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) } catch { return d }
}

export default function MessagesLineChart({ data = [] }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const axis = dark ? '#94A3B8' : '#475569'
  const grid = dark ? 'rgba(148,163,184,0.15)' : 'rgba(148,163,184,0.25)'
  const tooltipBg = dark ? '#0B1120' : '#FFFFFF'
  const tooltipBorder = dark ? 'rgba(148,163,184,0.2)' : '#E2E8F0'

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="msgLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={grid} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="date" tickFormatter={formatDate} stroke={axis} tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis stroke={axis} tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} width={32} />
          <Tooltip
            contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, color: dark ? '#F8FAFC' : '#0F172A' }}
            labelFormatter={(v) => formatDate(v)}
            formatter={(value) => [value, 'Messages']}
          />
          <Line type="monotone" dataKey="messages" stroke="url(#msgLine)" strokeWidth={3} dot={{ r: 3, fill: '#22D3EE', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#38BDF8' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

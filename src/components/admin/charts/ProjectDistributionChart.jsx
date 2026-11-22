import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useTheme } from '../../../hooks/useTheme'

const COLORS = ['#38BDF8', '#22D3EE', '#A855F7', '#6366F1', '#0EA5E9']

export default function ProjectDistributionChart({ data = [], variant = 'donut' }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const axis = dark ? '#94A3B8' : '#475569'
  const grid = dark ? 'rgba(148,163,184,0.15)' : 'rgba(148,163,184,0.25)'
  const tooltipBg = dark ? '#0B1120' : '#FFFFFF'
  const tooltipBorder = dark ? 'rgba(148,163,184,0.2)' : '#E2E8F0'
  const text = dark ? '#F8FAFC' : '#0F172A'

  if (variant === 'bar') {
    return (
      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={grid} strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="name" stroke={axis} tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
            <YAxis stroke={axis} tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} width={32} />
            <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, color: text }} cursor={{ fill: dark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)' }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={3} stroke="none">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, color: text }} />
          <Legend wrapperStyle={{ fontSize: 12, color: axis }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

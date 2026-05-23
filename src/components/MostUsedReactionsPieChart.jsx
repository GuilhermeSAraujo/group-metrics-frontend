import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { withQueryString } from '../api/queryParams'
import ChartBarListLoading from './ChartBarListLoading'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = [
  '#805AD5',
  '#D53F8C',
  '#DD6B20',
  '#38A169',
  '#3182CE',
  '#00B5D8',
  '#E53E3E',
  '#D69E2E',
  '#319795',
  '#718096',
]

function toPieChartData(rows) {
  return rows.map((row) => ({
    name: row?.emoji ?? 'Unknown',
    value: Number(row?.count) || 0,
  }))
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  const { name, value } = payload[0]

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #E2E8F0',
        borderRadius: 8,
        padding: '8px 14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        fontSize: 15,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span style={{ fontSize: 22 }}>{name}</span>
      <span style={{ fontWeight: 600, color: '#2D3748' }}>{value.toLocaleString()}</span>
      <span style={{ color: '#718096', fontWeight: 400 }}>reactions</span>
    </div>
  )
}

function CustomLegend({ payload }) {
    const sorted = [...payload].sort((a, b) => b.payload.value - a.payload.value)

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '8px 16px',
        marginTop: 4,
      }}
    >
      {sorted.map((entry, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
            color: '#4A5568',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: entry.color,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 18 }}>{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function MostUsedReactionsPieChart() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      try {
        setIsLoading(true)

        const payload = await api.getJson('/most-used-reactions')

        if (cancelled) return

        if (!Array.isArray(payload)) {
          setData([])
          return
        }

        setData(toPieChartData(payload))
      } catch (err) {
        console.error(err)

        if (!cancelled) {
          setData([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [])

  if (isLoading) {
    return <ChartBarListLoading />
  }

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div style={{ width: '100%', height: 420, background: 'white' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={80}
            outerRadius={145}
            paddingAngle={3}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="white"
                strokeWidth={2}
              />
            ))}
            {/* Donut centre label */}
            <text
              x="50%"
              y="43%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 28, fontWeight: 700, fill: '#2D3748' }}
            >
              {total.toLocaleString()}
            </text>
            <text
              x="50%"
              y="43%"
              dy={26}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 12, fill: '#718096' }}
            >
              total reactions
            </text>
          </Pie>

          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
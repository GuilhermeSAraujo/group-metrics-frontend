import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { withQueryString } from '../api/queryParams'
import ChartBarListLoading from './ChartBarListLoading'

import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'

function toLineChartData(rows) {
  return rows.map((row) => ({
    hour: String(row?.hour + 'h' ?? 'Unknown'),
    messages: Number(row?.value) || 0,
  }))
}

export default function MessagesByHourLineChart({
  queryString = '',
}) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      try {
        setIsLoading(true)

        const payload = await api.getJson(
          withQueryString('/activity-by-day', queryString)
        )

        console.log('payload', payload)

        if (cancelled) return

        if (!Array.isArray(payload)) {
          setData([])
          return
        }

        setData(toLineChartData(payload))
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
  }, [queryString])

  console.log('chart data', data)

  if (isLoading) {
    return <ChartBarListLoading />
  }

  return (
    <div
      style={{
        width: '100%',
        height: 400,
        background: 'white',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="hour"
          />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="messages"
            stroke="#805AD5"
            strokeWidth={3}
            dot={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
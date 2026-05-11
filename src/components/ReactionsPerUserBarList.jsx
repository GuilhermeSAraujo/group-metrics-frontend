import { useEffect, useState } from 'react'
import { BarList, useChart } from '@chakra-ui/charts'
import { api } from '../api/client'
import ChartBarListLoading from './ChartBarListLoading'

/** Adapt `{ member_id, member_name, total }` rows into Chakra BarListData. */
function toBarListData(reactions) {
  if (!Array.isArray(reactions)) return []
  return reactions
    .map((row) => ({
      name: row?.member_name?.trim() || row?.member_id || 'Unknown',
      value: Number(row?.total) || 0,
    }))
    .filter((row) => row.value > 0)
}

export default function ReactionsPerUserBarList({ seriesColor = 'blue.subtle' }) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    api
      .getJson('/count-reactions-by-user')
      .then((payload) => {
        if (cancelled || !payload || typeof payload !== 'object') return
        setData(toBarListData(payload.reactions))
      })
      .catch(() => {
        if (!cancelled) setData([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const chart = useChart({
    sort: { by: 'value', direction: 'desc' },
    data,
    series: [{ name: 'name', color: seriesColor }],
  })

  if (isLoading) {
    return <ChartBarListLoading seriesColor={seriesColor} />
  }

  return (
    <BarList.Root chart={chart} w="full" py={2} barSize="11">
      <BarList.Content>
        <BarList.Bar />
        <BarList.Value />
      </BarList.Content>
    </BarList.Root>
  )
}

import { useEffect, useState } from 'react'
import { BarList, useChart } from '@chakra-ui/charts'
import { Stack, Text } from '@chakra-ui/react'
import { api } from '../api/client'
import ChartBarListLoading from './ChartBarListLoading'

function toBarListData(rows, valueKey) {
  return rows
    .map((row) => ({
      name: row?.member_name?.trim() || row?.member_id || 'Desconhecido - bugou :(',
      value: Number(row?.[valueKey]) || 0,
    }))
    .filter((row) => row.value > 0)
}

function StreakBarList({ data, seriesColor }) {
  const chart = useChart({
    sort: { by: 'value', direction: 'desc' },
    data,
    series: [{ name: 'name', color: seriesColor }],
  })

  return (
    <BarList.Root chart={chart} w="full" py={2} barSize="11">
      <BarList.Content>
        <BarList.Bar />
        <BarList.Value />
      </BarList.Content>
    </BarList.Root>
  )
}

export default function CurrentStreakList({ seriesColor = 'teal.subtle' }) {
  const [rows, setRows] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    api
      .getJson('/current-streak')
      .then((payload) => {
        if (cancelled || !payload || !Array.isArray(payload)) return
        setRows(payload)
      })
      .catch(() => {
        if (!cancelled) setRows([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (isLoading) {
    return <ChartBarListLoading seriesColor={seriesColor} />
  }

  const currentData = toBarListData(rows, 'current_streak')
  const maxData = toBarListData(rows, 'max_streak')

  return (
    <Stack gap={6} w="full">
      <Stack gap={1}>
        <Text fontSize="sm" fontWeight="700" color="gray.700">
          Streak atual
        </Text>
        <StreakBarList data={currentData} seriesColor={seriesColor} />
      </Stack>
      <Stack gap={1}>
        <Text fontSize="sm" fontWeight="700" color="gray.700">
          Maior streak
        </Text>
        <StreakBarList data={maxData} seriesColor="purple.subtle" />
      </Stack>
    </Stack>
  )
}

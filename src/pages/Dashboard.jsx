import { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  Input,
  Text,
  createListCollection,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react'
import { SelectContent, SelectItem, SelectPositioner, SelectRoot, SelectTrigger, SelectValueText } from '../components/ui/select'
import Sidebar from '../components/Sidebar'
import ChartPlaceholder from '../components/ChartPlaceholder'
import { api } from '../api/client'
import { buildDateRangeQueryString, withQueryString } from '../api/queryParams'

const chartOptions = createListCollection({
  items: [
    { label: 'Mensagens por Participante', value: 'messages_per_user' },
    { label: 'Reações recebidas', value: 'reactions_per_user' },
    { label: 'Respostas recebidas', value: 'replies_per_user' },
  ],
})

export default function Dashboard() {
  const [selectedChart, setSelectedChart] = useState(['messages_per_user'])
  const [dashboardMetrics, setDashboardMetrics] = useState(null)
  const [availableDateRange, setAvailableDateRange] = useState({ min: '', max: '' })
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [dateFilterError, setDateFilterError] = useState(null)
  const dateRangeQueryString = buildDateRangeQueryString(startDate, endDate)

  useEffect(() => {
    let cancelled = false

    api
      .getJson('/available-filters')
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return

        const dates = data
          .filter((date) => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date))
          .sort()

        if (dates.length === 0) {
          setAvailableDateRange({ min: '', max: '' })
          setStartDate('')
          setEndDate('')
          return
        }

        setDateFilterError(null)
        setAvailableDateRange({ min: dates[0], max: dates[dates.length - 1] })
        setStartDate(dates[0])
        setEndDate(dates[dates.length - 1])
      })
      .catch(() => {
        if (!cancelled) {
          setDateFilterError('Não foi possível carregar as datas disponíveis.')
          setAvailableDateRange({ min: '', max: '' })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!dateRangeQueryString) return

    let cancelled = false

    api
      .getJson(withQueryString('/dashboard-metrics', dateRangeQueryString))
      .then((data) => {
        if (cancelled || !data || typeof data !== 'object') return
        setDashboardMetrics({
          messages: data['total-messages']?.[0]?.count ?? 0,
          reactions: data['total-reactions']?.[0]?.count ?? 0,
          replies: data['total-replies']?.[0]?.count ?? 0,
        })
      })
      .catch(() => {
        if (!cancelled) setDashboardMetrics(null)
      })

    return () => {
      cancelled = true
    }
  }, [dateRangeQueryString])

  const currentChart = chartOptions.items.find(
    (item) => item.value === selectedChart[0]
  )
  const shouldPositionChartSelect = useBreakpointValue({ base: false, md: true }) ?? false

  const clampDateToAvailableRange = (date) => {
    if (!date) return ''
    if (availableDateRange.min && date < availableDateRange.min) return availableDateRange.min
    if (availableDateRange.max && date > availableDateRange.max) return availableDateRange.max
    return date
  }

  const handleStartDateChange = (event) => {
    const nextStartDate = clampDateToAvailableRange(event.target.value)
    setStartDate(nextStartDate)

    if (endDate && nextStartDate > endDate) {
      setEndDate(nextStartDate)
    }
  }

  const handleEndDateChange = (event) => {
    const nextEndDate = clampDateToAvailableRange(event.target.value)
    setEndDate(nextEndDate)

    if (startDate && nextEndDate < startDate) {
      setStartDate(nextEndDate)
    }
  }

  const chartSelectContent = (
    <SelectContent borderRadius="xl" shadow="lg" zIndex="dropdown">
      {chartOptions.items.map((chart) => (
        <SelectItem
          item={chart}
          key={chart.value}
          borderRadius="md"
          _highlighted={{ bg: 'purple.50', color: 'purple.700' }}
        >
          {chart.label}
        </SelectItem>
      ))}
    </SelectContent>
  )

  return (
    <Flex minH="100vh" bg="gray.50" fontFamily="'IBM Plex Sans', sans-serif">
      <Sidebar />

      <Box flex="1" p={{ base: 4, md: 8 }}>
        {/* Header */}
        <Flex
          justify="space-between"
          align={{ base: 'flex-start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
          gap={4}
          mb={8}
        >
          <Stack gap={0}>
            <Heading
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="800"
              color="gray.900"
              letterSpacing="-0.03em"
            >
              Dashboard Insights
            </Heading>
            <Text color="gray.500" fontSize="sm" mt={1}>
              Estatísticas do grupo LosToppersons
            </Text>
          </Stack>

          <Stack
            direction={{ base: 'column', lg: 'row' }}
            gap={3}
            w={{ base: 'full', lg: 'auto' }}
            align={{ base: 'stretch', lg: 'end' }}
          >
            {/* Chart Selector */}
            <Box w={{ base: 'full', sm: '280px' }}>
              <SelectRoot
                collection={chartOptions}
                value={selectedChart}
                onValueChange={(e) => setSelectedChart(e.value)}
                size="md"
              >
                <SelectTrigger
                  bg="white"
                  borderColor="gray.200"
                  borderRadius="xl"
                  shadow="sm"
                  _hover={{ borderColor: 'purple.400' }}
                  _focus={{ borderColor: 'purple.500', shadow: 'outline' }}
                >
                  <SelectValueText placeholder="Select a chart" />
                </SelectTrigger>
                {shouldPositionChartSelect ? (
                  <SelectPositioner>
                    {chartSelectContent}
                  </SelectPositioner>
                ) : (
                  chartSelectContent
                )}
              </SelectRoot>
            </Box>

            <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
              <Box>
                <Text as="label" htmlFor="start-date" fontSize="xs" color="gray.500" fontWeight="700">
                  Data inicial
                </Text>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  min={availableDateRange.min || undefined}
                  max={endDate || availableDateRange.max || undefined}
                  onChange={handleStartDateChange}
                  disabled={!availableDateRange.min}
                  bg="white"
                  borderColor="gray.200"
                  borderRadius="xl"
                  shadow="sm"
                  mt={1}
                  _hover={{ borderColor: 'purple.400' }}
                  _focus={{ borderColor: 'purple.500', shadow: 'outline' }}
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="end-date" fontSize="xs" color="gray.500" fontWeight="700">
                  Data final
                </Text>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  min={startDate || availableDateRange.min || undefined}
                  max={availableDateRange.max || undefined}
                  onChange={handleEndDateChange}
                  disabled={!availableDateRange.max}
                  bg="white"
                  borderColor="gray.200"
                  borderRadius="xl"
                  shadow="sm"
                  mt={1}
                  _hover={{ borderColor: 'purple.400' }}
                  _focus={{ borderColor: 'purple.500', shadow: 'outline' }}
                />
              </Box>
            </Flex>

            {dateFilterError && (
              <Text color="red.500" fontSize="sm">
                {dateFilterError}
              </Text>
            )}
          </Stack>
        </Flex>

        {/* Stats Row */}
        <Flex gap={4} mb={8} direction={{ base: 'column', sm: 'row' }}>
          {[
            {
              label: 'Total de Mensagens',
              value: dashboardMetrics?.messages,
            },
            {
              label: 'Total de Reações',
              value: dashboardMetrics?.reactions,
            },
            {
              label: 'Total Respostas',
              value: dashboardMetrics?.replies,
            },
          ].map((stat) => (
            <Box
              key={stat.label}
              flex="1"
              bg="white"
              borderRadius="2xl"
              p={5}
              shadow="sm"
              borderWidth="1px"
              borderColor="gray.100"
            >
              <Text fontSize="xs" color="gray.400" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em">
                {stat.label}
              </Text>
              <Text fontSize="2xl" fontWeight="800" color="gray.800" mt={1}>
                {stat.value !== undefined ? stat.value : '—'}
              </Text>
            </Box>
          ))}
        </Flex>

        {/* Chart Area */}
        <ChartPlaceholder
          chartType={selectedChart[0]}
          label={currentChart?.label ?? 'Chart'}
          queryString={dateRangeQueryString}
        />
      </Box>
    </Flex>
  )
}

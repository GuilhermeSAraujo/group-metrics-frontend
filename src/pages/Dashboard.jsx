import { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  createListCollection,
  Stack,
} from '@chakra-ui/react'
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '../components/ui/select'
import Sidebar from '../components/Sidebar'
import ChartPlaceholder from '../components/ChartPlaceholder'
import { api } from '../api/client'

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

  useEffect(() => {
    let cancelled = false

    api
      .getJson('/dashboard-metrics')
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
  }, [])

  const currentChart = chartOptions.items.find(
    (item) => item.value === selectedChart[0]
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
              <SelectContent borderRadius="xl" shadow="lg">
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
            </SelectRoot>
          </Box>
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
        />
      </Box>
    </Flex>
  )
}

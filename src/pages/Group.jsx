import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { buildDateQueryString, buildDateRangeQueryString, withQueryString } from '../api/queryParams'
import {
    Box,
    Flex,
    Heading,
    Input,
    Text,
    createListCollection,
    Stack,
    useBreakpointValue,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
    SelectPositioner,
    SelectContent,
    SelectItem,
} from '@chakra-ui/react'
import Sidebar from '../components/Sidebar'
import ChartPlaceholder from '../components/ChartPlaceholder'

export default function Group() {
    const [selectedChart, setSelectedChart] = useState(['hour_activity'])

    const [availableDateRange, setAvailableDateRange] = useState({ min: '', max: '' })
    const [filterDate, setFilterDate] = useState('')
    const [dateFilterError, setDateFilterError] = useState(null)
    const [date, setDate] = useState('')

    const dateRangeQueryString = buildDateQueryString(date)
    console.log("dateRangeQueryString", dateRangeQueryString)

    const chartOptions = createListCollection({
        items: [
            { label: 'Atividade por hora', value: 'hour_activity' },
            { label: 'Reações mais usadas', value: 'most_used_reactions' },
            { label: 'Streak mais longa', value: 'longest_streak' },
        ],
    })

    const currentChart = chartOptions.items.find(
        (item) => item.value === selectedChart[0]
    )

    const shouldPositionChartSelect = useBreakpointValue({ base: false, md: true }) ?? false


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
                    setDate('')
                    return
                }

                setDateFilterError(null)
                setAvailableDateRange({ min: dates[0], max: dates[dates.length - 1] })
                setDate(dates[dates.length - 1])
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

    const handleDateChange = (event) => {
        const nextStartDate = event.target.value
        setDate(nextStartDate)
    }

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
                            Group Activity
                        </Heading>
                        <Text color="gray.500" fontSize="sm" mt={1}>
                            Estatísticas gerais do grupo LosToppersons
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
                                    Data
                                </Text>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    min={availableDateRange.min || undefined}
                                    max={availableDateRange.max || undefined}
                                    onChange={handleDateChange}
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
                        </Flex>

                        {dateFilterError && (
                            <Text color="red.500" fontSize="sm">
                                {dateFilterError}
                            </Text>
                        )}
                    </Stack>
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

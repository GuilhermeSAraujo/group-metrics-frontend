import { useEffect, useState } from 'react'
import { Box, Flex, Heading, Input, Stack, Text } from '@chakra-ui/react'
import { api } from '../api/client'
import { buildDateRangeQueryString } from '../api/queryParams'
import TopicsList from '../components/TopicsList'
import ChartBarListLoading from '../components/ChartBarListLoading'

export default function Topics() {
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

  return (
    <>
      <Flex
        justify="space-between"
        align={{ base: 'flex-start', sm: 'center' }}
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 3, md: 4 }}
        mb={{ base: 4, md: 8 }}
      >
        <Stack gap={0}>
          <Heading
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="800"
            color="gray.900"
            letterSpacing="-0.03em"
          >
            Tópicos
          </Heading>
          <Text color="gray.500" fontSize="sm" mt={1}>
            Assuntos classificados no grupo LosToppersons
          </Text>
        </Stack>

        <Stack gap={1} align={{ base: 'stretch', sm: 'flex-end' }}>
          <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
            <Box>
              <Text as="label" htmlFor="topics-start-date" fontSize="xs" color="gray.500" fontWeight="700">
                Data inicial
              </Text>
              <Input
                id="topics-start-date"
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
              <Text as="label" htmlFor="topics-end-date" fontSize="xs" color="gray.500" fontWeight="700">
                Data final
              </Text>
              <Input
                id="topics-end-date"
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

      <Box
        bg="white"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="gray.100"
        shadow="sm"
        overflow="hidden"
      >
        <Flex
          px={{ base: 4, md: 6 }}
          py={4}
          borderBottomWidth="1px"
          borderColor="gray.100"
          align="center"
          justify="space-between"
        >
          <Stack gap={0.5}>
            <Text fontWeight="700" fontSize="md" color="gray.800" letterSpacing="-0.01em">
              Tópicos no período
            </Text>
            <Text fontSize="xs" color="gray.400">
              Cada ocorrência é uma janela de conversa classificada. Abra um tópico para ver os horários.
            </Text>
          </Stack>
        </Flex>

        <Box px={{ base: 4, md: 6 }} py={4}>
          {dateRangeQueryString ? (
            <TopicsList key={dateRangeQueryString} queryString={dateRangeQueryString} />
          ) : (
            <ChartBarListLoading seriesColor="purple.subtle" />
          )}
        </Box>
      </Box>
    </>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Accordion, Badge, Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { api } from '../api/client'
import { withQueryString } from '../api/queryParams'
import ChartBarListLoading from './ChartBarListLoading'
import WindowMessagesDialog from './WindowMessagesDialog'

const saoPaulo = { timeZone: 'America/Sao_Paulo' }
const dateFmt = new Intl.DateTimeFormat('pt-BR', {
  ...saoPaulo,
  day: '2-digit',
  month: '2-digit',
})
const timeFmt = new Intl.DateTimeFormat('pt-BR', {
  ...saoPaulo,
  hour: '2-digit',
  minute: '2-digit',
})

function formatWindow(row) {
  const start = new Date(row.started_at)
  const end = new Date(row.ended_at)
  const startDate = dateFmt.format(start)
  const endDate = dateFmt.format(end)
  const messages = Number(row.message_count) || 0

  return {
    id: row.id,
    windowIds: Array.isArray(row.window_ids) && row.window_ids.length > 0 ? row.window_ids : [row.id],
    date: startDate === endDate ? startDate : `${startDate} – ${endDate}`,
    range: `${timeFmt.format(start)} – ${timeFmt.format(end)}`,
    messagesLabel: messages === 1 ? '1 mensagem' : `${messages} mensagens`,
    probability: Math.round((Number(row.probability) || 0) * 100),
  }
}

export default function TopicsList({ queryString = '' }) {
  const [topics, setTopics] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState([])
  const [windowsByTopic, setWindowsByTopic] = useState({})
  const [selectedWindow, setSelectedWindow] = useState(null)
  const windowsRef = useRef({})

  useEffect(() => {
    let cancelled = false

    api
      .getJson(withQueryString('/topics', queryString))
      .then((payload) => {
        if (cancelled || !Array.isArray(payload)) return
        setTopics(payload.filter((row) => Number(row?.total) > 0))
      })
      .catch(() => {
        if (!cancelled) {
          setTopics([])
          setError('Não foi possível carregar os tópicos.')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [queryString])

  function loadWindows(topicId) {
    const cached = windowsRef.current[topicId]
    if (cached && cached.status !== 'error') return

    windowsRef.current[topicId] = { status: 'loading', rows: [] }
    setWindowsByTopic({ ...windowsRef.current })

    const params = new URLSearchParams(queryString)
    params.set('topic', topicId)

    api
      .getJson(`/topic-windows?${params}`)
      .then((payload) => {
        windowsRef.current[topicId] = {
          status: 'ready',
          rows: Array.isArray(payload) ? payload.map(formatWindow) : [],
        }
        setWindowsByTopic({ ...windowsRef.current })
      })
      .catch(() => {
        windowsRef.current[topicId] = { status: 'error', rows: [] }
        setWindowsByTopic({ ...windowsRef.current })
      })
  }

  if (isLoading) {
    return <ChartBarListLoading seriesColor="purple.subtle" />
  }

  if (error) {
    return (
      <Text color="red.500" fontSize="sm" py={6}>
        {error}
      </Text>
    )
  }

  if (topics.length === 0) {
    return (
      <Text color="gray.500" fontSize="sm" py={6}>
        Nenhum tópico classificado neste período.
      </Text>
    )
  }

  const maxTotal = Math.max(...topics.map((topic) => Number(topic.total) || 0), 1)

  return (
    <>
    <Accordion.Root
      multiple
      collapsible
      value={open}
      onValueChange={(details) => {
        setOpen(details.value)
        details.value.forEach(loadWindows)
      }}
    >
      {topics.map((topic) => {
        const total = Number(topic.total) || 0
        const windows = windowsByTopic[topic.topic_id]

        return (
          <Accordion.Item key={topic.topic_id} value={topic.topic_id} border="none">
            <Accordion.ItemTrigger
              px={2}
              py={3}
              borderRadius="lg"
              _hover={{ bg: 'purple.50' }}
            >
              <Flex align="center" gap={3} flex="1" minW="0">
                <Box flex="1" minW="0">
                  <Flex justify="space-between" align="center" gap={3} mb={1.5}>
                    <Text fontWeight="600" fontSize="sm" color="gray.800" truncate>
                      {topic.label || topic.topic_id}
                    </Text>
                    <Badge colorPalette="purple" variant="subtle" borderRadius="full" px={2}>
                      {total}
                    </Badge>
                  </Flex>
                  <Box h="6px" bg="purple.50" borderRadius="full" overflow="hidden">
                    <Box
                      h="full"
                      w={`${(total / maxTotal) * 100}%`}
                      bg="purple.400"
                      borderRadius="full"
                    />
                  </Box>
                </Box>
                <Accordion.ItemIndicator color="gray.400" />
              </Flex>
            </Accordion.ItemTrigger>

            <Accordion.ItemContent>
              <Accordion.ItemBody px={2} pb={3}>
                {windows?.status === 'loading' && (
                  <Flex align="center" gap={2} py={2}>
                    <Spinner size="sm" color="purple.500" />
                    <Text fontSize="sm" color="gray.500">
                      Carregando janelas…
                    </Text>
                  </Flex>
                )}

                {windows?.status === 'error' && (
                  <Text fontSize="sm" color="red.500" py={2}>
                    Não foi possível carregar as janelas.
                  </Text>
                )}

                {windows?.status === 'ready' && windows.rows.length === 0 && (
                  <Text fontSize="sm" color="gray.500" py={2}>
                    Nenhuma janela neste período.
                  </Text>
                )}

                {windows?.status === 'ready' && windows.rows.length > 0 && (
                  <Flex direction="column" gap={1}>
                    {windows.rows.map((window) => (
                      <Flex
                        key={window.id}
                        as="button"
                        type="button"
                        w="full"
                        textAlign="left"
                        cursor="pointer"
                        justify="space-between"
                        align="center"
                        gap={3}
                        px={3}
                        py={2}
                        bg="gray.50"
                        borderRadius="lg"
                        _hover={{ bg: 'purple.50' }}
                        onClick={() => setSelectedWindow(window)}
                      >
                        <Text fontSize="sm" color="gray.700" fontWeight="600">
                          {window.date}
                          <Text as="span" fontWeight="400" color="gray.500">
                            {' '}
                            {window.range}
                          </Text>
                        </Text>
                        <Text fontSize="xs" color="gray.500" whiteSpace="nowrap">
                          {window.messagesLabel} · {window.probability}%
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                )}
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
    <WindowMessagesDialog window={selectedWindow} onClose={() => setSelectedWindow(null)} />
    </>
  )
}

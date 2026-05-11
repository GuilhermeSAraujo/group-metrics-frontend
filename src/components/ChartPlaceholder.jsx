import { Box, Flex, Text, Stack } from '@chakra-ui/react'
import MessagesPerUserBarList from './MessagesPerUserBarList'
import ReactionsPerUserBarList from './ReactionsPerUserBarList'
import RepliesPerUserBarList from './RepliesPerUserBarList'

const chartMeta = {
  messages_per_user: {
    type: 'Bar list',
    color: 'purple',
    description: 'Mostra o número de mensagens enviadas por membro da LSTop.',
    xAxis: 'Users',
    yAxis: 'Message Count',
    Component: MessagesPerUserBarList,
  },
  reactions_per_user: {
    type: 'Bar list',
    color: 'blue',
    description: 'Mostra o número de reações recebidas por membro da LSTop.',
    xAxis: 'Users',
    yAxis: 'Reactions Received',
    Component: ReactionsPerUserBarList,
  },
  replies_per_user: {
    type: 'Bar list',
    color: 'teal',
    description: 'Mostra o número de respostas recebidas por membro da LSTop.',
    xAxis: 'Users',
    yAxis: 'Replies Received',
    Component: RepliesPerUserBarList,
  },
}

const colorMap = {
  purple: { bg: 'purple.50', border: 'purple.200', accent: 'purple.400', text: 'purple.700', badge: 'purple.100' },
  blue: { bg: 'blue.50', border: 'blue.200', accent: 'blue.400', text: 'blue.700', badge: 'blue.100' },
  teal: { bg: 'teal.50', border: 'teal.200', accent: 'teal.400', text: 'teal.700', badge: 'teal.100' },
}

export default function ChartPlaceholder({ chartType, label }) {
  const meta = chartMeta[chartType] ?? chartMeta.messages_per_user
  const colors = colorMap[meta.color]
  const ChartComponent = meta.Component

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="gray.100"
      shadow="sm"
      overflow="hidden"
    >
      {/* Chart header */}
      <Flex
        px={6}
        py={4}
        borderBottomWidth="1px"
        borderColor="gray.100"
        align="center"
        justify="space-between"
      >
        <Stack gap={0.5}>
          <Text fontWeight="700" fontSize="md" color="gray.800" letterSpacing="-0.01em">
            {label}
          </Text>
          <Text fontSize="xs" color="gray.400">
            {meta.description}
          </Text>
        </Stack>
      </Flex>

      {/* Chart body */}
      <Box
        bg={colors.bg}
        borderBottomWidth="1px"
        borderColor={colors.border}
      >
        {ChartComponent ? (
          <Box px={{ base: 5, md: 8 }} py={6}>
            <ChartComponent seriesColor={`${meta.color}.subtle`} />
          </Box>
        ) : (
          <Flex
            minH={{ base: '320px', md: '420px' }}
            align="center"
            justify="center"
            direction="column"
            gap={2}
          >
            <Text fontSize="2xl" opacity={0.3}>
              📊
            </Text>
            <Text fontSize="sm" color={colors.text} fontWeight="600" opacity={0.7}>
              Chart coming soon
            </Text>
            <Text fontSize="xs" color="gray.400" opacity={0.8}>
              Connect your data source to render this chart
            </Text>
          </Flex>
        )}
      </Box>

      {/* X-axis label */}
      <Flex justify="center" py={3} borderTopWidth="1px" borderColor="gray.50">
        <Text fontSize="10px" color="gray.400" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em">
          {meta.xAxis}
        </Text>
      </Flex>
    </Box>
  )
}

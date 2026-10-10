import { useEffect, useState } from 'react'
import { Avatar, Box, CloseButton, Dialog, Flex, Portal, Spinner, Text } from '@chakra-ui/react'
import { api } from '../api/client'

const saoPaulo = { timeZone: 'America/Sao_Paulo' }
const timeFmt = new Intl.DateTimeFormat('pt-BR', {
  ...saoPaulo,
  hour: '2-digit',
  minute: '2-digit',
})

const palette = ['purple', 'blue', 'teal', 'orange', 'pink', 'cyan', 'green', 'red']

function colorFor(memberId) {
  const text = String(memberId ?? '')
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }
  return palette[hash % palette.length]
}

function groupMessages(messages) {
  const groups = []
  messages.forEach((message) => {
    const last = groups[groups.length - 1]
    if (last && last.memberId === message.member_id) {
      last.messages.push(message)
    } else {
      groups.push({
        memberId: message.member_id,
        memberName: message.member_name || 'Membro',
        messages: [message],
      })
    }
  })
  return groups
}

function WindowChat({ window }) {
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    const ids = (window.windowIds ?? []).join(',')

    api
      .getJson(`/window-messages?ids=${encodeURIComponent(ids)}`)
      .then((payload) => {
        if (cancelled) return
        setMessages(Array.isArray(payload) ? payload : [])
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [window])

  if (status === 'loading') {
    return (
      <Flex align="center" gap={2} py={4}>
        <Spinner size="sm" color="purple.500" />
        <Text fontSize="sm" color="gray.500">
          Carregando mensagens…
        </Text>
      </Flex>
    )
  }

  if (status === 'error') {
    return (
      <Text fontSize="sm" color="red.500" py={4}>
        Não foi possível carregar as mensagens.
      </Text>
    )
  }

  if (messages.length === 0) {
    return (
      <Text fontSize="sm" color="gray.500" py={4}>
        Nenhuma mensagem de texto nesta janela.
      </Text>
    )
  }

  return (
    <Flex direction="column" gap={4}>
      {groupMessages(messages).map((group) => (
        <Flex key={`${group.memberId}-${group.messages[0].message_id}`} direction="column" gap={1}>
          {group.messages.map((message, index) => {
            const first = index === 0
            const color = colorFor(group.memberId)
            return (
              <Flex key={message.message_id} gap={2} align="flex-end">
                {first ? (
                  <Avatar.Root size="sm" colorPalette={color} flexShrink={0}>
                    <Avatar.Fallback name={group.memberName} />
                  </Avatar.Root>
                ) : (
                  <Box w="8" flexShrink={0} />
                )}
                <Box bg="gray.100" borderRadius="xl" px={3} py={2} minW="0" maxW="100%">
                  {first && (
                    <Text fontSize="xs" fontWeight="700" color={`${color}.600`} mb={0.5}>
                      {group.memberName}
                    </Text>
                  )}
                  {message.replied_to_content && (
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      borderLeftWidth="2px"
                      borderColor="purple.300"
                      pl={2}
                      mb={1}
                      lineClamp={2}
                    >
                      {message.replied_to_content}
                    </Text>
                  )}
                  <Text fontSize="sm" color="gray.800" whiteSpace="pre-wrap" wordBreak="break-word">
                    {message.content}
                  </Text>
                  <Text fontSize="xs" color="gray.400" textAlign="right" mt={1}>
                    {timeFmt.format(new Date(message.sent_at))}
                  </Text>
                </Box>
              </Flex>
            )
          })}
        </Flex>
      ))}
    </Flex>
  )
}

export default function WindowMessagesDialog({ window, onClose }) {
  return (
    <Dialog.Root
      open={Boolean(window)}
      onOpenChange={(details) => {
        if (!details.open) onClose()
      }}
      size={{ base: 'full', md: 'md' }}
      placement="center"
      scrollBehavior="inside"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header px={{ base: 4, md: 6 }} pt={4} pb={3}>
              <Flex align="flex-start" justify="space-between" gap={3} w="full">
                <Box minW="0">
                  <Dialog.Title fontSize="md" fontWeight="700" color="gray.800">
                    {window ? `${window.date} ${window.range}` : 'Mensagens'}
                  </Dialog.Title>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {window?.messagesLabel}
                  </Text>
                </Box>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Flex>
            </Dialog.Header>

            <Dialog.Body px={{ base: 4, md: 6 }} pb={6}>
              {window && <WindowChat key={window.id} window={window} />}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

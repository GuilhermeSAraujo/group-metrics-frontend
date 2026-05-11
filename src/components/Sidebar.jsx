import { Box, Flex, Text, Stack } from '@chakra-ui/react'

const navItems = [
  { label: 'Dashboard', icon: '▦', active: true },
  // { label: 'Members', icon: '◎', active: false },
  // { label: 'Channels', icon: '⊞', active: false },
  // { label: 'Settings', icon: '⚙', active: false },
]

export default function Sidebar() {
  return (
    <Box
      w={{ base: '0', md: '220px' }}
      display={{ base: 'none', md: 'flex' }}
      flexDir="column"
      bg="white"
      borderRightWidth="1px"
      borderColor="gray.100"
      py={6}
      px={4}
      shadow="sm"
    >
      {/* Logo */}
      <Flex align="center" gap={2} px={2} mb={8}>
        <Box
          w={8}
          h={8}
          borderRadius="lg"
          bg="purple.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="white" fontWeight="900" fontSize="sm">
            LS
          </Text>
        </Box>
        <Text fontWeight="800" fontSize="sm" color="gray.800" letterSpacing="-0.02em">
          LSTop Stats
        </Text>
      </Flex>

      {/* Nav */}
      <Stack gap={1} flex="1">
        {navItems.map((item) => (
          <Flex
            key={item.label}
            align="center"
            gap={3}
            px={3}
            py={2.5}
            borderRadius="xl"
            bg={item.active ? 'purple.50' : 'transparent'}
            color={item.active ? 'purple.700' : 'gray.500'}
            fontWeight={item.active ? '600' : '400'}
            fontSize="sm"
            cursor="pointer"
            _hover={{
              bg: item.active ? 'purple.50' : 'gray.50',
              color: item.active ? 'purple.700' : 'gray.700',
            }}
            transition="all 0.15s"
          >
            <Text fontSize="md">{item.icon}</Text>
            <Text>{item.label}</Text>
          </Flex>
        ))}
      </Stack>

      {/* Footer */}
      <Box px={2} pt={4} borderTopWidth="1px" borderColor="gray.100">
        <Text fontSize="xs" color="gray.400">
          v1.0.0
        </Text>
      </Box>
    </Box>
  )
}

import { Box, Flex, Text, Stack } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', icon: '📈', path: '/dashboard' },
  { label: 'Grupo',     icon: '📊', path: '/group'     },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
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
            bg={
              location.pathname === item.path
                ? 'purple.50' : 'transparent'}
            onClick={() => {
              console.log("clicouuuu", item.path)
              navigate(item.path)}}
            color={location.pathname === item.path ? 'purple.700' : 'gray.500'}
            fontWeight={location.pathname === item.path ? '600' : '400'}
            fontSize="sm"
            cursor="pointer"
            _hover={{
              bg: location.pathname === item.path ? 'purple.50' : 'gray.50',
              color: location.pathname === item.path ? 'purple.700' : 'gray.700',
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

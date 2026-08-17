import { Flex, Text } from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '../navItems'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Flex
      as="nav"
      aria-label="Primary"
      display={{ base: 'flex', md: 'none' }}
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="sticky"
      bg="white"
      borderTopWidth="1px"
      borderColor="gray.100"
      pb="env(safe-area-inset-bottom)"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path

        return (
          <Flex
            key={item.path}
            as="button"
            type="button"
            flex="1"
            minH="48px"
            direction="column"
            align="center"
            justify="center"
            gap={0.5}
            py={2}
            border="none"
            bg={isActive ? 'purple.50' : 'transparent'}
            color={isActive ? 'purple.700' : 'gray.500'}
            fontWeight={isActive ? '600' : '400'}
            fontSize="xs"
            cursor="pointer"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => navigate(item.path)}
            _hover={{
              bg: isActive ? 'purple.50' : 'gray.50',
              color: isActive ? 'purple.700' : 'gray.700',
            }}
          >
            <Text fontSize="md">{item.icon}</Text>
            <Text>{item.label}</Text>
          </Flex>
        )
      })}
    </Flex>
  )
}

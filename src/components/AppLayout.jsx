import { Box, Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function AppLayout() {
  return (
    <Flex minH="100dvh" bg="gray.50" fontFamily="'IBM Plex Sans', sans-serif">
      <Sidebar />
      <Box
        flex="1"
        minW="0"
        p={{ base: 4, md: 8 }}
        pb={{ base: 'calc(5.5rem + env(safe-area-inset-bottom))', md: 8 }}
      >
        <Outlet />
      </Box>
      <BottomNav />
    </Flex>
  )
}

import { Flex, Spinner, Text } from '@chakra-ui/react'

/** Centered Chakra spinner while bar-list chart data is fetched. */
export default function ChartBarListLoading({ seriesColor = 'purple.subtle' }) {
  const palette = typeof seriesColor === 'string' ? seriesColor.split('.')[0] : 'gray'

  return (
    <Flex
      minH={{ base: '240px', md: '320px' }}
      align="center"
      justify="center"
      direction="column"
      gap={3}
      w="full"
      py={4}
    >
      <Spinner size="lg" color={`${palette}.500`} />
      <Text fontSize="sm" color="gray.500">
        Cozinhando dados…
      </Text>
    </Flex>
  )
}

import React from 'react'
import { Box, Text, Flex } from '@chakra-ui/react'

/**
 * StatCard component for displaying statistics with icon and donut chart
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value to display
 * @param {string} props.subtitle - Subtitle text
 * @param {JSX.Element} props.icon - Icon component
 * @param {JSX.Element} props.chart - Chart component (donut/pie)
 * @param {string} props.iconBg - Icon background color
 * @return {JSX.Element} The StatCard component
 */
const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  chart,
  iconBg = 'gray.50',
}) => {
  return (
    <Box
      bg="white"
      borderRadius="20px"
      p={6}
      shadow="md"
      display="flex"
      flexDirection="column"
      gap={4}
      _dark={{
        bg: 'navy.800',
      }}
    >
      {/* Header */}
      <Flex justify="space-between" align="center">
        <Box>
          <Text
            fontSize="sm"
            fontWeight="500"
            color="gray.600"
            _dark={{ color: 'gray.400' }}
          >
            {title}
          </Text>
          <Text
            fontSize="3xl"
            fontWeight="bold"
            color="navy.700"
            mt={2}
            _dark={{ color: 'white' }}
          >
            {value}
          </Text>
          <Text
            fontSize="xs"
            color="gray.500"
            mt={1}
            _dark={{ color: 'gray.400' }}
          >
            {subtitle}
          </Text>
        </Box>

        {/* Icon */}
        {icon && (
          <Flex
            w="56px"
            h="56px"
            borderRadius="full"
            bg={iconBg}
            align="center"
            justify="center"
            color="brand.500"
            fontSize="24px"
            _dark={{
              bg: 'navy.700',
              color: 'white',
            }}
          >
            {icon}
          </Flex>
        )}
      </Flex>

      {/* Chart */}
      {chart && (
        <Box mt={2} display="flex" justifyContent="center">
          {chart}
        </Box>
      )}
    </Box>
  )
}

export default StatCard

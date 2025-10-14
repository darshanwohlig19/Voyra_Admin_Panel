import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Box } from '@chakra-ui/react'

/**
 * SparklineChart component using ApexCharts
 * @param {Object} props - Component props
 * @param {Array} props.chartData - Array of series data
 * @param {Object} props.chartOptions - ApexCharts options
 * @param {string} props.height - Chart height (default: '100px')
 * @param {string} props.width - Chart width (default: '100%')
 * @return {JSX.Element} The SparklineChart component
 */
const SparklineChart = ({
  chartData = [],
  chartOptions = {},
  height = '100px',
  width = '100%',
}) => {
  const defaultOptions = {
    chart: {
      type: 'area',
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.1,
      },
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      x: {
        show: false,
      },
    },
    colors: ['#4318FF'],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    grid: {
      show: false,
    },
  }

  const mergedOptions = { ...defaultOptions, ...chartOptions }

  return (
    <Box w={width} h={height}>
      <ReactApexChart
        options={mergedOptions}
        series={chartData}
        type="area"
        width="100%"
        height="100%"
      />
    </Box>
  )
}

export default SparklineChart

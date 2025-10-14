import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Box } from '@chakra-ui/react'

/**
 * PieChart component using ApexCharts
 * @param {Object} props - Component props
 * @param {Array} props.chartData - Array of data values
 * @param {Object} props.chartOptions - ApexCharts options
 * @param {string} props.height - Chart height (default: '350px')
 * @param {string} props.width - Chart width (default: '100%')
 * @return {JSX.Element} The PieChart component
 */
const PieChart = ({
  chartData = [],
  chartOptions = {},
  height = '350px',
  width = '100%',
}) => {
  const defaultOptions = {
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
    colors: ['#4318FF', '#6AD2FF', '#39B8FF', '#7551FF', '#A78BFA'],
    chart: {
      width: '100%',
    },
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontWeight: 500,
      labels: {
        colors: '#A3AED0',
      },
      markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        radius: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontWeight: '500',
      },
      dropShadow: {
        enabled: false,
      },
    },
    hover: { mode: null },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    fill: {
      colors: ['#4318FF', '#6AD2FF', '#39B8FF', '#7551FF', '#A78BFA'],
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: undefined,
      },
    },
  }

  const mergedOptions = { ...defaultOptions, ...chartOptions }

  return (
    <Box w={width} h={height}>
      <ReactApexChart
        options={mergedOptions}
        series={chartData}
        type="pie"
        width="100%"
        height="100%"
      />
    </Box>
  )
}

export default PieChart

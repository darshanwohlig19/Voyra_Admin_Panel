import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Box } from '@chakra-ui/react'

/**
 * BarChart component using ApexCharts
 * @param {Object} props - Component props
 * @param {Array} props.chartData - Array of series data
 * @param {Object} props.chartOptions - ApexCharts options
 * @param {string} props.height - Chart height (default: '350px')
 * @param {string} props.width - Chart width (default: '100%')
 * @return {JSX.Element} The BarChart component
 */
const BarChart = ({
  chartData = [],
  chartOptions = {},
  height = '350px',
  width = '100%',
}) => {
  const defaultOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: undefined,
      },
      onDatasetHover: {
        style: {
          fontSize: '12px',
          fontFamily: undefined,
        },
      },
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      show: true,
      labels: {
        show: true,
        style: {
          colors: '#A3AED0',
          fontSize: '14px',
          fontWeight: '500',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: true,
      color: 'black',
      labels: {
        show: true,
        style: {
          colors: '#A3AED0',
          fontSize: '14px',
          fontWeight: '500',
        },
      },
    },
    grid: {
      show: false,
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '40px',
      },
    },
    colors: ['#39B8FF', '#6AD2FF', '#4318FF'],
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px',
      fontWeight: 500,
      labels: {
        colors: '#A3AED0',
      },
    },
  }

  const mergedOptions = { ...defaultOptions, ...chartOptions }

  return (
    <Box w={width} h={height}>
      <ReactApexChart
        options={mergedOptions}
        series={chartData}
        type="bar"
        width="100%"
        height="100%"
      />
    </Box>
  )
}

export default BarChart

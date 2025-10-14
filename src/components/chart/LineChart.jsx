import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Box } from '@chakra-ui/react'

/**
 * LineChart component using ApexCharts
 * @param {Object} props - Component props
 * @param {Array} props.chartData - Array of series data
 * @param {Object} props.chartOptions - ApexCharts options
 * @param {string} props.height - Chart height (default: '350px')
 * @param {string} props.width - Chart width (default: '100%')
 * @return {JSX.Element} The LineChart component
 */
const LineChart = ({
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
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: '#4318FF',
      },
    },
    colors: ['#4318FF', '#39B8FF'],
    markers: {
      size: 0,
      colors: 'white',
      strokeColors: '#7551FF',
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      shape: 'circle',
      radius: 2,
      hover: {
        size: 5,
      },
    },
    tooltip: {
      theme: 'dark',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      type: 'line',
      width: 2,
    },
    xaxis: {
      type: 'numeric',
      categories: ['SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB'],
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
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
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: '500',
        },
      },
    },
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
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        colorStops: [
          {
            offset: 0,
            color: '#4318FF',
            opacity: 1,
          },
          {
            offset: 100,
            color: 'rgba(67, 24, 255, 1)',
            opacity: 0.28,
          },
        ],
      },
    },
  }

  const mergedOptions = { ...defaultOptions, ...chartOptions }

  return (
    <Box w={width} h={height}>
      <ReactApexChart
        options={mergedOptions}
        series={chartData}
        type="line"
        width="100%"
        height="100%"
      />
    </Box>
  )
}

export default LineChart

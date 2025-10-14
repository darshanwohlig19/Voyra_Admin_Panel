import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Box } from '@chakra-ui/react'

/**
 * AreaChart component using ApexCharts
 * @param {Object} props - Component props
 * @param {Array} props.chartData - Array of series data
 * @param {Object} props.chartOptions - ApexCharts options
 * @param {string} props.height - Chart height (default: '350px')
 * @param {string} props.width - Chart width (default: '100%')
 * @return {JSX.Element} The AreaChart component
 */
const AreaChart = ({
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
      zoom: {
        enabled: false,
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
      width: 2,
    },
    xaxis: {
      type: 'category',
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
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
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
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

export default AreaChart

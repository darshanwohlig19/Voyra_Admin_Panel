import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Box } from '@chakra-ui/react'

/**
 * DonutChart component using ApexCharts
 * @param {Object} props - Component props
 * @param {Array} props.chartData - Array of data values
 * @param {Object} props.chartOptions - ApexCharts options
 * @param {string} props.height - Chart height (default: '350px')
 * @param {string} props.width - Chart width (default: '100%')
 * @return {JSX.Element} The DonutChart component
 */
const DonutChart = ({
  chartData = [],
  chartOptions = {},
  height = '350px',
  width = '100%',
}) => {
  const defaultOptions = {
    labels: ['Active', 'Inactive', 'Pending', 'Completed'],
    colors: ['#4318FF', '#6AD2FF', '#39B8FF', '#7551FF'],
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
      enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              color: '#A3AED0',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '28px',
              fontWeight: 700,
              color: '#1B2559',
              offsetY: 5,
              formatter: function (val) {
                return val
              },
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '16px',
              fontWeight: 600,
              color: '#A3AED0',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return a + b
                }, 0)
              },
            },
          },
        },
      },
    },
    fill: {
      colors: ['#4318FF', '#6AD2FF', '#39B8FF', '#7551FF'],
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
        type="donut"
        width="100%"
        height="100%"
      />
    </Box>
  )
}

export default DonutChart

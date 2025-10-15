import React, { useState, useEffect } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { FaUsers, FaCreditCard } from 'react-icons/fa'
import StatCard from './components/StatCard'
import { DonutChart, BarChart, AreaChart } from 'components/chart'
import ApiCaller from 'common/services/apiServices'
import config from 'common/config/apiConfig'

const Dashboard = () => {
  // Time period state for Sales Dynamics
  const [timePeriod, setTimePeriod] = useState('month')
  // Time period state for User Activity
  const [activityTimePeriod, setActivityTimePeriod] = useState('month')
  // User activity stats from API
  const [userActivityStats, setUserActivityStats] = useState(null)
  // Time period state for Revenue
  const [revenueTimePeriod, setRevenueTimePeriod] = useState('month')
  // Revenue stats from API
  const [revenueStats, setRevenueStats] = useState(null)
  // Sales count stats from API
  const [salesStats, setSalesStats] = useState(null)

  // Sample data for Users
  const [usersData, setUsersData] = useState({
    total: 100,
    // subtitle: 'since last month',
    chartData: [60, 40], // Active, Inactive percentages
    chartOptions: {
      labels: ['Active', 'Inactive'],
      // colors: ['#10B981', '#FCD34D'], // Green, Yellow, Blue
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '12px',
        fontWeight: 500,
        labels: {
          colors: '#A3AED0',
        },
        markers: {
          width: 8,
          height: 8,
        },
        itemMargin: {
          horizontal: 8,
          vertical: 4,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: false,
                offsetY: 0,
              },
              value: {
                show: true,
                fontSize: '20px',
                fontWeight: 700,
                color: '#1B2559',
                offsetY: 12,
                formatter: function (val) {
                  return val + '%'
                },
              },
              total: {
                show: true,
                showAlways: true,
                label: '',
                fontSize: '20px',
                fontWeight: 700,
                color: '#1B2559',
                offsetY: 12,
                formatter: function (w) {
                  const total = w.globals.seriesTotals.reduce(
                    (a, b) => a + b,
                    0
                  )
                  return total + '%'
                },
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
    },
  })

  // Sample data for Subscriptions
  const [subscriptionsData, setSubscriptionsData] = useState({
    total: 100,
    // subtitle: 'since last month',
    chartData: [50, 30, 20], // Paid, Trial percentages
    chartOptions: {
      labels: ['Starter', 'Pro', 'Enterprise'],
      // colors: ['#10B981', '#3B82F6'], // Green for Paid, Blue for Trial
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '12px',
        fontWeight: 500,
        labels: {
          colors: '#A3AED0',
        },
        markers: {
          width: 8,
          height: 8,
        },
        itemMargin: {
          horizontal: 8,
          vertical: 4,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: false,
                offsetY: 0,
              },
              value: {
                show: true,
                fontSize: '20px',
                fontWeight: 700,
                color: '#1B2559',
                offsetY: 12,
                formatter: function (val) {
                  return val + '%'
                },
              },
              total: {
                show: true,
                showAlways: true,
                label: '',
                fontSize: '20px',
                fontWeight: 700,
                color: '#1B2559',
                offsetY: 12,
                formatter: function (w) {
                  const total = w.globals.seriesTotals.reduce(
                    (a, b) => a + b,
                    0
                  )
                  return total + '%'
                },
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
    },
  })

  // Fetch user statistics from API
  useEffect(() => {
    const fetchUserStats = async () => {
      const { apiCall } = ApiCaller()
      const response = await apiCall('get', config.GET_USER_STATS)

      if (response?.data) {
        const { totalUsers, activeUsers, inactiveUsers } = response.data
        // Calculate percentage as proportion of active + inactive only
        const totalActiveInactive = activeUsers + inactiveUsers
        const activePercentage = Math.round(
          (activeUsers / totalActiveInactive) * 100
        )
        const inactivePercentage = Math.round(
          (inactiveUsers / totalActiveInactive) * 100
        )

        setUsersData((prev) => ({
          ...prev,
          total: totalUsers,
          chartData: [activePercentage, inactivePercentage],
          chartOptions: {
            ...prev.chartOptions,
            labels: [`Active: ${activeUsers}`, `Inactive: ${inactiveUsers}`],
            tooltip: {
              y: {
                formatter: function (value) {
                  return value + '%'
                },
              },
            },
          },
        }))
      }
    }

    fetchUserStats()
  }, [])

  // Fetch subscription statistics from API
  useEffect(() => {
    const fetchSubscriberStats = async () => {
      const { apiCall } = ApiCaller()
      const response = await apiCall('get', config.GET_SUBSCRIBER_STATS)

      if (response?.data?.users?.statistics) {
        const { totalSubscribers, planDistribution } =
          response.data.users.statistics

        // Extract plan counts
        const starterCount = planDistribution.Starter || 0
        const proCount = planDistribution.Pro || 0
        const enterpriseCount = planDistribution.Enterprise || 0

        // Calculate percentages based on plan distribution only
        const totalPlans = starterCount + proCount + enterpriseCount
        const starterPercentage = Math.round((starterCount / totalPlans) * 100)
        const proPercentage = Math.round((proCount / totalPlans) * 100)
        const enterprisePercentage = Math.round(
          (enterpriseCount / totalPlans) * 100
        )

        setSubscriptionsData((prev) => ({
          ...prev,
          total: totalSubscribers,
          chartData: [starterPercentage, proPercentage, enterprisePercentage],
          chartOptions: {
            ...prev.chartOptions,
            labels: [
              `Starter: ${starterCount}`,
              `Pro: ${proCount}`,
              `Enterprise: ${enterpriseCount}`,
            ],
            tooltip: {
              y: {
                formatter: function (value) {
                  return value + '%'
                },
              },
            },
          },
        }))
      }
    }

    fetchSubscriberStats()
  }, [])

  // Fetch user activity statistics from API
  useEffect(() => {
    const fetchUserActivityStats = async () => {
      const { apiCall } = ApiCaller()
      const response = await apiCall(
        'get',
        `${config.GET_USER_ACTIVITY_STATS}?type=${activityTimePeriod}`
      )

      if (response?.data?.stats) {
        setUserActivityStats(response.data.stats)
      }
    }

    fetchUserActivityStats()
  }, [activityTimePeriod])

  // Fetch revenue statistics from API
  useEffect(() => {
    const fetchRevenueStats = async () => {
      const { apiCall } = ApiCaller()
      const response = await apiCall(
        'get',
        `${config.GET_REVENUE_STATS}?type=${revenueTimePeriod}`
      )

      if (response?.data?.stats) {
        setRevenueStats(response.data.stats)
      }
    }

    fetchRevenueStats()
  }, [revenueTimePeriod])

  // Fetch sales count statistics from API
  useEffect(() => {
    const fetchSalesStats = async () => {
      try {
        const { apiCall } = ApiCaller()
        const response = await apiCall(
          'get',
          `${config.GET_SALES_COUNT}?type=${timePeriod}`
        )

        if (response?.data) {
          setSalesStats(response.data)
        }
      } catch (error) {
        console.error('Error fetching sales stats:', error)
        setSalesStats(null)
      }
    }

    fetchSalesStats()
  }, [timePeriod])

  // Function to get sales data based on time period
  const getSalesData = () => {
    const baseChartOptions = {
      chart: {
        toolbar: {
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
          formatter: function (val) {
            return val
          },
        },
        min: 0,
        tickAmount: 5,
      },
      grid: {
        show: true,
        strokeDashArray: 5,
        borderColor: '#E0E5F2',
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
      colors: ['#4318FF'],
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '35px',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
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
    }

    switch (timePeriod) {
      case 'day':
        // Hourly data for 1 day (24 hours)
        return {
          chartData: [
            {
              name: 'Sales',
              data: [
                12, 18, 15, 25, 30, 28, 35, 40, 45, 50, 48, 55, 60, 58, 52, 48,
                45, 40, 35, 30, 25, 20, 15, 10,
              ],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: [
                '00:00',
                '01:00',
                '02:00',
                '03:00',
                '04:00',
                '05:00',
                '06:00',
                '07:00',
                '08:00',
                '09:00',
                '10:00',
                '11:00',
                '12:00',
                '13:00',
                '14:00',
                '15:00',
                '16:00',
                '17:00',
                '18:00',
                '19:00',
                '20:00',
                '21:00',
                '22:00',
                '23:00',
              ],
            },
            yaxis: {
              ...baseChartOptions.yaxis,
              max: 100,
            },
          },
        }

      case 'week':
        // Daily data for 7 days (Monday to Sunday)
        return {
          chartData: [
            {
              name: 'Sales',
              data: [320, 280, 350, 310, 390, 420, 380],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yaxis: {
              ...baseChartOptions.yaxis,
              max: 500,
            },
          },
        }

      case 'month':
        // Weekly data for 1 month (4 weeks)
        return {
          chartData: [
            {
              name: 'Sales',
              data: [1200, 1350, 1450, 1280],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            },
            yaxis: {
              ...baseChartOptions.yaxis,
              max: 2000,
            },
          },
        }

      case 'year':
      default:
        // Monthly data for 1 year
        return {
          chartData: [
            {
              name: 'Sales',
              data: [
                220, 280, 250, 320, 290, 350, 320, 380, 290, 400, 350, 450,
              ],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: [
                'JAN',
                'FEB',
                'MAR',
                'APR',
                'MAY',
                'JUN',
                'JUL',
                'AUG',
                'SEP',
                'OCT',
                'NOV',
                'DEC',
              ],
            },
            yaxis: {
              ...baseChartOptions.yaxis,
              max: 500,
            },
          },
        }
    }
  }

  // Function to get source traffic data based on time period
  const getSourceTrafficData = () => {
    const baseChartOptions = {
      chart: {
        toolbar: {
          show: false,
        },
        stacked: false,
      },
      yaxis: {
        show: true,
        labels: {
          style: {
            colors: '#A3AED0',
            fontSize: '12px',
            fontWeight: '500',
          },
          formatter: function (val) {
            return val
          },
        },
        min: 0,
        tickAmount: 5,
      },
      grid: {
        show: true,
        strokeDashArray: 5,
        borderColor: '#E0E5F2',
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
      colors: ['#95BF46', '#FCD34D', '#4318FF'], // Green for Shopify, Yellow for Google, Purple/Blue for Website
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '60%',
        },
      },
      dataLabels: {
        enabled: false,
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
        markers: {
          width: 12,
          height: 12,
          radius: 3,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      xaxis: {
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
    }

    // If API data is available, use it
    if (
      salesStats &&
      Array.isArray(salesStats.users) &&
      salesStats.users.length > 0
    ) {
      // Extract categories based on the time period type
      const categories = salesStats.users.map((item) => {
        // Check which property exists in the response based on filterType
        if (item.month !== undefined) return item.month
        if (item.week !== undefined) return item.week
        if (item.day !== undefined) return item.day
        if (item.hour !== undefined) return item.hour
        return ''
      })

      const shopifyData = salesStats.users.map((item) => item.shopify || 0)
      const googleData = salesStats.users.map(
        (item) => item.google_marketplace || 0
      )
      const websiteData = salesStats.users.map((item) => item.website || 0)

      // Calculate dynamic y-axis max based on data
      const allValues = [
        ...shopifyData.filter((v) => v > 0),
        ...googleData.filter((v) => v > 0),
        ...websiteData.filter((v) => v > 0),
      ]
      const maxValue = allValues.length > 0 ? Math.max(...allValues) : 100
      const yAxisMax = Math.ceil(maxValue * 1.2) // Add 20% buffer

      return {
        chartData: [
          {
            name: 'Shopify',
            data: shopifyData,
          },
          {
            name: 'Google',
            data: googleData,
          },
          {
            name: 'Website',
            data: websiteData,
          },
        ],
        chartOptions: {
          ...baseChartOptions,
          xaxis: {
            ...baseChartOptions.xaxis,
            categories: categories,
          },
          yaxis: {
            ...baseChartOptions.yaxis,
            max: yAxisMax,
          },
        },
      }
    }

    // Fallback data if API hasn't loaded yet
    switch (timePeriod) {
      case 'day':
        // 4-hour intervals for 1 day
        return {
          chartData: [
            {
              name: 'Shopify',
              data: [5, 10, 14, 20, 24, 18, 8],
            },
            {
              name: 'Google',
              data: [4, 8, 12, 17, 20, 15, 6],
            },
            {
              name: 'Website',
              data: [7, 12, 17, 25, 30, 22, 10],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: [
                '00:00',
                '04:00',
                '08:00',
                '12:00',
                '16:00',
                '20:00',
                '24:00',
              ],
            },
            yaxis: {
              ...baseChartOptions.yaxis,
              max: 40,
            },
          },
        }

      case 'week':
        // Daily data for 7 days (Monday to Sunday)
        return {
          chartData: [
            {
              name: 'Shopify',
              data: [130, 115, 140, 125, 155, 170, 150],
            },
            {
              name: 'Google',
              data: [100, 95, 110, 105, 125, 140, 120],
            },
            {
              name: 'Website',
              data: [150, 140, 165, 155, 185, 200, 180],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yaxis: {
              ...baseChartOptions.yaxis,
              max: 250,
            },
          },
        }

      case 'month':
        // Weekly data for 1 month (4 weeks)
        return {
          chartData: [
            {
              name: 'Shopify',
              data: [500, 550, 580, 520],
            },
            {
              name: 'Google',
              data: [400, 450, 470, 420],
            },
            {
              name: 'Website',
              data: [600, 650, 680, 630],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            },
            yaxis: {
              ...baseChartOptions.yaxis,
              max: 800,
            },
          },
        }

      case 'year':
      default:
        // Monthly data for 1 year
        return {
          chartData: [
            {
              name: 'Shopify',
              data: [
                150, 180, 160, 200, 170, 190, 210, 195, 180, 220, 200, 240,
              ],
            },
            {
              name: 'Google',
              data: [
                120, 140, 130, 160, 150, 170, 180, 165, 150, 190, 170, 200,
              ],
            },
            {
              name: 'Website',
              data: [
                180, 200, 190, 220, 210, 230, 250, 235, 220, 260, 240, 280,
              ],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: [
                'J',
                'F',
                'M',
                'A',
                'M',
                'J',
                'J',
                'A',
                'S',
                'O',
                'N',
                'D',
              ],
            },
            yaxis: {
              ...baseChartOptions.yaxis,
              max: 300,
            },
          },
        }
    }
  }

  const sourceTrafficData = getSourceTrafficData()

  // Function to get user activity data based on time period
  const getUserActivityData = () => {
    const baseChartOptions = {
      chart: {
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: false,
        },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.5,
          opacityTo: 0.1,
        },
      },
      colors: ['#4318FF'],
      dataLabels: {
        enabled: false,
      },
      xaxis: {
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
          formatter: function (val) {
            return val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val
          },
        },
      },
      grid: {
        show: true,
        strokeDashArray: 5,
        borderColor: '#E0E5F2',
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
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val) {
            return val.toLocaleString()
          },
        },
      },
    }

    // If API data is available, use it
    if (userActivityStats && userActivityStats.graphData) {
      // Extract x-axis labels and y-axis data from API
      const categories = userActivityStats.graphData.map((item) => {
        // Get the first key that's not 'users' as the x-axis label
        const keys = Object.keys(item)
        const labelKey = keys.find((key) => key !== 'users')
        return item[labelKey] || ''
      })
      const data = userActivityStats.graphData.map((item) => item.users)

      // Calculate dynamic y-axis max based on data
      const maxValue = Math.max(...data)
      const yAxisMax = Math.ceil(maxValue * 1.2) // Add 20% buffer

      return {
        chartData: [
          {
            name: 'User Activity',
            data: data,
          },
        ],
        chartOptions: {
          ...baseChartOptions,
          xaxis: {
            ...baseChartOptions.xaxis,
            categories: categories,
          },
          yaxis: {
            ...baseChartOptions.yaxis,
            max: yAxisMax,
          },
        },
      }
    }

    // Fallback data if API hasn't loaded yet
    switch (activityTimePeriod) {
      case 'day':
        // 4-hour intervals for 1 day
        return {
          chartData: [
            {
              name: 'User Activity',
              data: [180, 240, 310, 400, 450, 370, 250],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: [
                '00:00',
                '04:00',
                '08:00',
                '12:00',
                '16:00',
                '20:00',
                '24:00',
              ],
            },
          },
        }

      case 'week':
        // Daily data for 7 days
        return {
          chartData: [
            {
              name: 'User Activity',
              data: [280, 260, 310, 290, 350, 380, 340],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
          },
        }

      case 'month':
        // Weekly data for 1 month
        return {
          chartData: [
            {
              name: 'User Activity',
              data: [800, 1350, 1100, 1600],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            },
          },
        }

      case 'year':
      default:
        // Monthly data for 1 year
        return {
          chartData: [
            {
              name: 'User Activity',
              data: [
                180, 220, 240, 280, 260, 300, 290, 320, 240, 280, 330, 420,
              ],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: [
                'J',
                'F',
                'M',
                'A',
                'M',
                'J',
                'J',
                'A',
                'S',
                'O',
                'N',
                'D',
              ],
            },
          },
        }
    }
  }

  const userActivityData = getUserActivityData()

  // Function to get revenue data based on time period
  const getRevenueData = () => {
    const baseChartOptions = {
      chart: {
        type: 'bar',
        toolbar: {
          show: false,
        },
        stacked: true,
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '50%',
        },
      },
      colors: ['#95BF46', '#FCD34D', '#4318FF'], // Shopify (Green), Google (Yellow), Website (Purple/Blue)
      dataLabels: {
        enabled: false,
      },
      xaxis: {
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
          formatter: function (val) {
            return '$' + (val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val)
          },
        },
      },
      grid: {
        show: true,
        strokeDashArray: 5,
        borderColor: '#E0E5F2',
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
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '14px',
        fontWeight: 500,
        labels: {
          colors: '#A3AED0',
        },
        markers: {
          width: 12,
          height: 12,
          radius: 3,
        },
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val) {
            return '$' + val.toLocaleString()
          },
        },
      },
    }

    // If API data is available, use it
    if (revenueStats && revenueStats.length > 0) {
      // Extract categories and data from API response
      const categories = []
      const shopifyData = []
      const googleData = []
      const websiteData = []

      revenueStats.forEach((item) => {
        // Determine the category key based on what's in the response
        let categoryKey = ''
        if (item.hour !== undefined) categoryKey = 'hour'
        else if (item.day !== undefined) categoryKey = 'day'
        else if (item.week !== undefined) categoryKey = 'week'
        else if (item.month !== undefined) categoryKey = 'month'

        categories.push(item[categoryKey] || '')
        shopifyData.push(item.shopify || 0)
        googleData.push(item.google_marketplace || 0)
        websiteData.push(item.website || 0)
      })

      return {
        chartData: [
          {
            name: 'Shopify',
            data: shopifyData,
          },
          {
            name: 'Google',
            data: googleData,
          },
          {
            name: 'Website',
            data: websiteData,
          },
        ],
        chartOptions: {
          ...baseChartOptions,
          xaxis: {
            ...baseChartOptions.xaxis,
            categories: categories,
          },
        },
      }
    }

    // Fallback data if API hasn't loaded yet
    switch (revenueTimePeriod) {
      case 'day':
        // 4-hour intervals for 1 day
        return {
          chartData: [
            {
              name: 'Shopify',
              data: [120, 160, 200, 250, 280, 230, 150],
            },
            {
              name: 'Google',
              data: [80, 100, 120, 145, 160, 130, 95],
            },
            {
              name: 'Website',
              data: [50, 60, 70, 82, 90, 78, 60],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: [
                '00:00',
                '04:00',
                '08:00',
                '12:00',
                '16:00',
                '20:00',
                '24:00',
              ],
            },
          },
        }

      case 'week':
        // Daily data for 7 days
        return {
          chartData: [
            {
              name: 'Shopify',
              data: [1200, 1100, 1300, 1250, 1400, 1500, 1350],
            },
            {
              name: 'Google',
              data: [800, 750, 850, 820, 900, 950, 880],
            },
            {
              name: 'Website',
              data: [500, 480, 520, 510, 550, 580, 540],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
          },
        }

      case 'month':
        // Weekly data for 1 month
        return {
          chartData: [
            {
              name: 'Shopify',
              data: [8500, 9200, 9800, 8900],
            },
            {
              name: 'Google',
              data: [5500, 6000, 6400, 5800],
            },
            {
              name: 'Website',
              data: [3500, 3800, 4000, 3700],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            },
          },
        }

      case 'year':
      default:
        // Monthly data for 1 year
        return {
          chartData: [
            {
              name: 'Shopify',
              data: [
                25000, 28000, 27000, 32000, 30000, 35000, 33000, 38000, 36000,
                40000, 38000, 45000,
              ],
            },
            {
              name: 'Google',
              data: [
                18000, 20000, 19000, 22000, 21000, 24000, 23000, 26000, 25000,
                28000, 27000, 30000,
              ],
            },
            {
              name: 'Website',
              data: [
                12000, 13000, 12500, 14000, 13500, 15000, 14500, 16000, 15500,
                17000, 16500, 18000,
              ],
            },
          ],
          chartOptions: {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: [
                'J',
                'F',
                'M',
                'A',
                'M',
                'J',
                'J',
                'A',
                'S',
                'O',
                'N',
                'D',
              ],
            },
          },
        }
    }
  }

  const revenueData = getRevenueData()

  return (
    <Box mt={5} h="full" w="full">
      <Flex direction="column" gap={5} w="full" h="full">
        {/* Users, Subscriptions and Revenue Row */}
        <Flex gap={6} flexWrap="wrap">
          {/* Left Side - Users and Subscriptions Stacked */}
          <Flex direction="column" gap={6} minW="280px" maxW="350px">
            {/* Users Card */}
            <StatCard
              title="Users"
              value={usersData.total.toLocaleString()}
              subtitle={usersData.subtitle}
              icon={<FaUsers />}
              iconBg="gray.100"
              chart={
                <DonutChart
                  chartData={usersData.chartData}
                  chartOptions={usersData.chartOptions}
                  height="180px"
                  width="100%"
                />
              }
            />

            {/* Subscriptions Card */}
            <StatCard
              title="Subscriptions"
              value={subscriptionsData.total.toLocaleString()}
              subtitle={subscriptionsData.subtitle}
              icon={<FaCreditCard />}
              iconBg="gray.100"
              chart={
                <DonutChart
                  chartData={subscriptionsData.chartData}
                  chartOptions={subscriptionsData.chartOptions}
                  height="180px"
                  width="100%"
                />
              }
            />
          </Flex>

          {/* Right Side - Sales Dynamics Chart */}
          <Box
            flex="1"
            minW="500px"
            bg="white"
            borderRadius="20px"
            p={6}
            shadow="md"
            _dark={{ bg: 'navy.800' }}
          >
            <Flex justify="space-between" align="center" mb={6}>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="navy.700"
                _dark={{ color: 'white' }}
              >
                Sales dynamics
              </Text>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none transition duration-200 hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-navy-700 dark:text-white dark:hover:border-gray-500"
              >
                <option value="day">1 Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </Flex>
            <BarChart
              chartData={sourceTrafficData.chartData}
              chartOptions={sourceTrafficData.chartOptions}
              height="580px"
            />
          </Box>
        </Flex>

        {/* Revenue and Overall User Activity - Side by Side */}
        <Flex gap={6} flexWrap="wrap">
          {/* Revenue Chart */}
          <Box
            flex="1"
            minW="400px"
            bg="white"
            borderRadius="20px"
            p={6}
            shadow="md"
            _dark={{ bg: 'navy.800' }}
          >
            <Flex justify="space-between" align="center" mb={6}>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="navy.700"
                _dark={{ color: 'white' }}
              >
                Revenue
              </Text>
              <select
                value={revenueTimePeriod}
                onChange={(e) => setRevenueTimePeriod(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none transition duration-200 hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-navy-700 dark:text-white dark:hover:border-gray-500"
              >
                <option value="day">1 Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </Flex>
            <BarChart
              chartData={revenueData.chartData}
              chartOptions={revenueData.chartOptions}
              height="350px"
            />
          </Box>

          {/* Overall User Activity */}
          <Box
            flex="1"
            minW="400px"
            bg="white"
            borderRadius="20px"
            p={6}
            shadow="md"
            _dark={{ bg: 'navy.800' }}
          >
            <Flex justify="space-between" align="center" mb={6}>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="navy.700"
                _dark={{ color: 'white' }}
              >
                Overall User Activity
              </Text>
              <select
                value={activityTimePeriod}
                onChange={(e) => setActivityTimePeriod(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none transition duration-200 hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-navy-700 dark:text-white dark:hover:border-gray-500"
              >
                <option value="day">1 Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </Flex>
            <AreaChart
              chartData={userActivityData.chartData}
              chartOptions={userActivityData.chartOptions}
              height="350px"
            />
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Dashboard

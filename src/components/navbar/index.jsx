import React, { useState, useEffect } from 'react'
import Dropdown from 'components/dropdown'
import { FiAlignJustify } from 'react-icons/fi'
import Configurator from './Configurator'
import { IoMdLogOut } from 'react-icons/io'
import { IoWalletOutline } from 'react-icons/io5'
import { MdLockReset } from 'react-icons/md'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useSpinner } from 'common/SpinnerLoader'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import { useToaster } from 'common/Toaster'
import { Link } from 'react-router-dom'
import appConstants from 'common/config/PocketStudioConstants.js'
import RoutesComponent from 'routes'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { BsArrowBarUp } from 'react-icons/bs'
import TooltipHorizon from 'components/tooltip'
import { IoIosArrowDropdown } from 'react-icons/io'
import { clearAuthCookies } from 'common/utils/cookieUtils'

const { TOAST, HEY, SUBSCRIPTION_EXPIRED, KEYCLOAK_INIT } = appConstants
const apiService = ApiCaller()

/**
 * Component for the Navbar.
 *
 * @param {Object} props - The properties for the Navbar component.
 * @return {JSX.Element} The JSX for the Navbar component.
 */

const Navbar = (props) => {
  const { addToast } = useToaster()
  const { applicationType } = useParams()
  const location = useLocation()
  const [breadcrum, setBreadcrum] = useState([])
  const [routesData, setRoutesData] = useState([])
  const { showSpinner, hideSpinner } = useSpinner()
  const [billingInfo, setBillingInfo] = useState(null)
  let navigate = useNavigate()
  const userName = localStorage.getItem('userName') || 'Guest'
  const { onOpenSidenav, mini, brandText, isExpand, hovered, breadCrumbs } =
    props
  const [darkmode, setDarkmode] = useState(localStorage.darkMode === 'true')
  let appType = localStorage.getItem('appType')
  const routes = RoutesComponent()

  if (
    location.pathname.startsWith('/new-service/') ||
    location.pathname.startsWith('/deploying-service/')
  ) {
    appType = applicationType
  }

  useEffect(() => {
    if (routes) {
      setRoutesData(routes)
    }
  }, [routes])

  useEffect(() => {
    /**
     * Asynchronously finds the route that matches the given location's pathname and sets the breadcrumb accordingly.
     *
     * @param {Object} location - The location object containing the pathname.
     * @return {Promise<void>} A promise that resolves when the breadcrumb is set.
     */
    const findRouteAndSetBreadcrumb = async (location) => {
      if (!Array.isArray(routesData) || !location) {
        console.error(
          'routesData or location is undefined or not in the expected format'
        )
        setBreadcrum([])
        return
      }

      const route = await routesData?.find((route) => {
        if (!route.path) {
          return false
        }

        if (location.pathname.startsWith('/settings')) {
          return route.path === '/settings'
        } else if (
          route.path === location.pathname ||
          (route.path.includes(':') &&
            compareSegments(route.path, location.pathname))
        ) {
          return true
        }
        return false
      })
      if (route) {
        // Find breadcrumb in route items if available, otherwise use the route's breadcrumb
        const breadcrumb =
          route.items?.find((item) => item.path === location.pathname)
            ?.breadcrum ||
          route.breadcrum ||
          []
        setBreadcrum(breadcrumb)
      } else {
        setBreadcrum([])
      }
    }

    /**
     * Compares segments of two paths.
     *
     * @param {string} routePath - The path of the route.
     * @param {string} locationPath - The path of the location.
     * @return {boolean} Returns true if segments match, false otherwise.
     */
    const compareSegments = (routePath, locationPath) => {
      const routeSegments = routePath.split('/')
      const locationSegments = locationPath.split('/')
      if (routeSegments.length !== locationSegments.length) return false
      for (let i = 0; i < routeSegments.length; i++) {
        if (
          !routeSegments[i].startsWith(':') &&
          routeSegments[i] !== locationSegments[i]
        ) {
          return false
        }
      }
      return true
    }

    findRouteAndSetBreadcrumb(location)
  }, [location, routesData])

  useEffect(() => {
    if (darkmode) document.body.classList.add('dark')
    else document.body.classList.remove('dark')
  }, [darkmode])

  /**
   * Returns a string representing the type of application based on the given column value.
   *
   * @param {string} appType - The appType is a string.
   * @return {Object} The type of object contains image and title.
   */
  const handleLogout = async () => {
    try {
      // Clear all auth data from localStorage
      localStorage.removeItem('userData')
      localStorage.removeItem('darkMode')
      localStorage.removeItem('bearerToken')
      localStorage.removeItem('appType')
      localStorage.removeItem('userName')

      // Clear all auth-related cookies
      clearAuthCookies()

      // Navigate and add a success notification
      navigate('/sign-in')
      addToast({
        title: 'Successfully logged out',
        type: 'success',
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav
      className={`duration-175 linear right-3 top-0 flex flex-row flex-wrap items-center justify-between rounded-xl pt-2 transition-all ${
        !mini && isExpand
          ? 'w-[90%] md:w-[calc(100vw_-_8%)] lg:w-[calc(100vw_-_6%)] xl:w-[calc(100vw_-_350px)] 2xl:w-[calc(100vw_-_320px)]'
          : mini && hovered
          ? 'w-[calc(100vw_-_6%)] md:w-[calc(100vw_-_8%)] lg:w-[calc(100vw_-_6%)] xl:w-[calc(100vw_-_350px)] 2xl:w-[calc(100vw_-_280px)]'
          : isExpand === false
          ? 'w-[calc(100vw_-_6%)] md:w-[calc(100vw_-_8%)] lg:w-[calc(100vw_-_6%)] xl:w-[calc(100vw_-_152px)] 2xl:w-[calc(100vw_-_152px)]'
          : 'w-90%'
      } p-2 backdrop-blur-xl dark:bg-veryDarkBlueGray md:right-[19px] md:top-0 xl:top-[0px] ${
        breadCrumbs === 'Observability' ||
        breadCrumbs === 'Security And Policies' ||
        breadCrumbs === '404 Not Found'
          ? 'hidden'
          : ''
      }`}
    >
      <div className="ml-[6px] flex items-center justify-center">
        <p className="shrink text-[33px] font-bold text-navy-700 dark:text-white">
          {breadcrum && breadcrum.find((item) => item.serviceName)?.serviceName
            ? breadcrum.find((item) => item.serviceName).serviceName
            : breadcrum &&
              breadcrum.find((item) => item.projectName)?.projectName
            ? breadcrum.find((item) => item.projectName).projectName
            : brandText}
        </p>
        <div className="h-6 pt-1 dark:text-white">
          {breadcrum &&
            breadcrum.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && ' / '}{' '}
                {/* Add a separator if it's not the first breadcrumb */}
                {item.breadCrumDisabled ? (
                  <span className="text-sm font-normal text-navy-700 dark:text-white dark:hover:text-white">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={!item.breadCrumDisabled ? item.link : ''}
                    className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
      <div className="relative mt-[3px] flex h-[61px] w-[80px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-4 py-2 shadow-xl shadow-shadow-500 dark:!bg-darkGrayishBlue dark:shadow-none md:w-[80px] md:flex-grow-0 md:gap-1 xl:w-[80px] xl:gap-2">
        {/* start Notification */}
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden "
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5 hover:font-bold hover:text-navy-700" />
        </span>

        {/* <Dropdown
          button={
            <p className="cursor-pointer ">
              <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 hover:font-bold hover:text-navy-700 dark:text-white" />
            </p>
          }
          animation="origin-[65%_0%] origin-top-middle md:origin-top-right transition-all duration-300 ease-in-out"
          children={
            <div className="flex w-[285px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-darkGrayishBlue dark:text-white dark:shadow-none sm:w-[460px]">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  Notification
                </p>
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  Mark all read
                </p>
              </div>

              <button className="flex w-full items-center">
                <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-shadeBlue to-shadeBlue py-4 text-2xl text-white">
                  <BsArrowBarUp />
                </div>
                <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                  <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                    New Update: PockerStudio.ai Coming Soon...
                  </p>
                  <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                    A new update for Our PockerStudio is available!
                  </p>
                </div>
              </button>
            </div>
          }
          classNames={'py-2 top-4 -left-[90px] md:-left-[440px] w-max'}
        /> */}

        {/* <Configurator
          mini={props.mini}
          setMini={props.setMini}
          theme={props.theme}
          setTheme={props.setTheme}
          darkmode={darkmode}
          setDarkmode={setDarkmode}
        />
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              setDarkmode(false)
              localStorage.darkMode = false
            } else {
              setDarkmode(true)
              localStorage.darkMode = true
            }
          }}
        ></div> */}
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <span className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-shadeBlue uppercase text-white dark:bg-shadeBlue">
              {userName?.charAt(0)}
            </span>
          }
          children={
            <div className="flex h-max w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat pb-4 shadow-xl shadow-shadow-500 dark:!bg-darkGrayishBlue dark:text-white dark:shadow-none">
              <div className="ml-4 mt-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold  text-navy-700 dark:text-white">
                    👋 <span className="mx-1">{HEY}</span>
                    <span className="capitalize">{userName}</span>
                  </p>
                </div>
              </div>
              <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 " />
              <div
                className="ml-4 mt-3 hover:cursor-pointer "
                onClick={() => handleLogout()}
              >
                <div className="flex items-center gap-2">
                  <p className="flex text-sm font-medium text-red-500 hover:font-bold hover:text-red-500 ">
                    <IoMdLogOut className="m-0.5" />
                    <span className="ml-1">Log Out </span>
                  </p>
                </div>
              </div>
            </div>
          }
          classNames={'py-2 top-8 -left-[180px] w-max'}
        />
      </div>
    </nav>
  )
}

export default Navbar

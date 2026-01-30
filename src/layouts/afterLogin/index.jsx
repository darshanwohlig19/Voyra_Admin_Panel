import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Portal } from '@chakra-ui/portal'
import Navbar from 'components/navbar'
import Sidebar from 'components/sidebar'
// import Footer from 'components/footer/Footer'
import RoutesComponent from 'routes'
import AuthGuard from 'common/guard/authGuard'
import PageNotFound from 'views/others/404'
import appConstants from 'common/config/AppConstants'
import 'assets/css/App.css'
import { useNavigate } from 'react-router-dom'

const { DASHBOARD } = appConstants

/**
 * Renders the layout for the after login page.
 *
 * @param {object} props - The props object containing the component's properties.
 * @param {boolean} props.mini - Determines if the sidebar is in mini mode.
 * @param {function} props.setTheme - Function to set the theme.
 * @param {function} props.setMini - Function to set the mini property.
 * @return {JSX.Element} The rendered layout.
 */
const AfterLoginLayout = (props) => {
  const routes = RoutesComponent()
  const [routesData, setRoutesData] = useState([])
  const { ...rest } = props
  const location = useLocation()
  const [open, setOpen] = useState(true)
  const [sideBar, setSideBar] = useState(true)
  const [isExpand, setExpand] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [currentRoute, setCurrentRoute] = useState('Department')
  const [breadCrumbs, setBreadCrumbs] = useState('')
  const navigate = useNavigate() // Use navigate for programmatic navigation

  // Check if DashboardNote should be visible
  const isDashboardNoteVisible = location.pathname === '/'

  useEffect(() => {
    if (routes) {
      setRoutesData(routes)
    }
  }, [routes])
  useEffect(() => {
    window.addEventListener('resize', () =>
      window.innerWidth < 1200
        ? setSideBar(false)
        : setSideBar(true) || window.innerWidth < 1200
        ? setSideBar(false)
        : setSideBar(true)
    )
  }, [])
  useEffect(() => {
    const activeRoute = getActiveRoute(routesData)
    if (!activeRoute) {
      // Redirect to '/departments' if no active route is found
      setCurrentRoute('Department')
      setBreadCrumbs('Department')
      if (location.pathname === '/') {
        navigate('/', { replace: true })
      }
    }
  }, [location.pathname, routesData, navigate])

  useEffect(() => {
    getActiveRoute(routesData)
    // eslint-disable-next-line
  }, [location.pathname, routesData])
  useEffect(() => {
    if (routes) {
      setRoutesData(routes)
    }
  }, [routes])
  /**
   * Retrieves the active route from the given routes array.
   *
   * @param {array} routes - The array of routes to search through.
   * @return {string} The active route.
   */
  const getActiveRoute = (routes) => {
    let activeRoute = ''
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].items)
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute
        }
      } else {
        // Handle empty path (dashboard) - only match exact root path
        if (routes[i].path === '') {
          if (location.pathname === '/' || location.pathname === '') {
            let breadCrumb = routes[i].parentTitle
              ? `${routes[i].parentTitle} / ${routes[i].name}`
              : routes[i].name
            setCurrentRoute(routes[i].name)
            setBreadCrumbs(breadCrumb)
            return routes[i].name
          }
        } else if (window.location.href.indexOf(routes[i].path) !== -1) {
          let breadCrumb = routes[i].parentTitle
            ? `${routes[i].parentTitle} / ${routes[i].name}`
            : routes[i].name
          setCurrentRoute(routes[i].name)
          setBreadCrumbs(breadCrumb)
          return routes[i].name
        }
      }
    }
    return activeRoute // Return empty if no active route is found
  }
  /**
   * Returns the active navbar item based on the provided routes.
   *
   * @param {Array} routes - The array of route objects
   * @return {boolean} The active navbar item
   */
  const getActiveNavbar = (routes) => {
    let activeNavbar = false
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbar(routes[i].items)
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar
        }
      } else {
        // Handle empty path (dashboard) - only match exact root path
        if (routes[i].path === '') {
          if (location.pathname === '/' || location.pathname === '') {
            return routes[i].secondary
          }
        } else if (window.location.href.indexOf(routes[i].path) !== -1) {
          return routes[i].secondary
        }
      }
    }
    return activeNavbar
  }
  useEffect(() => {
    sideBarClose()
    window.addEventListener('resize', sideBarClose)
    return () => {
      window.removeEventListener('resize', sideBarClose)
    }
  }, [])

  /**
   * A function that closes the sidebar based on the window width.
   *
   * @return {void} No return value
   */
  const sideBarClose = () => {
    if (window.innerWidth <= 1240) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }
  /**
   * A function that takes an array of routes and returns an array of Route components based on the route configuration.
   *
   * @param {array} routes - The array of route configurations
   * @return {array} An array of Route components
   */
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === '/afterLogin') {
        return (
          <Route
            path={`${prop.path}`}
            element={<AuthGuard>{prop.component}</AuthGuard>}
            key={key}
            {...rest}
          />
        )
      }
      if (prop.collapse) {
        return getRoutes(prop.items)
      }
      return null
    })
  }
  return (
    <div className="flex h-full w-full bg-graySlightBluish dark:bg-veryDarkBlueGray">
      <Sidebar
        onOpenSideBar={() => setSideBar(!sideBar)}
        open={open}
        sideBar={sideBar}
        hovered={hovered}
        isExpand={isExpand}
        setHovered={setHovered}
        onExpand={() => setExpand(!isExpand)}
        mini={props.mini}
        onClose={() => sideBarClose()}
      />
      {/* Navbar & Main Content */}
      <div className="font-dm h-full  w-full dark:bg-veryDarkBlueGray">
        {/* Main Content */}
        <main
          className={`bg-confixaBg mx-2.5 min-h-screen flex-none transition-all dark:bg-veryDarkBlueGray xl:ml-[230px] ${
            location.pathname.includes('/observabilitys')
              ? ''
              : 'md:p-6 md:pr-2'
          }`}
        >
          {/* Routes */}
          <div>
            <Navbar
              onOpenSidenav={() => setOpen(!open)}
              brandText={currentRoute}
              breadCrumbs={breadCrumbs}
              secondary={getActiveNavbar(routes)}
              theme={props.theme}
              setTheme={props.setTheme}
              hovered={hovered}
              mini={props.mini}
              setMini={props.setMini}
              isExpand={isExpand}
              {...rest}
            />
            <div
              className={`mx-auto p-2 ${
                location.pathname.includes('/not-found') ? '!pt-2.5' : '!pt-4'
              } md:p-2`}
            >
              <Routes>
                {getRoutes(routes)}
                <Route path="/" element={<Navigate to="/" replace />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </div>
            {/* {!location.pathname.includes('/observability') && (
              <div className="p-3">
                <Footer />
              </div>
            )} */}
          </div>
        </main>
      </div>
    </div>
  )
}
export default AfterLoginLayout

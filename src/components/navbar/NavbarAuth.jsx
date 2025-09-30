import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiAlignJustify } from 'react-icons/fi'
// Custom components
import { SidebarContext } from 'contexts/SidebarContext'
import dropdownMain from 'assets/img/layout/dropdownMain.png'

// Assets
import { GoChevronDown } from 'react-icons/go'
import RoutesComponent from 'routes.js'
import dmsConstants from 'common/config/PocketStudioConstants.js'
const { DMS } = dmsConstants

/**
 * Renders the NavbarAuth component with the provided props.
 *
 * @param {object} props - the properties passed to the component
 * @return {JSX.Element} the rendered NavbarAuth component
 */
function NavbarAuth(props) {
  const routes = RoutesComponent()
  const { sidebarWidth, onOpenSidenav, ...rest } = props
  const [openDashboard, setOpenDashboard] = useState(false)
  const [openNft, setOpenNft] = useState(false)
  const [openMain, setOpenMain] = useState(false)
  const [openAuth, setOpenAuth] = useState(false)

  // menus object
  let authObject = getLinksCollapse('Authentication')
  let mainObject = getLinksCollapse('Main Pages')
  let dashboardsObject = getLinks('Dashboards')
  let nftsObject = getLinks('NFTs')
  // menus links

  /**
   * Retrieves the items for a specific route.
   *
   * @param {string} routeName - The name of the route to retrieve items for
   * @return {array} The items for the specified route
   */
  function getLinks(routeName) {
    let foundRoute = routes.filter(function (route) {
      return route.items && route.name === routeName
    })
    return foundRoute[0].items
  }
  /**
   * Retrieves the links that have collapse set to true for a given route name.
   *
   * @param {string} routeName - The name of the route to search for
   * @return {array} The array of links with collapse set to true
   */
  function getLinksCollapse(routeName) {
    let foundRoute = routes.filter(function (route) {
      return route.items && route.name === routeName
    })

    let foundLinks = foundRoute[0].items.filter(function (link) {
      return link.collapse === true
    })

    return foundLinks
  }
  /**
   * Creates dashboard links based on the given routes.
   *
   * @param {Array} routes - The routes to create dashboard links from.
   * @return {Array} An array of dashboard links.
   */
  const createDashboardsLinks = (routes) => {
    return routes.map((link, key) => {
      return (
        <Link key={key} to={link.path} style={{ maxWidth: 'max-content' }}>
          <p className="text-sm font-medium text-gray-600">{link.name}</p>
        </Link>
      )
    })
  }
  /**
   * Creates an array of React Link components based on the input routes array.
   *
   * @param {Array} routes - The array of routes to create links for.
   * @return {Array} An array of React Link components.
   */
  const createNftsLinks = (routes) => {
    return routes.map((link, key) => {
      return (
        <Link key={key} to={link.path} style={{ maxWidth: 'max-content' }}>
          <p className="text-sm font-medium text-gray-600">{link.name}</p>
        </Link>
      )
    })
  }
  /**
   * Maps over the routes array and creates main links based on the provided data.
   *
   * @param {Array} routes - The array of routes to be mapped over.
   * @return {Array} An array of main links created from the routes.
   */
  const createMainLinks = (routes) => {
    return routes.map((link, key) => {
      if (link.collapse === true) {
        return (
          <div className="flex w-max flex-col flex-wrap" key={key}>
            <div className="mb-2 flex cursor-default items-center">
              <p className="mr-auto text-sm font-bold uppercase text-navy-700 dark:text-white">
                {link.name}
              </p>
            </div>
            <div className="flex w-max flex-col flex-wrap gap-1 dark:text-white">
              {createMainLinks(link.items)}
            </div>
          </div>
        )
      } else {
        return (
          <Link key={key} to={link.path}>
            <p className="text-sm text-gray-600">{link.name}</p>
          </Link>
        )
      }
    })
  }
  /**
   * Creates authentication links based on the provided routes.
   *
   * @param {array} routes - The array of routes to create links from
   * @return {array} The array of created authentication links
   */
  const createAuthLinks = (routes) => {
    return routes.map((link, key) => {
      if (link.collapse === true) {
        return (
          <div className="flex w-max flex-col flex-wrap" key={key}>
            <div className="mb-1 flex cursor-default items-center">
              <p className="mr-auto text-sm font-bold uppercase text-navy-700 dark:text-white">
                {link.name}
              </p>
            </div>
            <div className="flex flex-col flex-wrap gap-1">
              {createAuthLinks(link.items)}
            </div>
          </div>
        )
      } else {
        return (
          <Link key={key} to={link.path}>
            <p className="text-sm text-gray-600">{link.name}</p>
          </Link>
        )
      }
    })
  }

  return (
    <SidebarContext.Provider value={{ sidebarWidth }}>
      <div
        {...rest}
        className="z-[1] mx-auto flex h-[80px] w-full max-w-screen-xl items-center justify-between px-3 xl:items-end"
      >
        {/* horizon logo */}
        <a
          href="/admin/dashboards/default"
          className="leading-1 font-poppins text-[26px] font-bold uppercase text-white"
        >
          {/* {DMS.DMS_HEADER} */}
        </a>
        <span
          className="flex cursor-pointer text-xl text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        {/* menus */}
        <div className="mb-[6px] hidden items-center gap-3 xl:flex">
          {/* Dashboard submenu */}
          <div
            onMouseLeave={() => setOpenDashboard(false)}
            onMouseEnter={() => setOpenDashboard(true)}
            className="relative flex items-center gap-1 text-sm font-medium text-white"
          >
            <p className="cursor-pointer py-1">Dashboard</p>
            <p className="cursor-pointer">
              <GoChevronDown />
            </p>
            <div
              className={`duration-125 linear absolute -left-4 top-6 z-10 w-max origin-top-left py-2 transition-all ${
                openDashboard ? 'scale-100' : 'scale-0'
              }`}
            >
              <div
                className={`grid h-fit w-fit grid-cols-2 items-center gap-4 rounded-2xl bg-white px-3 py-3 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none`}
              >
                <div className="flex flex-col gap-2">
                  {createDashboardsLinks(dashboardsObject)}
                </div>
                <div
                  style={{ backgroundImage: `url(${dropdownMain})` }}
                  className="h-28 w-28 rounded-xl bg-cover bg-no-repeat"
                />
              </div>
            </div>
          </div>
          {/* NFTs submenu */}
          <div
            onMouseLeave={() => setOpenNft(false)}
            onMouseEnter={() => setOpenNft(true)}
            className="relative flex items-center gap-1 text-sm font-medium text-white"
          >
            <p className="cursor-pointer py-1">NFTs</p>
            <p className="cursor-pointer">
              <GoChevronDown />
            </p>
            <div
              className={`duration-125 linear absolute -left-4 top-6 z-10 w-max origin-top-left py-2 transition-all ${
                openNft ? 'scale-100' : 'scale-0'
              }`}
            >
              <div
                className={`grid h-fit w-fit grid-cols-2 items-center gap-4 rounded-2xl bg-white px-3 py-3 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none`}
              >
                <div className="flex flex-col gap-2">
                  {createNftsLinks(nftsObject)}
                </div>
                <div
                  style={{ backgroundImage: `url(${dropdownMain})` }}
                  className="h-28 w-28 rounded-xl bg-cover bg-no-repeat"
                />
              </div>
            </div>
          </div>
          {/* Main submenu */}
          <div
            onMouseLeave={() => setOpenMain(false)}
            onMouseEnter={() => setOpenMain(true)}
            className="relative flex items-center gap-1 text-sm font-medium text-white"
          >
            <p className="cursor-pointer py-1">Main Pages</p>
            <p className="cursor-pointer">
              <GoChevronDown />
            </p>
            <div
              className={`duration-125 linear absolute -left-4 top-6 z-10 w-max origin-top-left py-2 transition-all ${
                openMain ? 'scale-100' : 'scale-0'
              }`}
            >
              <div className="grid h-fit w-fit grid-cols-2 gap-4 rounded-2xl bg-white px-3 py-3 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                <div className="grid grid-cols-2 gap-4">
                  {createMainLinks(mainObject)}
                </div>
                <div
                  style={{ backgroundImage: `url(${dropdownMain})` }}
                  className="f-full col-span-1 rounded-xl bg-cover bg-no-repeat"
                />
              </div>
            </div>
          </div>
          {/* Auth submenu */}
          <div
            onMouseLeave={() => setOpenAuth(false)}
            onMouseEnter={() => setOpenAuth(true)}
            className="relative flex items-center gap-1 text-sm font-medium text-white"
          >
            <p className="cursor-pointer py-1">Authentication</p>
            <p className="cursor-pointer">
              <GoChevronDown />
            </p>
            <div
              className={`duration-125 linear absolute -left-4 top-6 z-10 w-max origin-top-left py-2 transition-all ${
                openAuth ? 'scale-100' : 'scale-0'
              }`}
            >
              <div className="grid h-fit w-fit grid-cols-2 gap-4 rounded-xl bg-white px-3 py-3 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                <div className="grid grid-cols-2 gap-4">
                  {createAuthLinks(authObject)}
                </div>

                <div
                  style={{ backgroundImage: `url(${dropdownMain})` }}
                  className="col-span-1 rounded-xl bg-cover bg-no-repeat"
                />
              </div>
            </div>
          </div>
        </div>
        <a
          target="blank"
          href="https://horizon-ui.com/pro?ref=live-pro-tailwind-react"
        >
          <button className="hidden items-center justify-center rounded-3xl bg-white px-8 py-2 text-base font-medium text-brand-500 transition duration-200 hover:opacity-90 active:opacity-80 xl:flex">
            Buy Now
          </button>
        </a>
      </div>
    </SidebarContext.Provider>
  )
}

export default NavbarAuth

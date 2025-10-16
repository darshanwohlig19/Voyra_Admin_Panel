/* eslint-disable */
import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import DashIcon from 'components/icons/DashIcon'
import { FaCircle } from 'react-icons/fa'
// import { FaCircle, FaTrashAlt } from 'react-icons/fa'; // Modify this line
import TooltipHorizon from '../../tooltip'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/accordion'

/**
 * Function to render sidebar links based on the provided props.
 *
 * @param {object} props - The props object containing information about routes, hover state, and whether the sidebar is minimized.
 * @return {JSX.Element} The sidebar links JSX to be rendered.
 */
export function SidebarLinks(props) {
  let location = useLocation()
  const { id } = useParams()
  const { routes, hovered, mini, isExpand } = props
  const mode = localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light'

  const handleClick = (route) => {
    if (route.openInNewTab) {
      window.open(route.path, '_blank')
    }
  }

  /**
   * Determines if the current route is active based on the provided route name.
   *
   * @param {string} routeName - The name of the route to check.
   * @return {boolean} Returns true if the current route is active, false otherwise.
   */
  const activeRoute = (routeName) => {
    let pathname = location.pathname
    if (routeName === '/') {
      return pathname === '/'
    }
    if (pathname.includes('/') && routeName === '/departments') {
      return true
    }

    if (
      (pathname.includes('/files') || pathname.includes('/folders')) &&
      (routeName === '/' || routeName === '/')
    ) {
      return true
    }

    // Exact match check to avoid partial matching (e.g., short-type vs short-type-2)
    const pathSegments = pathname.split('/').filter(Boolean)
    const routeSegments = routeName.split('/').filter(Boolean)

    // Check if the last segment of pathname exactly matches the last segment of routeName
    return (
      pathSegments[pathSegments.length - 1] ===
      routeSegments[routeSegments.length - 1]
    )
  }

  const createLinks = (routes) => {
    return routes.map((route, key) => {
      if (route.collapse) {
        return (
          <Accordion allowToggle key={key}>
            <AccordionItem mb="8px" border="none" key={key}>
              <AccordionButton
                className="group"
                display="flex"
                _hover={{
                  bg: 'unset',
                }}
                _focus={{
                  boxShadow: 'none',
                }}
                borderRadius="8px"
                w={{
                  sm: '100%',
                  xl: '100%',
                }}
                px={route.icon ? null : '0px'}
                py="0px"
                bg={'transparent'}
                ms={0}
                mb="4px"
              >
                {route.icon ? (
                  <div
                    className={`mb-1.5 flex w-full items-center pl-8 pr-7 ${
                      !mini
                        ? ' justify-between'
                        : mini && hovered
                        ? ' justify-between'
                        : ' justify-center'
                    }`}
                  >
                    <div>
                      <div className="align-center flex w-full justify-center">
                        <div
                          className={`flex items-center justify-center ${
                            !mini
                              ? 'mr-3.5'
                              : mini && hovered
                              ? 'mr-3.5'
                              : 'mx-auto'
                          } ${
                            activeRoute(route.path.toLowerCase())
                              ? 'text-vividSkyBlue dark:text-white'
                              : 'text-gray-600'
                          } ${
                            activeRoute(route.path.toLowerCase())
                              ? '22px'
                              : '26px'
                          }`}
                        >
                          {!isExpand ? (
                            <TooltipHorizon
                              extra="border border-gray-200 dark:border-gray-700"
                              trigger={
                                <span
                                  className={`${
                                    activeRoute(route.path) === true
                                      ? 'font-bold text-vividSkyBlue dark:text-white'
                                      : 'font-medium text-gray-600'
                                  } relative group-hover:text-vividSkyBlue dark:group-hover:text-white`}
                                >
                                  {route.icon ? route.icon : <DashIcon />}
                                </span>
                              }
                              content={route.name}
                              placement="right"
                            />
                          ) : (
                            <span
                              className={`${
                                activeRoute(route.path) === true
                                  ? 'font-bold text-vividSkyBlue dark:text-white'
                                  : 'font-medium text-gray-600'
                              } relative group-hover:text-vividSkyBlue dark:group-hover:text-white`}
                            >
                              {route.icon ? route.icon : <DashIcon />}
                            </span>
                          )}
                        </div>
                        <p
                          className={`mr-auto group-hover:font-bold group-hover:text-black dark:group-hover:text-white
                          ${
                            !mini && isExpand
                              ? 'block'
                              : mini && hovered
                              ? 'block'
                              : 'block xl:hidden'
                          } ${
                            activeRoute(route.path.toLowerCase())
                              ? 'text-700 font-bold text-navy-700 dark:text-white'
                              : 'font-medium text-gray-600'
                          } `}
                        >
                          {isExpand ? route.name : null}
                        </p>
                      </div>
                    </div>
                    <AccordionIcon
                      ms="auto"
                      className={`!text-gray-600 
                          ${
                            !mini
                              ? 'block'
                              : mini && hovered
                              ? 'block'
                              : 'block xl:hidden'
                          }`}
                      display={
                        mini === false
                          ? 'block'
                          : mini === true && hovered === true
                          ? 'block'
                          : { base: 'block', xl: 'none' }
                      }
                      transform={route.icon ? null : 'translateX(-70%)'}
                    />
                  </div>
                ) : (
                  <div
                    className={`flex w-full items-center pb-0 pt-0 ${
                      !mini
                        ? 'ml-5 pl-12'
                        : mini && hovered
                        ? 'ml-5 pl-12'
                        : 'ml-5 pl-12 xl:ml-[unset] xl:justify-center xl:pl-8 xl:pr-7 '
                    } pr-7`}
                  >
                    <div>
                      <p
                        className={`mr-auto text-sm font-medium ${
                          activeRoute(route.path.toLowerCase())
                            ? 'text-800 text-navy-700 dark:text-white'
                            : 'text-gray-600'
                        } ${
                          activeRoute(route.path.toLowerCase())
                            ? '22px'
                            : '26px'
                        }`}
                      >
                        {!mini && isExpand
                          ? route.name
                          : mini && hovered
                          ? route.name
                          : route.name[0]}
                      </p>
                    </div>
                    <AccordionIcon
                      ms="auto"
                      className={`!text-gray-600 
                          ${
                            !mini
                              ? 'block'
                              : mini && hovered
                              ? 'block'
                              : 'block xl:hidden'
                          }`}
                      display={
                        !mini ? 'block' : mini && hovered ? 'block' : 'none'
                      }
                      transform={null}
                    />
                  </div>
                )}
              </AccordionButton>
              <AccordionPanel
                pe={route.icon ? null : '0px'}
                py="0px"
                ps={
                  route.icon
                    ? !mini
                      ? '8px'
                      : mini && hovered
                      ? '8px'
                      : 'base:8px xl:0px'
                    : !mini
                    ? '8px'
                    : mini && hovered
                    ? '8px'
                    : 'base:8px xl:0px'
                }
                display={
                  !mini
                    ? 'block'
                    : mini && hovered
                    ? 'block'
                    : 'base:block xl:flex'
                }
              >
                <ul>
                  {route.icon
                    ? createLinks(route.items)
                    : createAccordionLinks(route.items)}
                </ul>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        )
      } else {
        if (route.openInNewTab) {
          return (
            <a
              href={route.path}
              key={key}
              target="_blank"
              rel="noopener noreferrer"
              className={`${!route.isVisible ? 'hidden' : ''}`}
              style={{ pointerEvents: route.isComing ? 'none' : '' }}
              onClick={(e) => {
                e.preventDefault()
                handleClick(route)
              }}
            >
              {route.icon ? (
                <div
                  className="relative mb-2 flex items-center justify-between hover:cursor-pointer"
                  style={{ cursor: route.isComing ? 'none' : '' }}
                >
                  <li
                    className={`my-[3px] flex ${
                      route.isComing ? 'max-w-[200px]' : ''
                    } group cursor-pointer items-center px-[30px]`}
                    style={{ cursor: route.isComing ? 'none' : '' }}
                  >
                    {!isExpand ? (
                      <TooltipHorizon
                        extra="border border-gray-200 dark:border-gray-700"
                        trigger={
                          <span
                            className={`${
                              activeRoute(route.path)
                                ? 'font-bold text-vividSkyBlue dark:text-white'
                                : 'font-medium text-gray-600'
                            } relative group-hover:text-vividSkyBlue dark:group-hover:text-white`}
                          >
                            {route.openInNewTab ? (
                              <span
                                onClick={(e) => {
                                  e.preventDefault()
                                  // handleClick(route)
                                }}
                              >
                                {route.icon ? (
                                  <span className="group-hover:text-vividSkyBlue dark:group-hover:text-white">
                                    {' '}
                                    {route.icon}
                                  </span>
                                ) : (
                                  <DashIcon className="group-hover:text-brand-500 dark:group-hover:text-white" />
                                )}
                              </span>
                            ) : route.icon ? (
                              <span className="group-hover:text-vividSkyBlue dark:group-hover:text-white">
                                {' '}
                                {route.icon}
                              </span>
                            ) : (
                              <DashIcon className="group-hover:text-vividSkyBlue dark:group-hover:text-white" /> // added hover effect
                            )}
                          </span>
                        }
                        content={route.name}
                        placement="right"
                      />
                    ) : (
                      <span
                        className={`${
                          activeRoute(route.path) === true
                            ? 'font-bold text-vividSkyBlue dark:text-white'
                            : 'font-medium text-gray-600'
                        } relative font-bold group-hover:text-vividSkyBlue dark:group-hover:text-white `}
                      >
                        {route.icon ? route.icon : <DashIcon />}
                      </span>
                    )}
                    <p
                      className={`leading-1 ml-4 flex ${
                        activeRoute(route.path) === true
                          ? 'font-bold text-navy-700 dark:text-white'
                          : 'font-medium text-gray-600 dark:text-white'
                      } font-bold group-hover:font-bold  group-hover:text-navy-700 dark:group-hover:text-white`}
                    >
                      {route.openInNewTab ? (
                        <span
                          onClick={(e) => {
                            e.preventDefault()
                            // handleClick(route)
                          }}
                        >
                          {isExpand ? route.name : null}
                        </span>
                      ) : isExpand ? (
                        route.name
                      ) : null}
                    </p>
                  </li>
                  {/* {activeRoute(route.path) ? (
                    <div className="absolute right-0 top-px h-9 h-[1.80rem] w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                  ) : null} */}
                  {route.isComing && isExpand ? (
                    <>
                      <span className="mr-2 flex h-6 w-[76px] items-center justify-center rounded-[20px] border border-solid border-gray-600 px-1 text-center text-[9px] font-medium text-gray-600 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90">
                        Coming Soon
                      </span>
                    </>
                  ) : null}
                </div>
              ) : (
                <div
                  className={`relative mb-2 flex justify-between ${
                    !mini ? '' : mini && hovered ? '' : 'xl:justify-center'
                  } hover:cursor-pointer`}
                >
                  <li
                    className="my-[3px] flex cursor-pointer items-center px-[22px]"
                    key={key}
                  >
                    <span
                      className={`flex text-sm  leading-none ${
                        !mini
                          ? 'ml-9'
                          : mini && hovered
                          ? 'ml-9'
                          : 'ml-9 xl:ml-0'
                      } ${
                        activeRoute(route.path) === true
                          ? 'font-medium text-navy-700 dark:text-white'
                          : 'font-medium text-gray-600'
                      }`}
                    >
                      {!mini
                        ? route.name
                        : mini && hovered
                        ? route.name
                        : route.name[0]}
                    </span>
                  </li>
                  {route.isComing ? (
                    <>
                      <span className="mr-2 flex h-6 w-[76px] items-center justify-center rounded-[20px] border border-solid border-gray-600 px-1  text-center text-[9px] font-medium text-gray-600 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90 ">
                        Coming Soon
                      </span>
                    </>
                  ) : null}
                </div>
              )}
            </a>
          )
        } else {
          return (
            <Link
              to={route.path}
              key={key}
              className={`${!route.isVisible ? 'hidden' : ''}`}
              style={{ pointerEvents: route.isComing ? 'none' : '' }}
              onClick={(e) => {
                if (route.openInNewTab) {
                  e.preventDefault()
                  handleClick(route)
                }
              }}
            >
              {route.icon ? (
                <div
                  className={`relative mb-5 flex items-center justify-between hover:cursor-pointer ${
                    isExpand ? '' : ''
                  }`}
                  style={{ cursor: route.isComing ? 'none' : '' }}
                >
                  <li
                    className={`my-[3px] flex ${
                      route.isComing ? 'max-w-[200px]' : ''
                    } group cursor-pointer items-center ${
                      activeRoute(route.path)
                        ? 'flex w-full items-center border-l-4 border-[#4880FF] p-4'
                        : ''
                    }`}
                    style={{
                      cursor: route.isComing ? 'none' : '',
                      background: activeRoute(route.path)
                        ? localStorage.getItem('darkMode') === 'true'
                          ? 'linear-gradient(90deg, rgb(0, 0, 0) 60.5%, rgba(255, 0, 83, 0) 100%)'
                          : 'linear-gradient(90deg, rgba(231, 238, 255, 1) 60.5%, rgba(255, 0, 83, 0) 100%)'
                        : 'none', // No gradient if route is not active
                    }}
                  >
                    {!isExpand ? (
                      <TooltipHorizon
                        extra="border border-gray-200 dark:border-gray-700"
                        trigger={
                          <span
                            className={`${
                              activeRoute(route.path) === true
                                ? 'font-bold text-moderateBlue dark:text-white'
                                : 'font-medium text-gray-600'
                            } relative group-hover:text-moderateBlue dark:group-hover:text-white`}
                          >
                            {route.openInNewTab ? (
                              <span
                                onClick={(e) => {
                                  e.preventDefault()
                                  // handleClick(route)
                                }}
                              >
                                {route.icon ? route.icon : <DashIcon />}
                              </span>
                            ) : route.icon ? (
                              route.icon
                            ) : (
                              <DashIcon />
                            )}
                          </span>
                        }
                        content={route.name}
                        placement="right"
                      />
                    ) : (
                      <span
                        className={`${
                          activeRoute(route.path) === true
                            ? 'font-bold text-moderateBlue dark:text-white'
                            : 'font-medium text-gray-600'
                        } relative group-hover:text-moderateBlue dark:group-hover:text-white`}
                      >
                        {route.icon ? route.icon : <DashIcon />}
                      </span>
                    )}
                    <p
                      className={`leading-1 ml-4 flex ${
                        activeRoute(route.path) === true
                          ? 'font-bold text-navy-700 dark:text-white'
                          : 'font-medium text-gray-600 dark:text-white'
                      } group-hover:font-bold group-hover:text-navy-700 dark:group-hover:text-white`}
                    >
                      {route.openInNewTab ? (
                        <span
                          onClick={(e) => {
                            e.preventDefault()
                            // handleClick(route)
                          }}
                        >
                          {isExpand ? route.name : null}
                        </span>
                      ) : isExpand ? (
                        route.name
                      ) : null}
                    </p>
                  </li>
                  {/* {activeRoute(route.path) ? (
                    <div className="absolute right-0 top-px h-9 h-[1.80rem] w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                  ) : null} */}
                  {route.isComing && isExpand ? (
                    <>
                      <span className="mr-2 flex h-6 w-[76px] items-center justify-center rounded-[20px] border border-solid border-gray-600 px-1  text-center text-[9px] font-medium text-gray-600 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90 ">
                        Coming Soon
                      </span>
                    </>
                  ) : null}
                </div>
              ) : (
                <div
                  className={`relative mb-2 flex justify-between ${
                    !mini ? '' : mini && hovered ? '' : 'xl:justify-center'
                  } hover:cursor-pointer`}
                >
                  <li
                    className="my-[3px] flex cursor-pointer items-center px-[22px]"
                    key={key}
                  >
                    <span
                      className={`flex text-sm  leading-none ${
                        !mini
                          ? 'ml-9'
                          : mini && hovered
                          ? 'ml-9'
                          : 'ml-9 xl:ml-0'
                      } ${
                        activeRoute(route.path) === true
                          ? 'font-medium text-navy-700 dark:text-white'
                          : 'font-medium text-gray-600'
                      }`}
                    >
                      {!mini
                        ? route.name
                        : mini && hovered
                        ? route.name
                        : route.name[0]}
                    </span>
                  </li>
                  {route.isComing ? (
                    <>
                      <span className="mr-2 flex h-6 w-[76px] items-center justify-center rounded-[20px] border border-solid border-gray-600 px-1  text-center text-[9px] font-medium text-gray-600 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90 ">
                        Coming Soon
                      </span>
                    </>
                  ) : null}
                </div>
              )}
            </Link>
          )
        }
      }
    })
  }

  const createAccordionLinks = (routes) => {
    return routes.map((route, index) => {
      return (
        <Link key={index} to={route.path}>
          <div
            className={`relative ${
              !mini ? 'ml-7' : mini && hovered ? 'ml-7' : 'ml-7 xl:ml-4'
            } mb-1 flex hover:cursor-pointer`}
          >
            <li
              className="my-[3px] flex cursor-pointer items-center px-8"
              key={index}
            >
              <span className={`text-brand-500 dark:text-white`}>
                <FaCircle className={`mr-0.5 h-1.5 w-1.5`} />
              </span>
              <span
                className={`ml-2 flex text-sm  ${
                  activeRoute(route.path) === true
                    ? 'font-medium text-navy-700 dark:text-white'
                    : 'font-medium text-gray-600'
                }`}
              >
                {!mini
                  ? route.name
                  : mini && hovered
                  ? route.name
                  : route.name[0]}
              </span>
            </li>
          </div>
        </Link>
      )
    })
  }

  return <>{createLinks(routes)}</>
}

export default SidebarLinks

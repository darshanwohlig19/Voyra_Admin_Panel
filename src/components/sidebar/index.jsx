/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiX } from 'react-icons/hi'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { IoSearchOutline } from 'react-icons/io5'
import { MdOutlineFileUpload } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

// Import components
import Card from 'components/card'
import Links from './components/Links'
import RoutesComponent from 'routes'

// Import scrollbar renderers
import {
  renderThumb,
  renderTrack,
  renderView,
  renderViewMini,
} from 'components/scrollbar/Scrollbar'

function Sidebar(props) {
  const routes = RoutesComponent()
  const location = useLocation()
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isObservabilityPage, setIsObservabilityPage] = useState(false)
  const navigate = useNavigate() // Modal state

  const {
    open,
    onClose,
    variant,
    mini,
    hovered,
    setHovered,
    onExpand,
    isExpand,
    sideBar,
    onOpenSideBar,
  } = props

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1240)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    setIsObservabilityPage(location.pathname === '/observability')
  }, [location.pathname])

  const getZIndex = () => {
    if (isObservabilityPage && sideBar) {
      return 'z-index-responsive'
    } else if (isObservabilityPage) {
      return 'z-50'
    } else {
      return ''
    }
  }

  return (
    <>
      <div>
        {isObservabilityPage && (
          <div>
            <span
              className={`sidebar-toggle-icon ${
                isExpand && !sideBar
                  ? 'expanded'
                  : sideBar
                  ? 'sidebar-open'
                  : ''
              }`}
              onClick={() => {
                onOpenSideBar()
              }}
            >
              {!sideBar && isExpand ? (
                <FaArrowLeft onClick={() => onOpenSideBar()} />
              ) : isExpand ? (
                <FaArrowRight onClick={() => onOpenSideBar()} />
              ) : (
                <FaArrowRight onClick={() => onOpenSideBar()} />
              )}
            </span>
          </div>
        )}
      </div>
      <div
        className={`sm:none fixed min-h-full w-[230px] transition-all duration-300 ease-in-out ${
          variant === 'auth' ? 'xl:hidden' : 'xl:block '
        }  ${open ? '' : '-translate-x-[115%]'} ${
          isSmallScreen ? 'z-index-responsive' : ''
        } ${getZIndex()}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Card extra={`h-screen w-full`}>
          <Scrollbars
            autoHide
            renderTrackVertical={renderTrack}
            renderThumbVertical={renderThumb}
            renderView={
              mini === false
                ? renderView
                : mini === true && hovered === true
                ? renderView
                : renderViewMini
            }
          >
            <div className="pb-[1%]">
              <div className="sticky top-0 z-[151] cursor-pointer rounded-2xl bg-white dark:!bg-darkGrayishBlue">
                <span
                  className="absolute right-4 top-4 block cursor-pointer xl:hidden"
                  onClick={onClose}
                >
                  <HiX />
                </span>
                <div className={`flex h-[74px] items-center `}>
                  <Link to="/" className="ml-4 flex items-center gap-2">
                    <img
                      src={require('../../assets/webp/logo.webp')}
                      alt="Voyra Logo"
                      className="h-9 w-9"
                    />
                    <span className="font-xs text-[24px] text-indigo dark:text-white">
                      Voyra Events
                    </span>
                  </Link>
                </div>
                <div className="mb-5 h-px bg-gray-200 dark:bg-white/10" />
              </div>

              {/* Nav items */}
              <ul className="px-4 py-2">
                <Links
                  mini={mini}
                  hovered={hovered}
                  routes={routes}
                  isExpand={isExpand}
                />
              </ul>
            </div>
          </Scrollbars>
        </Card>
      </div>
    </>
  )
}

export default Sidebar

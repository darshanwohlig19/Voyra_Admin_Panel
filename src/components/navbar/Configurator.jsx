// Chakra Imports
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
} from '@chakra-ui/modal'
import { useDisclosure } from '@chakra-ui/hooks'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import dmsConstants from 'common/config/PocketStudioConstants.js'
// Assets
import { IoSunny, IoMoon } from 'react-icons/io5'

import {
  MdSettings,
  MdFullscreen,
  MdOutlineFullscreenExit,
  // MdRefresh,
} from 'react-icons/md'
import ConfiguratorRadio from './ConfiguratorRadio'
const { DMS } = dmsConstants

/**
 * Renders the HeaderLinks component.
 *
 * @param {Object} props - The props object containing component properties.
 * @return {JSX.Element} The rendered HeaderLinks component.
 */
export default function HeaderLinks(props) {
  //eslint-disable-next-line
  const { darkmode, setDarkmode } = useTheme()
  //eslint-disable-next-line
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })
  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.body.classList.add('dark')
      setDarkmode(true)
      localStorage.setItem('darkMode', 'true')
    } else {
      document.body.classList.remove('dark')
      setDarkmode(false)
      localStorage.setItem('darkMode', 'false')
    }
  }
  // Watch for fullscreenchange
  useEffect(() => {
    /**
     * onFullscreenChange function is responsible for updating the state based on the fullscreen status.
     *
     */
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)

    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])
  return (
    <>
      <button onClick={toggleDarkMode} className="p-2">
        {isDarkMode ? (
          <IoSunny className="text-gray-400 dark:text-white" />
        ) : (
          <IoMoon className="text-gray-400 dark:text-white" />
        )}
      </button>

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === 'rtl' ? 'left' : 'right'}
      >
        <DrawerContent className="my-4 ml-0 mr-4 w-[calc(100vw_-_32px)] max-w-[calc(100vw_-_32px)] rounded-2xl bg-white shadow-[-20px_17px_40px_4px_rgba(112,_144,_176,_0.18)] dark:bg-navy-800 dark:shadow-[-22px_32px_51px_4px_#0B1437] sm:ml-4 md:w-[400px] md:max-w-[400px]">
          <DrawerHeader
            px="28px"
            w={{ base: '100%', md: '400px' }}
            pt="24px"
            pb="0px"
          >
            <DrawerCloseButton className="absolute right-[26px] top-[16px] h-4 w-4 text-gray-900 dark:text-white" />
            <div className="flex items-center">
              <p className="text-xxl font-poppins items-center text-[30px] font-bold font-medium capitalize  text-blueSecondary dark:text-white">
                {/* {DMS.DMS_HEADER} */}
              </p>
            </div>
            <div className="my-[30px] h-px w-full bg-gray-200 dark:!bg-navy-700" />
          </DrawerHeader>
          <DrawerBody
            // overflowY="scroll"
            px="28px"
            pt="0px"
            pb="24px"
            w={{ base: '100%', md: '400px' }}
            maxW="unset"
          >
            <div className="flex flex-col">
              <p className="mb-3 font-bold text-gray-900 dark:text-white">
                Color Mode
              </p>
              <div className="flex w-full justify-between gap-5">
                <ConfiguratorRadio
                  onClick={() => {
                    if (localStorage?.darkMode === 'true') {
                      document.body.classList.remove('dark')
                      setDarkmode(false)
                      localStorage.darkMode = false
                    }
                  }}
                  active={
                    document.body.classList.contains('dark') ? false : true
                  }
                  label={
                    <p className="font-bold text-gray-900 dark:text-white">
                      Light
                    </p>
                  }
                >
                  {/* <img
                    className="max-w-[130px] rounded-lg"
                    alt=""
                    src={Light}
                  /> */}
                </ConfiguratorRadio>
                <ConfiguratorRadio
                  onClick={() => {
                    if (localStorage?.darkMode === 'false') {
                      document.body.classList.add('dark')
                      setDarkmode(true)
                      localStorage.darkMode = true
                    }
                  }}
                  active={
                    !document.body.classList.contains('dark') ? false : true
                  }
                  label={
                    <p className="font-bold text-gray-900 dark:text-white">
                      Dark
                    </p>
                  }
                >
                  {/* <img className="max-w-[130px] rounded-lg" alt="" src={Dark} /> */}
                </ConfiguratorRadio>
              </div>
            </div>
            <div className="my-[30px] h-px w-full bg-gray-200 dark:!bg-navy-700" />
            <button
              className="text-md flex h-max w-full items-center justify-center rounded-2xl border-[1px] border-gray-200 bg-[rgba(11,11,11,0)] py-4 font-bold text-gray-900 hover:bg-white hover:shadow-[0px_18px_40px_rgba(112,_144,_176,_0.22)] focus:bg-white focus:shadow-[0px_18px_40px_rgba(112,_144,_176,_0.22)] active:bg-[#F7F9FF] active:shadow-[0px_18px_40px_rgba(112,_144,_176,_0.22)] dark:border-white/20 dark:text-white hover:dark:bg-navy-700 hover:dark:shadow-none focus:dark:bg-navy-700 focus:dark:shadow-none active:dark:bg-white/10 active:dark:shadow-none"
              onClick={() => {
                isFullscreen
                  ? document.exitFullscreen()
                  : document.body.requestFullscreen()
              }}
            >
              {isFullscreen ? 'Exit fullscreen' : 'Fullscreen mode'}
              {isFullscreen ? (
                <MdOutlineFullscreenExit className="ml-1.5 h-[18px] w-[18px] text-gray-900 dark:text-white" />
              ) : (
                <MdFullscreen className="ml-1.5 h-[18px] w-[18px] text-gray-900 dark:text-white" />
              )}
            </button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

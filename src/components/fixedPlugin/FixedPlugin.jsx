import React from 'react'

import { RiMoonFill, RiSunFill } from 'react-icons/ri'
/**
 * Renders a fixed plugin button that toggles the dark mode of the application.
 *
 * @param {Object} props - Additional props to be spread onto the button element.
 * @return {JSX.Element} The rendered fixed plugin button.
 */
export default function FixedPlugin(props) {
  const { ...rest } = props
  const [darkmode, setDarkmode] = React.useState(
    document.body.classList.contains('dark')
  )

  return (
    <button
      className="border-px fixed bottom-[30px] right-[35px] !z-[99] flex h-[60px] w-[60px] items-center justify-center rounded-full border-[#6a53ff] bg-gradient-to-br from-brandLinear to-blueSecondary p-0"
      onClick={() => {
        if (darkmode) {
          setDarkmode(false)
          localStorage.darkMode = false
        } else {
          setDarkmode(true)
          localStorage.darkMode = true
        }
      }}
      {...rest}
    >
      {/* // left={document.documentElement.dir === "rtl" ? "35px" : ""}
      // right={document.documentElement.dir === "rtl" ? "" : "35px"} */}
      <div className="cursor-pointer text-gray-600">
        {darkmode ? (
          <RiSunFill className="h-4 w-4 text-white" />
        ) : (
          <RiMoonFill className="h-4 w-4 text-white" />
        )}
      </div>
    </button>
  )
}

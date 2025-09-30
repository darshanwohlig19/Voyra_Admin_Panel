import React from 'react'

/**
 * Alert if clicked on outside of element
 *
 * @param {object} ref - reference to the element
 * @param {function} setX - function to set the value of X
 * @return {undefined}
 */

/**
 * A hook that alerts if clicked outside of a specified element.
 *
 * @param {object} ref - reference to the element
 * @param {function} setX - function to set the value of X
 * @return {undefined}
 */
function useOutsideAlerter(ref, setX) {
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setX(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, setX])
}

/**
 * Creates a dropdown component with a button and a list of options.
 *
 * @param {object} props - An object containing button, children, classNames, and animation.
 * @return {JSX.Element} A div element representing the dropdown component.
 */

/**
 * Creates a dropdown component with a button and a list of options.
 *
 * @param {Object} props - An object containing button, children, classNames, and animation.
 * @return {JSX.Element} A div element representing the dropdown component.
 */
const Dropdown = (props) => {
  const { button, children, classNames, animation } = props
  const wrapperRef = React.useRef(null)
  const [openWrapper, setOpenWrapper] = React.useState(false)
  useOutsideAlerter(wrapperRef, setOpenWrapper)

  return (
    <div ref={wrapperRef} className="relative flex">
      <div className="flex" onMouseDown={() => setOpenWrapper(!openWrapper)}>
        {button}
      </div>
      <div
        className={`${classNames} absolute z-10 ${
          animation
            ? animation
            : 'origin-top-right transition-all duration-300 ease-in-out'
        } ${openWrapper ? 'scale-100' : 'scale-0'}`}
      >
        {children}
      </div>
    </div>
  )
}

export default Dropdown

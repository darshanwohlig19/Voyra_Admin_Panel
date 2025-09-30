import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls the window to the top whenever the pathname changes.
 *
 * @return {null} This function does not return anything.
 */
function ScrollToTopOnPageChange() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTopOnPageChange

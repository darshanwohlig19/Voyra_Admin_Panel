import { Routes, Route, useLocation } from 'react-router-dom'
import SignInLayout from 'layouts/signIn'
import 'assets/css/Plugins.css'
import { useState, useEffect } from 'react'
import ScrollToTop from 'common/ScrollToTop'
import SignInGuard from 'common/guard/signInGuard'
import AuthGuard from 'common/guard/authGuard'
import AfterLoginLayout from 'layouts/afterLogin'
import { useTheme } from './contexts/ThemeContext'
import RoutesComponent from './routes'
import { useSpinner } from 'common/SpinnerLoader'
import { useToaster } from 'common/Toaster'
import dmsConstants from 'common/config/AppConstants'
import NotFound from 'views/others/404'

const App = () => {
  const routes = RoutesComponent()
  const { themeApp } = useTheme()
  const [mini, setMini] = useState(false)
  const location = useLocation()
  const { addToast } = useToaster()
  const { TOAST } = dmsConstants
  const { showSpinner, hideSpinner } = useSpinner()

  useEffect(() => {
    const fetchData = async () => {
      try {
        showSpinner()
        if (location.pathname !== '/' && !location.pathname !== '/sign-in') {
        }
      } catch (error) {
        addToast({
          title: TOAST.MESSAGES.ERROR.swwError,
          type: 'error',
        })
      } finally {
        hideSpinner()
      }
    }
    fetchData()
  }, [location, addToast])

  useEffect(() => {
    let color
    for (color in themeApp) {
      document.documentElement.style.setProperty(color, themeApp[color])
    }
  }, [themeApp])

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <AuthGuard>
              <AfterLoginLayout
                setMini={setMini}
                mini={mini}
                theme={themeApp}
              />
            </AuthGuard>
          }
        >
          {routes &&
            routes.map((route, index) => {
              if (route.collapse) {
                return route.items.map((nestedRoute, nestedIndex) => {
                  return (
                    <Route
                      key={nestedIndex}
                      path={nestedRoute.path}
                      element={nestedRoute.component}
                    />
                  )
                })
              } else {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.component}
                  />
                )
              }
            })}
        </Route>
        <Route
          path="sign-in/"
          element={
            <SignInGuard from="sign-in">
              <SignInLayout />
            </SignInGuard>
          }
        />
        <Route
          path="sign-up/"
          element={
            <SignInGuard from="sign-up">
              <SignInLayout />
            </SignInGuard>
          }
        />
        {/* 404 Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App

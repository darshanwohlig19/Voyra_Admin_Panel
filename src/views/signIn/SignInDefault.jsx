// import loginImg from 'assets/img/layers/sachai-layers.webp'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useToaster } from 'common/Toaster'
import dmsConstants from 'common/config/PocketStudioConstants.js'
import { useSpinner } from 'common/SpinnerLoader'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import { setEncryptedCookie } from 'common/utils/cookieUtils'
import SignIn from './signIn'
import SignUp from './signUp'
import InputField from 'components/fields/InputField'
import { useEffect, useState, useCallback } from 'react'
import { FcGoogle } from 'react-icons/fc'
import Checkbox from 'components/checkbox'
import bgLoginImage from '../../assets/svg/dmslogin.svg'
import loginBgIcon from '../../assets/svg/login.svg'
import Capa from '../../assets/img/layers/Capa.webp'
import Logo from '../../assets/webp/logo.webp'
// import LogoIcon from '../../assets/svg/Line1.svg'
// import demo from '../../assets/svg/demo.jpg'
const { TOAST, SIGNIN } = dmsConstants
const apiService = ApiCaller()

function SignInDefault() {
  const [myCode, setMyCode] = useState('')
  const [ignore, setIgnore] = useState(false)
  const { addToast } = useToaster()
  const { showSpinner, hideSpinner } = useSpinner()
  let navigate = useNavigate()
  const location = useLocation()
  const isSignInRoute = location.pathname === '/sign-in'
  const isSignUpRoute = location.pathname === '/sign-up'

  const handleSignIn = async (email, password) => {
    try {
      const payload = { email: email, password: password }
      showSpinner()
      const apiUrl = apiConfig.SIGNIN_API
      const response = await apiService.apiCall('post', apiUrl, payload)

      // Only navigate if we have a successful response with valid token and user data
      if (
        response?.status === 200 &&
        response?.data?.data?.token &&
        response?.data?.data?.user
      ) {
        // Store only encrypted user data (token is handled by backend cookie)
        setEncryptedCookie('bearerToken', response.data.data.token, 7)
        setEncryptedCookie('userData', response.data.data.user, 7)
        setEncryptedCookie(
          'userRole',
          response.data.data.user.organizations[0]?.role,
          7
        )

        // Store userName in localStorage
        const userName =
          response.data.data.user.name ||
          response.data.data.user.username ||
          response.data.data.user.firstName ||
          response.data.data.user.email?.split('@')[0] ||
          'User'
        localStorage.setItem('userName', userName)

        addToast({
          title: TOAST.MESSAGES.SUCCESS.signInSuccess,
          type: 'success',
        })

        // Navigate only after successful authentication
        navigate('/organizations')
        return true
      } else {
        addToast({
          title: TOAST.MESSAGES.ERROR.invalidCredentials,
          type: 'error',
        })
        return false
      }
    } catch (error) {
      console.error(error)
      addToast({
        title: TOAST.MESSAGES.ERROR.invalidCredentials,
        type: 'error',
      })
      return false
    } finally {
      hideSpinner()
    }
  }

  const handleSignUp = async (email, password) => {
    try {
      const payload = { email: email, password: password, role: 'admin' }
      showSpinner()
      const apiUrl = apiConfig.SIGNUP_API
      const response = await apiService.apiCall('post', apiUrl, payload)
      if (response?.status === 201) {
        navigate('/sign-in')
        addToast({
          title: TOAST.MESSAGES.SUCCESS.signUp,
          type: 'success',
        })
      } else {
        addToast({
          title:
            response?.data?.error || TOAST.MESSAGES.ERROR.invalidCredentials,
          type: 'error',
        })
      }
    } catch (error) {
      console.error(error)
      addToast({
        title:
          error?.response?.data?.error ||
          TOAST.MESSAGES.ERROR.invalidCredentials,
        type: 'error',
      })
    } finally {
      hideSpinner()
    }
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden md:flex-row">
      <div className="flex h-full w-full flex-col bg-white p-8 md:w-1/2">
        {/* Logo Header */}
        {/* <div className="mb-8 flex items-center justify-center">
          <Link to="/" className="group relative flex items-center">
            <span className="from-indigo-500/10 absolute inset-0 scale-0 rounded-lg bg-gradient-to-r to-purple-500/10 transition-transform duration-300 group-hover:scale-100" />
            <img
              src={LogoIcon}
              alt="Logo"
              className="relative z-10 cursor-pointer object-contain transition-all duration-300 group-hover:brightness-110"
              style={{ width: '46px', height: '46px' }}
              loading="eager"
            />
        
          </Link>
        </div> */}

        {/* Form Container */}
        <div className="flex flex-1 items-center justify-center">
          {isSignInRoute ? (
            <SignIn onSignIn={handleSignIn} />
          ) : (
            <SignUp onSignUp={handleSignUp} />
          )}
        </div>
      </div>
      {/* Left Section (Background & Branding) */}
      <div className="hidden flex-1 items-center justify-center p-6 lg:flex">
        <div
          className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl
 object-cover"
        >
          <img src={Logo} alt="Modern interior design" fill />
        </div>
      </div>
    </div>
  )
}

export default SignInDefault

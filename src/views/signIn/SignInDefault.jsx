// import loginImg from 'assets/img/layers/sachai-layers.webp'
import { useNavigate, useLocation } from 'react-router-dom'
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
import Line1 from '../../assets/img/others/login.webp'
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
      if (response?.status === 200 && response?.data?.data?.token) {
        // Store only encrypted user data (token is handled by backend cookie)
        setEncryptedCookie('userData', response.data.data.user, 7)
        setEncryptedCookie(
          'userRole',
          response.data.data.user.organizations[0]?.role,
          7
        )

        navigate('/')
        addToast({
          title: TOAST.MESSAGES.SUCCESS.signInSuccess,
          type: 'success',
        })
      } else {
        navigate('/')
        addToast({
          title: TOAST.MESSAGES.ERROR.invalidCredentials,
          type: 'error',
        })
      }
    } catch (error) {
      console.error(error)
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
    } finally {
      hideSpinner()
    }
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden md:flex-row">
      <div className="flex h-full w-full items-center justify-center bg-white p-8 md:w-1/2">
        {isSignInRoute ? <SignIn onSignIn={handleSignIn} /> : <SignUp />}
      </div>
      {/* Left Section (Background & Branding) */}
      <div className="hidden flex-1 items-center justify-center p-6 lg:flex">
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
          <img src={Line1} alt="Modern interior design" fill />
        </div>
      </div>
    </div>
  )
}

export default SignInDefault

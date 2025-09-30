// import loginImg from 'assets/img/layers/sachai-layers.webp'
import { useNavigate, useLocation } from 'react-router-dom'
import { useToaster } from 'common/Toaster'
import dmsConstants from 'common/config/PocketStudioConstants.js'
import { useSpinner } from 'common/SpinnerLoader'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import SignIn from './signIn'
import SignUp from './signUp'
import InputField from 'components/fields/InputField'
import { useEffect, useState, useCallback } from 'react'
import { FcGoogle } from 'react-icons/fc'
import Checkbox from 'components/checkbox'
import bgLoginImage from '../../assets/svg/dmslogin.svg'
import loginBgIcon from '../../assets/svg/login.svg'
import Capa from '../../assets/img/layers/Capa.webp'
import Line1 from '../../assets/svg/Line1.svg'
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

      const specificBearerToken =
        'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJFYV9Nd0JWQnJaNk9ZNkdqNVE5bmFxbGNZcG1YWFVFNjREUklyT3hlcWFNIn0.eyJleHAiOjE3NDAyMjg0ODksImlhdCI6MTc0MDE0MjA5MiwiYXV0aF90aW1lIjoxNzQwMTQyMDg5LCJqdGkiOiIzZTViYWFmMy1lYjY0LTQyNjEtYjQ1YS1hNDE1YjkyNGE0ZGEiLCJpc3MiOiJodHRwczovL3Nzby1kZXYuY29uZml4YS5jb20vcmVhbG1zL2NvbmZpeGEtZGV2IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6Ijk2NDZkNTY1LTY2N2MtNDkxMi1iNDY0LWI0M2EwMTAwOTNhOSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImZyb250ZW5kIiwic2Vzc2lvbl9zdGF0ZSI6IjVjZGM4YzcxLTg4MzQtNDYwMy1iYzEwLWZjNGRiOWIzYTkzMiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9mcm9udGVuZC5jb25maXhhLmNvbSJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtY29uZml4YS1kZXYiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwic2lkIjoiNWNkYzhjNzEtODgzNC00NjAzLWJjMTAtZmM0ZGI5YjNhOTMyIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJQcmF0aWsgU2F3YW50IiwicHJlZmVycmVkX3VzZXJuYW1lIjoicHJhdGlrLnNhd2FudEB3b2hsaWcuY29tIiwiZ2l2ZW5fbmFtZSI6IlByYXRpayIsImZhbWlseV9uYW1lIjoiU2F3YW50IiwiZW1haWwiOiJwcmF0aWsuc2F3YW50QHdvaGxpZy5jb20ifQ.Zt-utzouzHKTp1Ezw7S-L8gxnJBWXuGdo_ChO3oMAKJU_MLVh4KgB7tWfNKjuvKbutCZILRxN8yQ_vlQxnuIWDO2R8bl4jdIodrE9zckTh5nMd9yDf48BeTq3-ZWt6orJ8iwWz55mTN9hOQtuiTkwu4iDmcwz2R1vEh0R2KWsjfWMLn9368Qhei4Vj0ChvLOWPhNQknUCbVNClzv2kmwDLv7VajpAelY8b5sB5dvMt8czFE6gueBulB6Ze4TlFa6Va6hotEe2yzp7Bpzr8xLKCUUoerxlgFihpGd77awx04FX7nLezCQUjtJbO7Vabp5JBCVuP-18_T2e2SY3e7R1A'
      localStorage.setItem('bearerToken', specificBearerToken)

      if (response?.status === 200 && response?.data?.token) {
        localStorage.setItem('userData', response?.data?.email)
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
  // const handleSignIn = async (email, password) => {
  //   try {
  //     const formData = new FormData()
  //     formData.append('email', email)
  //     formData.append('password', password)
  //     showSpinner()
  //     const apiUrl = apiConfig.SIGNIN_API
  //     const response = await apiService.apiCall('post', apiUrl, formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     })
  //     if (response?.status === 200) {
  //       localStorage.setItem('userName', response?.data?.email)
  //       localStorage.setItem('userType', response?.data?.user_type)
  //       localStorage.setItem('role', response?.data?.roles[0])
  //       localStorage.setItem('darkMode', JSON.stringify(false))
  //       addToast({
  //         title: TOAST.MESSAGES.SUCCESS.signInSuccess,
  //         type: 'success',
  //       })
  //       navigate('/departments')
  //     } else {
  //       addToast({
  //         title: TOAST.MESSAGES.ERROR.invalidCredentials,
  //         type: 'error',
  //       })
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     // Hide the spinner once the API call is complete
  //     hideSpinner()
  //   }
  // }

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
      {/* Left Section (Background & Branding) */}
      <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-b from-[#4880FF] to-[#194DC2] bg-cover bg-center p-6 md:w-1/2">
        {/* Overlay Image */}
        <img
          src={Line1}
          alt="Overlay"
          className="absolute bottom-8 w-full object-contain pb-0 opacity-80 md:pb-10"
          style={{ transform: 'scale(1.4)', transformOrigin: 'center' }}
        />

        {/* Branding Text */}
        <div className="z-10 px-6 text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">PocketStudio.ai</h1>
          
          <p className="mt-2 max-w-xs text-sm text-white/90 md:text-base">
            Lorem Ipsum has been the industry&apos;s standard dummy text ever
            since the 1500s.
          </p>
        </div>
      </div>

      {/* Right Section (Sign In / Sign Up Forms) */}
      <div className="flex h-full w-full items-center justify-center bg-white p-8 md:w-1/2">
        {isSignInRoute ? <SignIn onSignIn={handleSignIn} /> : <SignUp />}
      </div>
    </div>
  )
}

export default SignInDefault

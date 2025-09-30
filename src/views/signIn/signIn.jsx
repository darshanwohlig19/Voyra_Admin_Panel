import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useToaster } from 'common/Toaster'
import dmsConstants from 'common/config/PocketStudioConstants.js'
import InputField from 'components/fields/InputField'
import { useState } from 'react'
import { FaRegEye, FaEyeSlash } from 'react-icons/fa'
const { VALIDATION } = dmsConstants

function SignInPage({ onSignIn }) {
  const [showPassword, setShowPassword] = useState(false)
  const { addToast } = useToaster()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // const handleToken = (data) => {
  //   const { email, password } = data
  //   if (email && password) {
  //     onSignIn(email, password)
  //   } else {
  //     addToast({
  //       type: 'error',
  //       message: 'Please fill in all required fields.',
  //     })
  //   }
  // }
  const handleToken = (data) => {
    const { email, password } = data
    if (email && password) {
      onSignIn(email, password)
    } else {
      addToast({
        type: 'error',
        message: 'Please fill in all required fields.',
      })
    }
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const signUpRoute = () => {
    navigate('/sign-up')
  }

  return (
    <div className="h-screen w-[70%] items-center justify-center bg-white md:flex">
      <div className="w-full bg-white">
        <div className="mb-18 flex h-full w-full items-center justify-center px-2">
          <div className="mt-[10vh] w-full  flex-col items-center">
            <h3 className="mb-[10px]  text-4xl font-bold text-gray-900 dark:text-white">
              Sign In
            </h3>
            <p className="mb-6 ml-1 text-base text-darkGray">
              Enter your email and password to sign in!
            </p>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-full bg-gray-200 dark:!bg-navy-700" />
            </div>
            <form onSubmit={handleSubmit(handleToken)} className="w-full">
              <div>
                <InputField
                  extra="mb-3 w-full"
                  label="Email"
                  placeholder="Email Address"
                  id="email"
                  type="text"
                  registrationProps={register('email', {
                    required: 'Email is required.',
                    pattern: {
                      // value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address.',
                    },
                  })}
                />
                {errors.email && (
                  <div className="text-sm text-red-500">
                    {errors.email.message}
                  </div>
                )}
              </div>
              <div className="relative mb-3">
                <InputField
                  extra="w-full"
                  label="Password"
                  placeholder="Password"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  registrationProps={register('password', {
                    required: 'Password is required.',
                  })}
                />
                {errors.password && (
                  <div className="text-sm text-red-500">
                    {errors.password.message}
                  </div>
                )}
                <div className="absolute right-4 top-[70%] flex -translate-y-1/2 cursor-pointer items-center justify-center">
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="flex items-center justify-center"
                  >
                    {showPassword ? <FaRegEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 w-full rounded-xl bg-primary py-3 text-base font-medium text-white transition duration-200 hover:bg-primary active:bg-primary dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
              >
                Sign In
              </button>
              {/* <div className="mt-3 text-center">
                <span className="text-sm font-medium text-navy-700 dark:text-gray-500">
                  Not registered yet?
                </span>
                <span
                  onClick={signUpRoute}
                  className="ml-1 cursor-pointer text-sm font-medium text-primary hover:text-primary dark:text-white"
                >
                  Create an Account
                </span>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage

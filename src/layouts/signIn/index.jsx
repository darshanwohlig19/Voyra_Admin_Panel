import React from 'react'
import SignInDefault from 'views/signIn/SignInDefault.jsx'

/**
 * Renders the SignIn component.
 *
 * @return {JSX.Element} The rendered SignIn component.
 */
export default function SignIn() {
  return (
    <div>
      <div className="relative float-right h-full min-h-screen w-full dark:!bg-navy-900">
        <main className={`mx-auto min-h-screen`}>
          <SignInDefault />
        </main>
      </div>
    </div>
  )
}

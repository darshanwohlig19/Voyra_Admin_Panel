/*eslint-disable*/
import React from 'react'
/**
 * Renders the Footer component with links to Support, License, Terms of Use, and Blog.
 *
 * @return {JSX.Element} The Footer component JSX
 */
export default function Footer() {
  const simmmpleLicensesUrl = process.env.REACT_APP_SIMMMPLE_LICENSES
  const simmmpleTermsAndServiceUrl = process.env.REACT_APP_SIMMMPLE_TERMSSERVICE
  const horizonUIUrl = process.env.REACT_APP_HORIZON_UI
  return (
    <div className="z-[5] mx-auto flex w-full max-w-screen-sm flex-col items-center justify-between px-[20px] pb-4 lg:mb-6 lg:max-w-[100%] lg:flex-row xl:mb-2 xl:w-[1310px] xl:pb-6">
      <p className="mb-6 text-center text-sm text-gray-600 md:text-base lg:mb-0">
        ©{1900 + new Date().getYear()} CONFIXA UI. All Rights Reserved.
      </p>
      <ul className="flex flex-wrap items-center sm:flex-nowrap">
        <li className="mr-12">
          <a
            target="blank"
            href="mailto:hello@simmmple.com"
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base lg:text-white lg:hover:text-white"
          >
            Support
          </a>
        </li>
        <li className="mr-12">
          <a
            target="blank"
            href={`${simmmpleLicensesUrl}`}
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base lg:text-white lg:hover:text-white"
          >
            License
          </a>
        </li>
        <li className="mr-12">
          <a
            target="blank"
            href={`${simmmpleTermsAndServiceUrl}`}
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base lg:text-white lg:hover:text-white"
          >
            Terms of Use
          </a>
        </li>
        <li>
          <a
            target="blank"
            href={`${horizonUIUrl}`}
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base lg:text-white lg:hover:text-white"
          >
            Blog
          </a>
        </li>
      </ul>
    </div>
  )
}

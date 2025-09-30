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
    <div className="z-[1.5] mx-auto flex w-full max-w-[90%] flex-col items-center justify-between px-0 pb-8 pt-12 xl:w-[1170px] xl:max-w-[1170px] xl:flex-row">
      <p className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base">
        ©{1900 + new Date().getYear()} CONFIXA UI. All Rights Reserved.
      </p>
      <ul className="flex flex-wrap items-center sm:flex-nowrap">
        <li className="mr-12">
          <a
            target="blank"
            href="mailto:hello@simmmple.com"
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base"
          >
            Support
          </a>
        </li>
        <li className="mr-12">
          <a
            target="blank"
            href={`${simmmpleLicensesUrl}`}
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base"
          >
            License
          </a>
        </li>
        <li className="mr-12">
          <a
            target="blank"
            href={`${simmmpleTermsAndServiceUrl}`}
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base"
          >
            Terms of Use
          </a>
        </li>
        <li>
          <a
            target="blank"
            href={`${horizonUIUrl}`}
            className="text-sm text-gray-600 hover:text-gray-600 md:text-base"
          >
            Blog
          </a>
        </li>
      </ul>
    </div>
  )
}

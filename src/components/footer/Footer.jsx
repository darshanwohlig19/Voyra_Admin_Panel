import dmsConstants from 'common/config/PocketStudioConstants.js'

const { DMS } = dmsConstants

/**
 * Renders the footer component.
 *
 * @return {JSX.Element} The footer component JSX
 */
const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row ">
      <div className="mb-4 text-center text-sm font-medium text-gray-600 sm:!mb-0 md:text-lg">
        <p className="mb-4 text-center text-sm text-gray-600 hover:cursor-pointer hover:text-navy-700 sm:!mb-0 md:text-base">
          ©{1900 + new Date().getYear()} {DMS.DNS_HEADER}. All Rights Reserved.
        </p>
      </div>
      <div>
        <ul className="flex flex-wrap items-center gap-3 sm:flex-nowrap md:gap-10">
          <li>
            <a
              target="blank"
              href="/"
              className="text-base font-medium text-gray-600 hover:cursor-pointer  hover:text-navy-700"
            >
              Support
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="/"
              className="text-base font-medium text-gray-600 hover:cursor-pointer  hover:text-navy-700"
            >
              License
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="/"
              className="text-base font-medium text-gray-600 hover:cursor-pointer hover:text-navy-700"
            >
              Terms of Use
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Footer

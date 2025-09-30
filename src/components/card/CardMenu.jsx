import React from 'react'
import { IoMdEye } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { setRepoName } from 'common/commonFunction'
import TooltipHorizon from '../../components/tooltip'
import { useParams } from 'react-router-dom'

/**
 * Renders a CardMenu component.
 *
 * @param {Object} props - the properties for the CardMenu component
 * @return {JSX.Element} - a Dropdown component representing the CardMenu
 */
function CardMenu(cellValue) {
  const navigate = useNavigate()
  const { id } = useParams()

  return (
    <div className="">
      <div className="z-50 w-max rounded-xl bg-white py-1 text-sm  dark:!bg-navy-700 dark:shadow-none">
        {cellValue?.cellValue?.appType !== 'helm' && (
          <div className="flex cursor-pointer items-center rounded-full border p-1 font-bold  text-[#000] hover:font-medium hover:text-black dark:text-white">
            <span>
              <TooltipHorizon
                trigger={
                  <p>
                    <span>
                      <IoMdEye className="text-xl" />
                    </span>
                  </p>
                }
                content="View"
                placement="top"
              />
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default CardMenu

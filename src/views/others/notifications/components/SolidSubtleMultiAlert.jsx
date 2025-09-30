import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

function SolidSubtleMultiAlert(props) {
  const {
    icon,
    title,
    description,
    bg,
    justify,
    mb,
    closeBg,
    solid,
    iconColor,
    removeToast,
  } = props

  return (
    <div
      className={`flex justify-between ${mb} items-center py-[8px]  pl-[17px] pr-[6px] ${bg} rounded-lg`}
    >
      <div className={`flex h-full w-full gap-2  ${justify} `}>
        <p className={`text-2xl ${iconColor} `}> {icon} </p>
        <div>
          <h5
            className={` font-bold dark:text-navy-900 ${
              solid
                ? 'text-white dark:!text-navy-900'
                : 'text-navy-700 dark:!text-white'
            } `}
          >
            {title}
          </h5>
          {description && (
            <p
              className={`font-base pr-[5px] ${
                solid
                  ? 'text-white dark:!text-navy-900'
                  : 'text-navy-700 dark:!text-white'
              } `}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      <div
        className={` flex h-9 w-9 cursor-pointer items-center ${closeBg} justify-center rounded-md text-xl font-bold`}
        onClick={removeToast}
      >
        <AiOutlineClose />
      </div>
    </div>
  )
}

export default SolidSubtleMultiAlert

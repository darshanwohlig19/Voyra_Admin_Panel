'use client'
import { HiPlus } from 'react-icons/hi'

export default function AddFolderButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="!ml-auto flex items-center rounded-[10px] bg-shadeBlue px-5 py-2 text-sm font-medium text-white transition duration-200 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90 sm:px-3 sm:text-xs md:text-base lg:px-5 lg:text-base "
    >
      <span className="mr-2 text-xl">
        <HiPlus />
      </span>
      {label}
    </button>
  )
}

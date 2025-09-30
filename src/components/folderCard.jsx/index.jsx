import React from 'react'
import DepartmentImage from '../../../src/assets/webp/folder.webp'

const FolderCard = ({ name, image, onClick }) => {
  const handleClick = () => {
    console.log('FolderCard Clicked:', name) // Debug log
    onClick()
  }

  return (
    <div
      className="group flex cursor-pointer items-center rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md"
      onClick={handleClick}
    >
      <div className="rounded-lg transition-colors group-hover:text-blue-600">
        <img src={image || DepartmentImage} alt={`${name} Icon`} />
      </div>
      <h3 className="ml-2.5 text-base font-bold text-blueGray">{name}</h3>
    </div>
  )
}

export default FolderCard

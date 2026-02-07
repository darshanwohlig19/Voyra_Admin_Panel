import React from 'react'
import { Upload } from 'lucide-react'

const DropZone = ({
  imagePreview,
  onImageChange,
  onRemoveImage,
  label,
  placeholder = 'Click to upload image',
  hint = 'PNG, JPG, WEBP up to 10MB',
  accept = 'image/*',
  height = 'h-56',
  error,
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onImageChange(file)
    }
  }

  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      {!imagePreview ? (
        <label
          className={`flex ${height} cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
            error ? 'border-red-500' : 'border-gray-300 dark:border-navy-600'
          } hover:bg-gray-50 dark:hover:bg-navy-700`}
        >
          <Upload className="mb-2 h-10 w-10 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {placeholder}
          </span>
          <span className="mt-1 text-xs text-gray-400">{hint}</span>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className={`${height} w-full rounded-lg object-cover`}
          />
          <label className="absolute bottom-2 right-2 cursor-pointer rounded-lg bg-[#ebd6ac] px-3 py-1 text-sm text-black hover:bg-[#EDCF93]">
            Change
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default DropZone

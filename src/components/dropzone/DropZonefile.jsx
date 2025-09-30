import React from 'react'
import { useDropzone } from 'react-dropzone'

const DropZonefile = ({
  content,
  onDrop,
  selectedFile,
  registrationProps,
  removeFile,
  accept,
  errors,
  multiple,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept,
    onDrop,
    errors: errors,
    multiple,
  })

  return (
    <div
      className="flex h-full w-full cursor-pointer items-center justify-center rounded-xl border-dashed border-navy-700"
      {...getRootProps({ className: 'dropzone' })}
    >
      <input {...getInputProps()} {...registrationProps} />
      <div className="h-full !w-full">{content}</div>
      {selectedFile && selectedFile.length > 0 && (
        <div className="mt-2">
          <img
            src={URL.createObjectURL(selectedFile[0])}
            alt="Preview"
            className="h-auto w-full rounded-md"
          />
          <button onClick={removeFile} className="mt-2 text-red-500">
            Remove
          </button>
        </div>
      )}
    </div>
  )
}

export default DropZonefile

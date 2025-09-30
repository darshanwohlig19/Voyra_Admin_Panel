import React from 'react'
import PropTypes from 'prop-types'
import DropZonefile from './DropZonefile'
import { MdOutlineCloudUpload, MdClose } from 'react-icons/md'
import Card from 'components/card'

const DropZone = ({
  message,
  onDrop,
  selectedFile,
  removeFile,
  registrationProps,
  errors,
  accept,
  multiple,
}) => {
  return (
    <div className="mt-2 w-full items-center justify-center rounded-[20px]">
      {selectedFile?.length > 0 ? (
        <Card extra={'h-full py-[25px] px-[38px] rounded-xl'}>
          <div className="flex w-full items-center justify-between text-primary dark:text-brand-400">
            <p className="text-md ">{selectedFile[0].name}</p>
            <button onClick={removeFile}>
              <MdClose className="text-xl" />
            </button>
          </div>
        </Card>
      ) : (
        <DropZonefile
          content={
            <div
              className={`flex  h-[77px]  w-full items-center justify-center gap-10 rounded-xl !border border-dashed border-gray-200 bg-gray-100 px-[28px] dark:!border-antiFlashWhite dark:!bg-navy-700`}
            >
              <p className={` text-[30px] text-navy-700 dark:text-white`}>
                <MdOutlineCloudUpload className="text-primary" />
              </p>
              <div
                className={` text-sm font-medium text-navy-700 dark:text-white`}
              >
                {message}
                <div className="pl-2 font-medium text-primary dark:text-brand-400">
                  Click to browse
                </div>
              </div>
            </div>
          }
          onDrop={onDrop}
          selectedFile={selectedFile}
          removeFile={removeFile}
          registrationProps={registrationProps}
          accept={accept}
          errors={errors}
          multiple={multiple}
        />
      )}
    </div>
  )
}
DropZone.propTypes = {
  message: PropTypes.string.isRequired,
  onDrop: PropTypes.func.isRequired,
  selectedFile: PropTypes.array,
  removeFile: PropTypes.func,
  registrationProps: PropTypes.object,
  accept: PropTypes.object,
  errors: PropTypes.object,
}
export default DropZone

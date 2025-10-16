import React, { useState } from 'react'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useToaster } from '../../common/Toaster'

const FileUploadInput = ({
  imageKey,
  label,
  file,
  onFileChange,
  onFileRemove,
}) => {
  const inputRef = React.useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      console.log('File selected:', selectedFile.name, 'for key:', imageKey)
      onFileChange(imageKey, selectedFile)
    }
  }

  const handleRemove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Removing file for key:', imageKey)
    onFileRemove(imageKey)
    // Reset the input value
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="block w-full cursor-pointer rounded-lg
            border-2 border-dashed border-gray-300
            bg-gray-50 px-4
            py-3 text-sm
            text-gray-700 transition-all duration-200
            file:mr-2
            file:cursor-pointer
            file:rounded-lg file:border-0
            file:bg-gradient-to-r file:from-[#5B58EB]
            file:to-[#7C79F5]
            file:px-3
            file:py-2
            file:text-xs file:font-semibold file:text-white
            file:transition-all
            file:duration-200
            hover:file:from-[#4A47D1] hover:file:to-[#6B68E4]
            hover:file:shadow-md focus:border-purple-500
            focus:outline-none focus:ring-2 focus:ring-purple-200 active:file:scale-95"
        />
        {file && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-red-500 p-2 text-white shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-lg active:scale-95"
            title="Remove file"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

const Parameters = () => {
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()

  // File upload state organized by category
  const [uploadedFiles, setUploadedFiles] = useState({})

  const handleFileUpload = (imageKey, file) => {
    console.log('handleFileUpload called:', imageKey, file.name)
    setUploadedFiles((prev) => {
      const updated = {
        ...prev,
        [imageKey]: file,
      }
      console.log('Updated files state:', updated)
      return updated
    })
  }

  const removeFile = (imageKey) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev }
      delete newFiles[imageKey]
      return newFiles
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    showSpinner()
    try {
      // Build sections based on the API structure
      const sections = [
        {
          categoryTitle: 'Part of Model to Feature',
          type: 'nameCard',
          elements: [
            { name: 'Neck & Décolletage', imageKey: 'neckDecolletage' },
            { name: 'Ears & Jawline', imageKey: 'earsJawline' },
            { name: 'Portrait View', imageKey: 'portraitView' },
            { name: 'Hands & Wrists', imageKey: 'handsWrists' },
            { name: 'Ankles & Feet', imageKey: 'anklesFeet' },
            { name: 'Upper Arms', imageKey: 'upperArms' },
          ],
        },
        {
          categoryTitle: 'Age / Appearance',
          type: 'Button',
          elements: [
            { name: '40-50', imageKey: 'age40_50' },
            { name: '50+', imageKey: 'age50Plus' },
          ],
        },
        {
          categoryTitle: 'Ethnicity / Region',
          type: 'nameCard',
          elements: [
            { name: 'North Indian', imageKey: 'northIndian' },
            { name: 'South Indian', imageKey: 'southIndian' },
            { name: 'Northeast Indian', imageKey: 'northeastIndian' },
            { name: 'West Indian', imageKey: 'westIndian' },
            { name: 'European', imageKey: 'european' },
            { name: 'Hispanic / Latino', imageKey: 'hispanicLatino' },
            { name: 'East Asian', imageKey: 'eastAsian' },
            { name: 'Sub-Saharan African', imageKey: 'subSaharanAfrican' },
            { name: 'Middle Eastern', imageKey: 'middleEastern' },
          ],
        },
        {
          categoryTitle: 'Environment',
          type: 'nameCard',
          elements: [
            {
              name: 'Royal Palace / Haveli Interior',
              imageKey: 'royalPalaceInterior',
            },
            {
              name: 'Mandap / Wedding Ceremony',
              imageKey: 'mandapWeddingCeremony',
            },
            { name: 'Lush Temple Courtyard', imageKey: 'lushTempleCourtyard' },
            { name: 'Minimalist Studio', imageKey: 'minimalistStudio' },
            { name: 'Luxury Interior', imageKey: 'luxuryInterior' },
            { name: 'Natural & Organic', imageKey: 'naturalOrganic' },
          ],
        },
      ]

      const metadata = {
        typeId: '68da1d9c11dc47b9aa8113eb',
        type: 'On-Model',
        title: 'Customize Your On-Model Experience',
        sections: sections,
      }

      const submitData = new FormData()
      submitData.append('metadata', JSON.stringify(metadata))

      // Append all uploaded files
      Object.entries(uploadedFiles).forEach(([key, file]) => {
        submitData.append(key, file)
      })

      const response = await apiCall(
        'post',
        config.ADD_PARAMETERS,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Parameters added successfully!',
          duration: 3000,
        })
        // Reset form
        setUploadedFiles({})
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: 'Failed to add parameters. Please try again.',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'An error occurred. Please try again.',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  return (
    <div className="mt-5 h-full w-full px-4">
      <div className="flex h-full w-full flex-col gap-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Part of Model to Feature */}
          <div className="rounded-[20px] border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              Part of Model to Feature
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FileUploadInput
                imageKey="neckDecolletage"
                label="Neck & Décolletage"
                file={uploadedFiles.neckDecolletage}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="earsJawline"
                label="Ears & Jawline"
                file={uploadedFiles.earsJawline}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="portraitView"
                label="Portrait View"
                file={uploadedFiles.portraitView}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="handsWrists"
                label="Hands & Wrists"
                file={uploadedFiles.handsWrists}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="anklesFeet"
                label="Ankles & Feet"
                file={uploadedFiles.anklesFeet}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="upperArms"
                label="Upper Arms"
                file={uploadedFiles.upperArms}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
            </div>
          </div>

          {/* Age / Appearance */}
          <div className="rounded-[20px] border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              Age / Appearance
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FileUploadInput
                imageKey="age40_50"
                label="40-50"
                file={uploadedFiles.age40_50}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="age50Plus"
                label="50+"
                file={uploadedFiles.age50Plus}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
            </div>
          </div>

          {/* Ethnicity / Region */}
          <div className="rounded-[20px] border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              Ethnicity / Region
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FileUploadInput
                imageKey="northIndian"
                label="North Indian"
                file={uploadedFiles.northIndian}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="southIndian"
                label="South Indian"
                file={uploadedFiles.southIndian}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="northeastIndian"
                label="Northeast Indian"
                file={uploadedFiles.northeastIndian}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="westIndian"
                label="West Indian"
                file={uploadedFiles.westIndian}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="european"
                label="European"
                file={uploadedFiles.european}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="hispanicLatino"
                label="Hispanic / Latino"
                file={uploadedFiles.hispanicLatino}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="eastAsian"
                label="East Asian"
                file={uploadedFiles.eastAsian}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="subSaharanAfrican"
                label="Sub-Saharan African"
                file={uploadedFiles.subSaharanAfrican}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="middleEastern"
                label="Middle Eastern"
                file={uploadedFiles.middleEastern}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
            </div>
          </div>

          {/* Environment */}
          <div className="rounded-[20px] border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              Environment
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FileUploadInput
                imageKey="royalPalaceInterior"
                label="Royal Palace / Haveli Interior"
                file={uploadedFiles.royalPalaceInterior}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="mandapWeddingCeremony"
                label="Mandap / Wedding Ceremony"
                file={uploadedFiles.mandapWeddingCeremony}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="lushTempleCourtyard"
                label="Lush Temple Courtyard"
                file={uploadedFiles.lushTempleCourtyard}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="minimalistStudio"
                label="Minimalist Studio"
                file={uploadedFiles.minimalistStudio}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="luxuryInterior"
                label="Luxury Interior"
                file={uploadedFiles.luxuryInterior}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
              <FileUploadInput
                imageKey="naturalOrganic"
                label="Natural & Organic"
                file={uploadedFiles.naturalOrganic}
                onFileChange={handleFileUpload}
                onFileRemove={removeFile}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="h-12 rounded-lg bg-[#5B58EB] px-8 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#4A47D1] active:bg-[#3936B7]"
            >
              Submit Parameters
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Parameters

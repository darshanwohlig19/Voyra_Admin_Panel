import React, { useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { useToaster } from '../../common/Toaster'
import AddElementModal from './AddElementModal'
import ParameterElementCard from './ParameterElementCard'
import ConfirmationModal from '../modal/ConfirmationModal'

const ParameterSection = ({
  section,
  onElementAdded,
  onElementUpdated,
  onElementDeleted,
  onSectionDeleted,
}) => {
  const [isAddElementModalOpen, setIsAddElementModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleteSectionModalOpen, setIsDeleteSectionModalOpen] =
    useState(false)
  const [selectedElement, setSelectedElement] = useState(null)
  const { addToast } = useToaster()

  const handleAddElement = () => {
    setIsAddElementModalOpen(true)
  }

  const handleSubmitElement = (formData) => {
    // Create image URL from the uploaded file for display
    const imageUrl = formData.image ? URL.createObjectURL(formData.image) : null

    // Create new element object with file
    const newElement = {
      _id: Date.now().toString(),
      name: formData.name,
      image: imageUrl,
      imageFile: formData.image, // Pass the actual file to parent
      prompt: formData.prompt || '', // Include prompt from form data
    }

    // Call parent callback to add element
    onElementAdded(section._id, newElement)

    addToast({
      type: 'success',
      title: 'Element Added',
      description: `Element "${formData.name}" has been added successfully`,
      duration: 3000,
    })

    setIsAddElementModalOpen(false)
  }

  const handleEditElement = (element) => {
    setSelectedElement(element)
    setIsEditModalOpen(true)
  }

  const handleUpdateElement = (formData) => {
    // Use new image if uploaded, otherwise keep existing
    const imageUrl = formData.image
      ? URL.createObjectURL(formData.image)
      : formData.existingImage

    // Create updated element object with file
    const updatedElement = {
      ...selectedElement,
      name: formData.name,
      image: imageUrl,
      imageFile: formData.image || null, // Pass the actual file to parent if new image uploaded
      prompt: formData.prompt || '', // Include prompt from form data
    }

    // Call parent callback to update element
    onElementUpdated(section._id, updatedElement)

    addToast({
      type: 'success',
      title: 'Element Updated',
      description: `Element "${formData.name}" has been updated successfully`,
      duration: 3000,
    })

    setIsEditModalOpen(false)
    setSelectedElement(null)
  }

  const handleDeleteElement = (element) => {
    setSelectedElement(element)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    // Call parent callback to delete element
    onElementDeleted(section._id, selectedElement._id)

    addToast({
      type: 'success',
      title: 'Element Deleted',
      description: `Element "${selectedElement.name}" has been deleted successfully`,
      duration: 3000,
    })

    setIsDeleteModalOpen(false)
    setSelectedElement(null)
  }

  const handleDeleteSection = () => {
    setIsDeleteSectionModalOpen(true)
  }

  const confirmDeleteSection = () => {
    // Call parent callback to delete section
    onSectionDeleted(section._id)

    addToast({
      type: 'success',
      title: 'Section Deleted',
      description: `Section "${section.categoryTitle}" has been deleted successfully`,
      duration: 3000,
    })

    setIsDeleteSectionModalOpen(false)
  }

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {section.categoryTitle}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDeleteSection}
              className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-all hover:border-red-500 hover:bg-red-50 hover:shadow-md active:scale-95"
            >
              <FaTrash className="text-sm" />
              Delete Section
            </button>
            <button
              onClick={handleAddElement}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
            >
              <FaPlus className="text-sm" />
              Add Element
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {section.elements.map((element) => (
            <ParameterElementCard
              key={element._id}
              element={element}
              onEdit={handleEditElement}
              onDelete={handleDeleteElement}
            />
          ))}
        </div>
      </div>

      {/* Add Element Modal */}
      <AddElementModal
        isOpen={isAddElementModalOpen}
        onClose={() => setIsAddElementModalOpen(false)}
        onSubmit={handleSubmitElement}
      />

      {/* Edit Element Modal */}
      <AddElementModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedElement(null)
        }}
        onSubmit={handleUpdateElement}
        editData={selectedElement}
      />

      {/* Delete Element Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedElement(null)
        }}
        title="Delete Element"
        message={`Are you sure you want to delete "${
          selectedElement?.name || 'this element'
        }"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
        onConfirm={confirmDelete}
      />

      {/* Delete Section Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteSectionModalOpen}
        onClose={() => setIsDeleteSectionModalOpen(false)}
        title="Delete Section"
        message={`Are you sure you want to delete the section "${section.categoryTitle}" and all its elements? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
        onConfirm={confirmDeleteSection}
      />
    </>
  )
}

export default ParameterSection

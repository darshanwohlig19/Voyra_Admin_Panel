import React, { useState, useEffect } from 'react'
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa'
import Stepper from '../../components/Stepper'
import ProjectsStep from './steps/ProjectsStep'
import ShotTypesStep from './steps/ShotTypesStep'
import ParametersStep from './steps/ParametersStep'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import { useToaster } from '../../common/Toaster'

const ProjectWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedShotType, setSelectedShotType] = useState('')
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [pendingProject, setPendingProject] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const { addToast } = useToaster()

  // Steps configuration
  const steps = [
    {
      id: 'projects',
      label: 'Step 1: Projects',
      description: 'Manage your projects',
    },
    {
      id: 'shotTypes',
      label: 'Step 2: Shot Types',
      description: 'Configure shot types',
    },
    {
      id: 'parameters',
      label: 'Step 3: Parameters',
      description: 'Set up parameters',
    },
  ]

  // Handle step navigation via stepper click
  const handleStepClick = (stepNumber) => {
    setCurrentStep(stepNumber)
  }

  // Handle next button
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Handle previous button
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle project selection change with confirmation
  const handleProjectChange = (newProject) => {
    // If we're on step 2 or 3 and changing project, show confirmation
    if (currentStep >= 2 && selectedProject && newProject !== selectedProject) {
      setPendingProject(newProject)
      setPendingAction('changeProject')
      setShowConfirmationModal(true)
    } else {
      setSelectedProject(newProject)
      // Clear shot type when project changes
      if (newProject !== selectedProject) {
        setSelectedShotType('')
      }
    }
  }

  // Handle shot type selection change with confirmation
  const handleShotTypeChange = (newShotType) => {
    // If we're on step 3 and changing shot type, show confirmation
    if (
      currentStep === 3 &&
      selectedShotType &&
      newShotType !== selectedShotType
    ) {
      setPendingAction(() => () => {
        setSelectedShotType(newShotType)
      })
      setShowConfirmationModal(true)
    } else {
      setSelectedShotType(newShotType)
    }
  }

  // Confirm the pending change
  const handleConfirmChange = () => {
    if (pendingAction === 'changeProject') {
      setSelectedProject(pendingProject)
      setSelectedShotType('') // Clear shot type when project changes
    } else if (typeof pendingAction === 'function') {
      pendingAction()
    }
    setShowConfirmationModal(false)
    setPendingProject('')
    setPendingAction(null)
  }

  // Cancel the pending change
  const handleCancelChange = () => {
    setShowConfirmationModal(false)
    setPendingProject('')
    setPendingAction(null)
  }

  // Auto-advance logic (optional - can be enabled if needed)
  const handleProjectCreated = () => {
    // Optionally auto-advance to step 2 after creating a project
    // setCurrentStep(2)
  }

  const handleShotTypeCreated = () => {
    // Optionally auto-advance to step 3 after creating a shot type
    // setCurrentStep(3)
  }

  // Handle submit on step 3
  const handleSubmit = () => {
    // Validate that project and shot type are selected
    if (!selectedProject) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please select a project before submitting',
        duration: 3000,
      })
      return
    }

    if (!selectedShotType) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please select a shot type before submitting',
        duration: 3000,
      })
      return
    }

    // All validations passed
    addToast({
      type: 'success',
      title: 'Success',
      description: 'Project workflow has been completed successfully!',
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* Stepper */}
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {/* Step Content */}
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            {/* Step 1: Projects */}
            {currentStep === 1 && (
              <ProjectsStep
                selectedProject={selectedProject}
                onProjectSelect={handleProjectChange}
                onProjectCreated={handleProjectCreated}
              />
            )}

            {/* Step 2: Shot Types */}
            {currentStep === 2 && (
              <ShotTypesStep
                selectedProject={selectedProject}
                selectedShotType={selectedShotType}
                onProjectChange={handleProjectChange}
                onShotTypeSelect={handleShotTypeChange}
                onShotTypeCreated={handleShotTypeCreated}
              />
            )}

            {/* Step 3: Parameters */}
            {currentStep === 3 && (
              <ParametersStep
                selectedProject={selectedProject}
                selectedShotType={selectedShotType}
                onProjectChange={handleProjectChange}
                onShotTypeChange={handleShotTypeChange}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaArrowLeft className="text-xs" />
                Previous
              </button>

              <div className="text-sm text-gray-600">
                Step {currentStep} of {steps.length}
              </div>

              {currentStep === steps.length ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-600/30 transition-all hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/40 active:scale-95"
                >
                  <FaCheck className="text-xs" />
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-lg bg-indigo px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo/30 transition-all hover:bg-indigo hover:shadow-xl hover:shadow-indigo/40"
                >
                  Next
                  <FaArrowRight className="text-xs" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCancelChange}
        title="Confirm Selection Change"
        message={
          pendingAction === 'changeProject'
            ? `Changing the project will reset your shot type selection. Are you sure you want to continue?`
            : `Changing the shot type may affect your current parameters. Are you sure you want to continue?`
        }
        confirmText="Continue"
        cancelText="Cancel"
        confirmColorScheme="orange"
        icon="warning"
        onConfirm={handleConfirmChange}
      />
    </div>
  )
}

export default ProjectWorkflow

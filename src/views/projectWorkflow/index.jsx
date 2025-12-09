import React, { useState, useEffect } from 'react'
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa'
import Stepper from '../../components/Stepper'
import ProjectsStep from './steps/ProjectsStep'
import ShotTypesStep from './steps/ShotTypesStep'
import ParametersStep from './steps/ParametersStep'
import { useToaster } from '../../common/Toaster'

const ProjectWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedShotType, setSelectedShotType] = useState('')
  const [isWorkflowCompleted, setIsWorkflowCompleted] = useState(false)
  const [hasCategoryInParameters, setHasCategoryInParameters] = useState(false)
  const [hasShotTypes, setHasShotTypes] = useState(false)
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

  // Handle next button with validation
  const handleNext = () => {
    // Validation for Step 2: Must have at least one shot type created
    if (currentStep === 2) {
      if (!hasShotTypes) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          description: 'Please make at least one shot type',
          duration: 3000,
        })
        return
      }
    }

    // Proceed to next step if validation passes
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

  // Handle project selection change
  const handleProjectChange = (newProject) => {
    setSelectedProject(newProject)
    // Clear shot type when project changes
    if (newProject !== selectedProject) {
      setSelectedShotType('')
    }
  }

  // Handle shot type selection change
  const handleShotTypeChange = (newShotType) => {
    console.log('Shot type changed to:', newShotType)
    setSelectedShotType(newShotType)
  }

  // Debug: Log when selectedShotType changes
  useEffect(() => {
    console.log('Selected shot type updated:', selectedShotType)
  }, [selectedShotType])

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

    // Validate that at least one category with parameters exists
    if (!hasCategoryInParameters) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please make at least one parameter inside a category',
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

    // Mark workflow as completed
    setIsWorkflowCompleted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stepper at Top */}
      <div className="bg-white shadow-sm">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          isWorkflowCompleted={isWorkflowCompleted}
        />

        {/* Top Navigation Buttons */}
        <div className="border-t border-gray-100 bg-white px-8 py-4">
          <div className="max-w-8xl mx-auto flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaArrowLeft className="text-xs" />
              Previous
            </button>

            <div className="text-sm font-medium text-gray-600">
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

      {/* Step Content - Page Scroll */}
      <div className="bg-white">
        <div className="max-w-8xl mx-auto p-6">
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
              onShotTypesStatusChange={setHasShotTypes}
            />
          )}

          {/* Step 3: Parameters */}
          {currentStep === 3 && (
            <ParametersStep
              selectedProject={selectedProject}
              selectedShotType={selectedShotType}
              onProjectChange={handleProjectChange}
              onShotTypeChange={handleShotTypeChange}
              onCategoryStatusChange={setHasCategoryInParameters}
            />
          )}
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="border-t border-gray-200 bg-white px-8 py-4 shadow-lg">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaArrowLeft className="text-xs" />
            Previous
          </button>

          <div className="text-sm font-medium text-gray-600">
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
  )
}

export default ProjectWorkflow

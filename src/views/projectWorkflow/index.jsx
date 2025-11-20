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
    setSelectedShotType(newShotType)
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
      <div className="w-full">
        <div className="overflow-hidden bg-white">
          <div className="p-6">
            {/* Step 1: Projects */}
            {currentStep === 1 && (
              <>
                <ProjectsStep
                  selectedProject={selectedProject}
                  onProjectSelect={handleProjectChange}
                  onProjectCreated={handleProjectCreated}
                  navigationButtons={
                    <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                      <button
                        onClick={handlePrevious}
                        disabled={true}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <FaArrowLeft className="text-xs" />
                        Previous
                      </button>

                      <div className="text-sm text-gray-600">
                        Step {currentStep} of {steps.length}
                      </div>

                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 rounded-lg bg-indigo px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo/30 transition-all hover:bg-indigo hover:shadow-xl hover:shadow-indigo/40"
                      >
                        Next
                        <FaArrowRight className="text-xs" />
                      </button>
                    </div>
                  }
                />

                {/* Navigation Buttons for Step 1 - Bottom */}
                <div className="mt-8 flex items-center justify-between pt-6">
                  <button
                    onClick={handlePrevious}
                    disabled={true}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FaArrowLeft className="text-xs" />
                    Previous
                  </button>

                  <div className="text-sm text-gray-600">
                    Step {currentStep} of {steps.length}
                  </div>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 rounded-lg bg-indigo px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo/30 transition-all hover:bg-indigo hover:shadow-xl hover:shadow-indigo/40"
                  >
                    Next
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Shot Types */}
            {currentStep === 2 && (
              <>
                <ShotTypesStep
                  selectedProject={selectedProject}
                  selectedShotType={selectedShotType}
                  onProjectChange={handleProjectChange}
                  onShotTypeSelect={handleShotTypeChange}
                  onShotTypeCreated={handleShotTypeCreated}
                  navigationButtons={
                    <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                      <button
                        onClick={handlePrevious}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                      >
                        <FaArrowLeft className="text-xs" />
                        Previous
                      </button>

                      <div className="text-sm text-gray-600">
                        Step {currentStep} of {steps.length}
                      </div>

                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 rounded-lg bg-indigo px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo/30 transition-all hover:bg-indigo hover:shadow-xl hover:shadow-indigo/40"
                      >
                        Next
                        <FaArrowRight className="text-xs" />
                      </button>
                    </div>
                  }
                />

                {/* Navigation Buttons for Step 2 - Bottom */}
                <div className="mt-8 flex items-center justify-between pt-6">
                  <button
                    onClick={handlePrevious}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                  >
                    <FaArrowLeft className="text-xs" />
                    Previous
                  </button>

                  <div className="text-sm text-gray-600">
                    Step {currentStep} of {steps.length}
                  </div>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 rounded-lg bg-indigo px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo/30 transition-all hover:bg-indigo hover:shadow-xl hover:shadow-indigo/40"
                  >
                    Next
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Parameters */}
            {currentStep === 3 && (
              <>
                <ParametersStep
                  selectedProject={selectedProject}
                  selectedShotType={selectedShotType}
                  onProjectChange={handleProjectChange}
                  onShotTypeChange={handleShotTypeChange}
                  navigationButtons={
                    <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                      <button
                        onClick={handlePrevious}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                      >
                        <FaArrowLeft className="text-xs" />
                        Previous
                      </button>

                      <div className="text-sm text-gray-600">
                        Step {currentStep} of {steps.length}
                      </div>

                      <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-600/30 transition-all hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/40 active:scale-95"
                      >
                        <FaCheck className="text-xs" />
                        Submit
                      </button>
                    </div>
                  }
                />

                {/* Navigation Buttons for Step 3 - Bottom */}
                <div className="mt-8 flex items-center justify-between pt-6">
                  <button
                    onClick={handlePrevious}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                  >
                    <FaArrowLeft className="text-xs" />
                    Previous
                  </button>

                  <div className="text-sm text-gray-600">
                    Step {currentStep} of {steps.length}
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-600/30 transition-all hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/40 active:scale-95"
                  >
                    <FaCheck className="text-xs" />
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectWorkflow

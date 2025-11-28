import React from 'react'
import { FaCheck } from 'react-icons/fa'

const Stepper = ({ steps, currentStep, onStepClick, isWorkflowCompleted }) => {
  return (
    <div className="w-full px-4 pb-8 pt-0">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isActive = !isWorkflowCompleted && currentStep === stepNumber
            const isCompleted =
              currentStep > stepNumber ||
              (isWorkflowCompleted && currentStep >= stepNumber)
            const isClickable = false // Steps are not clickable

            return (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`group relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      isActive
                        ? 'border-indigo bg-indigo text-white shadow-lg shadow-indigo/30'
                        : isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    } cursor-default`}
                  >
                    {isCompleted ? (
                      <FaCheck className="text-lg" />
                    ) : (
                      <span className="text-base font-semibold">
                        {stepNumber}
                      </span>
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <p
                      className={`text-sm font-medium ${
                        isActive
                          ? 'text-indigo'
                          : isCompleted
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="mt-1 text-xs text-gray-400">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="mb-8 flex-1 px-4">
                    <div
                      className={`h-0.5 transition-all duration-300 ${
                        currentStep > stepNumber
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Stepper

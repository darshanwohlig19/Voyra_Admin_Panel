import React from 'react'
import { FaCheck } from 'react-icons/fa'

const Stepper = ({ steps, currentStep, onStepClick, isWorkflowCompleted }) => {
  return (
    <div className="mt-8 w-full border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/50 py-8">
      <div className="mx-auto w-full">
        <div className="relative flex items-start justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isActive = !isWorkflowCompleted && currentStep === stepNumber
            const isCompleted =
              currentStep > stepNumber ||
              (isWorkflowCompleted && currentStep >= stepNumber)

            return (
              <React.Fragment key={step.id}>
                {/* Step Item */}
                <div className="relative flex flex-1 flex-col items-center">
                  {/* Connector Line - Behind Circle */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-1/2 top-8 -z-0 h-1 w-full">
                      <div className="relative h-full w-full">
                        <div className="absolute inset-0 w-full bg-gray-200" />
                        <div
                          className={`absolute inset-0 h-full transition-all duration-500 ease-in-out ${
                            currentStep > stepNumber
                              ? 'w-full bg-gradient-to-r from-indigo to-indigo'
                              : 'w-0'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step Circle */}
                  <div
                    className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 transition-all duration-300 ${
                      isActive
                        ? 'scale-110 border-white bg-gradient-to-br from-indigo to-indigo shadow-xl'
                        : isCompleted
                        ? 'border-white bg-gradient-to-br from-indigo to-indigo shadow-lg shadow-indigo/30'
                        : 'border-gray-200 bg-white shadow-sm'
                    }`}
                  >
                    {isCompleted ? (
                      <FaCheck
                        className={`text-xl ${
                          isActive ? 'text-white' : 'text-white'
                        }`}
                      />
                    ) : (
                      <span
                        className={`text-xl font-bold ${
                          isActive
                            ? 'text-white'
                            : 'text-transparent bg-gradient-to-br from-gray-400 to-gray-500 bg-clip-text'
                        }`}
                      >
                        {stepNumber}
                      </span>
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="mt-4 text-center">
                    <p
                      className={`text-base font-semibold transition-colors duration-200 ${
                        isActive
                          ? 'text-indigo'
                          : isCompleted
                          ? 'text-gray-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label
                        .replace('Step 1: ', '')
                        .replace('Step 2: ', '')
                        .replace('Step 3: ', '')}
                    </p>
                    {step.description && (
                      <p
                        className={`mt-1 text-xs transition-colors duration-200 ${
                          isActive
                            ? 'text-indigo/70'
                            : isCompleted
                            ? 'text-gray-500'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Stepper

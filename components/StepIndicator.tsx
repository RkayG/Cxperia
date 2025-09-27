import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  steps: { number: number; label: string }[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-center sm:justify-start w-full overflow-x-auto">
      {steps.map((step, index) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <React.Fragment key={step.number}>
            <div
              className={`
                relative flex items-center justify-center py-2 px-3 sm:px-6
                text-xs sm:text-sm md:text-base font-medium whitespace-normal text-center
                flex-1
                ${isCompleted
                  ? 'bg-purple-300 text-purple-900'
                  : isActive
                  ? 'bg-purple-900 text-white'
                  : 'bg-purple-100 text-[#502274]'
                }
                ${index === 0 ? 'rounded-l-lg' : ''}
                ${index === steps.length - 1 ? 'rounded-r-lg' : ''}
              `}
            >
              {step.label}

              {index < steps.length - 1 && (
                <div
                  className={`
                    absolute right-0 top-0 h-full w-4 sm:w-6
                    ${isCompleted
                      ? 'bg-purple-300'
                      : isActive
                      ? 'bg-purple-900'
                      : 'bg-purple-100'
                    }
                    transform skew-x-[-20deg]
                    z-20
                  `}
                  style={{
                    right: '-8px',
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                  }}
                />
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;

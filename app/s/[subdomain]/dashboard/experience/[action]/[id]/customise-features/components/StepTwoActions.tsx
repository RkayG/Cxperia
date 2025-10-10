import React from 'react';

interface StepTwoActionsProps {
  onBack: () => void;
  onNext: () => void;
}

const StepTwoActions: React.FC<StepTwoActionsProps> = ({ onBack, onNext }) => (
  <div className="flex px-3 md:px-0 mb-32 mt-12 flex-row gap-3 sm:gap-4 justify-between pt-6 ">
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <button
        onClick={onBack}
        className="w-fit sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
      >
        ← Back
      </button>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
    {/*   <button
        onClick={onSaveDraft}
        className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200 order-2 sm:order-1"
      >
        Save Draft
      </button> */}
      <button
        onClick={onNext}
        className=" w-fit sm:w-auto px-8 py-3.5 bg-purple-800 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 order-1 sm:order-2"
      >
        Preview
      </button>
    </div>
  </div>
);

export default StepTwoActions;

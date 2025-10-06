// src/components/InstructionsSection.tsx
import { AlertCircle, Droplet, Lightbulb, Sun } from "lucide-react";
import { usePublicExpStore } from "@/store/public/usePublicExpStore";

interface ApplicationStep {
  step_number: number;
  step_title: string;
  description: string;
}

interface InstructionsSectionProps {
  color: string;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({ color }) => {
  const { experience } = usePublicExpStore();
  const instructions = experience?.data?.digital_instructions[0];
    //console.log("Instructions data:", instructions);
  if (!instructions) return null;

  // Parse skin_type if it's a stringified array
  let skinTypes: string[] = [];
  if (instructions.skin_type) {
    try {
      skinTypes =
        typeof instructions.skin_type === "string"
          ? JSON.parse(instructions.skin_type)
          : instructions.skin_type;
    } catch {
      skinTypes = Array.isArray(instructions.skin_type)
        ? instructions.skin_type
        : [];
    }
  }

  // Parse tips and warnings if needed
  let tips: string[] = [];
  if (instructions.tips) {
    try {
      tips =
        typeof instructions.tips === "string"
          ? JSON.parse(instructions.tips)
          : instructions.tips;
    } catch {
      tips = Array.isArray(instructions.tips) ? instructions.tips : [];
    }
  }
  let warnings: string[] = [];
  if (instructions.warnings) {
    try {
      warnings =
        typeof instructions.warnings === "string"
          ? JSON.parse(instructions.warnings)
          : instructions.warnings;
    } catch {
      warnings = Array.isArray(instructions.warnings)
        ? instructions.warnings
        : [];
    }
  }

  // Parse application_steps
  let applicationSteps: ApplicationStep[] = [];
  if (instructions.application_steps) {
    try {
      applicationSteps =
        typeof instructions.application_steps === "string"
          ? JSON.parse(instructions.application_steps)
          : instructions.application_steps;
    } catch {
      applicationSteps = Array.isArray(instructions.application_steps)
        ? instructions.application_steps
        : [];
    }
  }

  return (
    <div className="bg-white overflow-hidden mb-32">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-xl font-semibold text-left" style={{ color }}>
          Instructions
        </h2>
        <p className="text-sm text-gray-500 text-left">
          Follow these steps for best results
        </p>
      </div>

      {/* Quick Usage Info */}
      {/* Quick Usage Info */}
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Usage Guide
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Usage Time */}
          <div className="flex text-left items-start p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex-shrink-0 p-2  rounded-md mr-3">
              <Sun className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Usage Time</p>
              <p className="text-sm text-gray-600">
                {instructions.usage_time_type}
              </p>
            </div>
          </div>

          {/* Frequency */}
          <div className="flex text-left items-start p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex-shrink-0 p-2 rounded-md mr-3">
              <Droplet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Frequency</p>
              <p className="text-sm text-gray-600">{instructions.frequency}</p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex text-left items-start p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex-shrink-0 p-2 rounded-md mr-3">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Duration</p>
              <p className="text-sm text-gray-600">{instructions.duration}</p>
            </div>
          </div>

          {/* Skin Types */}
          <div className="flex items-start p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex-shrink-0 p-2  rounded-md mr-3">
              <svg
                className="w-5 h-5 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">Skin Types</p>
              <p className="text-sm text-gray-600">{skinTypes.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        {tips.length > 0 && (
          <div className="mt-4 p-4 text-left text-white rounded-lg border border-blue-100"
          style={{ backgroundColor: `${color}` }}>
            <div className="flex items-start">
              <div className="flex-shrink-0 p-1 bg-white rounded-md mr-3">
                <Lightbulb className="w-5 h-5 " style={{ color: `${color}` }} />
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-1">
                  Pro Tips
                </p>
                <ul className="text-sm text-white list-disc list-inside space-y-1">
                  {tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mt-4 p-4 text-left bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-start">
              <div className="flex-shrink-0 p-1 bg-red-100 rounded-md mr-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">
                  Important Warnings
                </p>
                <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="divide-y divide-gray-100 relative">
        {applicationSteps.map((step) => (
          <div
            key={step.step_number}
            className="relative flex items-start p-4 pl-20 min-h-[64px]"
          >
            {/* Big Step Number */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-200 font-extrabold select-none"
              style={{
                fontSize: "3.5rem",
                lineHeight: 1,
                width: "50px",
                height: "50px",
                minWidth: "50px",
                textAlign: "center",
              }}
            >
              {step.step_number}
            </div>
            {/* Step Details */}
            <div className="flex-1">
              <p className="text-gray-800 text-left text-base font-semibold mb-1">
                {step.step_title}
              </p>
              <p className="text-gray-800 text-left text-base">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructionsSection;

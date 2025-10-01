import React from "react";

export interface TutorialValidationResult {
  valid: boolean;
  errors: string[];
  allFieldsFilledButNoStep: boolean;
  allFieldsFilledButStepsIncomplete: boolean;
}

export function validateTutorial(tutorial: any): TutorialValidationResult {
  const errors: string[] = [];
  let allFieldsFilled = true;
  if (!tutorial.title || tutorial.title.trim() === "") {
    errors.push("Tutorial title is required.");
    allFieldsFilled = false;
  }
  if (!tutorial.description || tutorial.description.trim() === "") {
    errors.push("Tutorial description is required.");
    allFieldsFilled = false;
  }
  if (!tutorial.category || tutorial.category.trim() === "") {
    errors.push("Tutorial category is required.");
    allFieldsFilled = false;
  }
/*   if (!tutorial.skinTypes || tutorial.skinTypes.length === 0) {
    errors.push("At least one skin type must be selected.");
    allFieldsFilled = false;
  }
  if (!tutorial.occasion || tutorial.occasion.length === 0) {
    errors.push("At least one occasion must be selected.");
    allFieldsFilled = false;
  } */
  if (!tutorial.featuredImage || tutorial.featuredImage.trim() === "") {
    errors.push("Featured image is required.");
    allFieldsFilled = false;
  }
  let noSteps = false;
  let stepsIncomplete = false;
  if (!tutorial.steps || tutorial.steps.length === 0) {
    errors.push("At least one step is required.");
    noSteps = true;
  } else {
    tutorial.steps.forEach((step: any, idx: number) => {
      if (!step.title || step.title.trim() === "") {
        errors.push(`Step ${idx + 1} title is required.`);
        stepsIncomplete = true;
      }
      if (!step.description || step.description.trim() === "") {
        errors.push(`Step ${idx + 1} description is required.`);
        stepsIncomplete = true;
      }
    });
  }
  return {
    valid: errors.length === 0,
    errors,
    allFieldsFilledButNoStep: allFieldsFilled && noSteps,
    allFieldsFilledButStepsIncomplete: allFieldsFilled && stepsIncomplete
  };
}

const TutorialValidation: React.FC<{ errors: string[] }> = ({ errors }) => {
  if (!errors || errors.length === 0) return null;
  return (
    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
      <ul className="list-disc pl-5">
        {errors.map((err, idx) => (
          <li key={idx}>{err}</li>
        ))}
      </ul>
    </div>
  );
};

export default TutorialValidation;

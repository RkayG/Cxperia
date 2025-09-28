// validationUtils.ts
// Utility functions for validating tutorial creator inputs

//export function validateTutorialTitle(title: string): string | null {
//  if (!title || title.trim().length < 3) {
//    return "Tutorial title must be at least 3 characters.";
//  }
//  return null;
//}
//
//export function validateTutorialDescription(description: string): string | null {
//  if (!description || description.trim().length < 10) {
//    return "Description must be at least 10 characters.";
//  }
//  return null;
//}
//
//export function validateCategory(category: string): string | null {
//  if (!category || category.trim().length === 0) {
//    return "Category is required.";
//  }
//  return null;
//}
//
//export function validateTotalDuration(duration: string): string | null {
//  if (!duration || duration.trim().length === 0) {
//    return "Total duration is required.";
//  }
//  // Optionally, add regex for time format validation
//  return null;
//}
//
//export function validateStep(step: any): string[] {
//  const errors: string[] = [];
//  if (!step.title || step.title.trim().length < 2) {
//    errors.push("Step title must be at least 2 characters.");
//  }
//  if (!step.description || step.description.trim().length < 5) {
//    errors.push("Step description must be at least 5 characters.");
//  }
//  // Optionally, validate products, tips, etc.
//  return errors;
//}
//
//export function validateTutorial(tutorial: any): string[] {
//  const errors: string[] = [];
//  const titleError = validateTutorialTitle(tutorial.title);
//  if (titleError) errors.push(titleError);
//  const descError = validateTutorialDescription(tutorial.description);
//  if (descError) errors.push(descError);
//  const catError = validateCategory(tutorial.category);
//  if (catError) errors.push(catError);
//  const durError = validateTotalDuration(tutorial.totalDuration);
//  if (durError) errors.push(durError);
//  if (!Array.isArray(tutorial.steps) || tutorial.steps.length === 0) {
//    errors.push("At least one step is required.");
//  } else {
//    tutorial.steps.forEach((step: any, idx: number) => {
//      const stepErrors = validateStep(step);
//      if (stepErrors.length > 0) {
//        errors.push(`Step ${idx + 1}: ${stepErrors.join(' ')}`);
//      }
//    });
//  }
//  return errors;
//}

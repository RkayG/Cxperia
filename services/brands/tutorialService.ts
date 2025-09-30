/**
 * TODO: move tutorial service functions here from featureService.ts
 */
import config  from "@/config/api";
const { endpoints } = config;

export async function getTutorials(type: 'all' | 'recents' = 'all') {
  const res = await fetch(endpoints.TUTORIAL.LIST(type));
  return res.json();
}

export async function getTutorialById(tutorialId: string) {
  const res = await fetch(endpoints.TUTORIAL.DETAIL(tutorialId));
  return res.json();
}

export async function addTutorial(data: any) {
  const res = await fetch(endpoints.TUTORIAL.CREATE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTutorial(tutorialId: string, data: any) {
  const res = await fetch(endpoints.TUTORIAL.UPDATE(tutorialId), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTutorial(tutorialId: string) {
  const res = await fetch(endpoints.TUTORIAL.DELETE(tutorialId), {
    method: 'DELETE',
  });
  return res.json();
}
export async function getTutorialIdsLinkedToExperience(experienceId: string) {
  const res = await fetch(endpoints.TUTORIAL.LINK(experienceId));
  return res.json();
}
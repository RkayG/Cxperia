"use client";
import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import TutorialCreator from '../page';

const TutorialEditPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Extract the tutorial ID from the URL params
  const tutorialId = params.id as string;
  
  // Get mode from search params (should be 'edit' for this route)
  const mode = searchParams.get('mode') || 'edit';
  
  // Pass the tutorialId and mode to the TutorialCreator component
  return <TutorialCreator mode={mode as "edit" | "create"} />;
};

export default TutorialEditPage;

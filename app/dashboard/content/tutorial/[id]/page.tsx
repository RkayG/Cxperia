"use client";
import { useParams } from 'next/navigation';
import React from 'react';
import TutorialCreator from '../page';

const TutorialEditPage: React.FC = () => {
  const params = useParams();
  const _tutorialId = params.id as string;
  
  // The TutorialCreator component handles mode detection internally via useSearchParams
  return <TutorialCreator />;
};

export default TutorialEditPage;

// Simple translation system without next-intl complexity
export const translations = {
  en: {
    common: {
      loading: "Loading...",
      error: "Error",
      retry: "Try Again",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      close: "Close",
      back: "Back",
      next: "Next",
      previous: "Previous",
      submit: "Submit",
      search: "Search",
      filter: "Filter",
      all: "All",
      none: "None",
      yes: "Yes",
      no: "No"
    },
    navigation: {
      dashboard: "Dashboard",
      experiences: "Experiences",
      content: "Content",
      analytics: "Analytics",
      settings: "Settings",
      profile: "Profile",
      logout: "Logout"
    },
    mobilePreview: {
      loadingPreview: "Loading preview...",
      previewUnavailable: "Preview Unavailable",
      previewError: "Unable to load the preview. This might be due to network issues or the experience not being published yet.",
      noPreviewAvailable: "No Preview Available",
      experienceUrlNotFound: "Experience URL not found",
      reloadPreview: "Reload Preview",
      openInNewTab: "Open in New Tab",
      retry: "Try Again"
    },
    features: {
      ingredientBreakdown: "Ingredient Breakdown",
      usageInstructions: "Usage Instructions",
      shareFeedback: "Share Feedback",
      tutorialsRoutines: "Tutorials & Routines",
      customerSupport: "Customer Support",
      discoverWhatMakesItSpecial: "Discover what makes it special",
      howToUseTheProduct: "How to use the product",
      shareYourThoughts: "Share your thoughts",
      watchAndLearn: "Watch and learn",
      getHelpOrContactUs: "Get help or contact us"
    }
  },
  fr: {
    common: {
      loading: "Chargement...",
      error: "Erreur",
      retry: "Réessayer",
      cancel: "Annuler",
      save: "Enregistrer",
      edit: "Modifier",
      delete: "Supprimer",
      close: "Fermer",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      submit: "Soumettre",
      search: "Rechercher",
      filter: "Filtrer",
      all: "Tous",
      none: "Aucun",
      yes: "Oui",
      no: "Non"
    },
    navigation: {
      dashboard: "Tableau de bord",
      experiences: "Expériences",
      content: "Contenu",
      analytics: "Analyses",
      settings: "Paramètres",
      profile: "Profil",
      logout: "Déconnexion"
    },
    mobilePreview: {
      loadingPreview: "Chargement de l'aperçu...",
      previewUnavailable: "Aperçu indisponible",
      previewError: "Impossible de charger l'aperçu. Cela peut être dû à des problèmes de réseau ou à une expérience qui n'est pas encore publiée.",
      noPreviewAvailable: "Aucun aperçu disponible",
      experienceUrlNotFound: "URL d'expérience introuvable",
      reloadPreview: "Recharger l'aperçu",
      openInNewTab: "Ouvrir dans un nouvel onglet",
      retry: "Réessayer"
    },
    features: {
      ingredientBreakdown: "Analyse des ingrédients",
      usageInstructions: "Instructions d'utilisation",
      shareFeedback: "Partager des commentaires",
      tutorialsRoutines: "Tutoriels et routines",
      customerSupport: "Support client",
      discoverWhatMakesItSpecial: "Découvrez ce qui le rend spécial",
      howToUseTheProduct: "Comment utiliser le produit",
      shareYourThoughts: "Partagez vos pensées",
      watchAndLearn: "Regardez et apprenez",
      getHelpOrContactUs: "Obtenez de l'aide ou contactez-nous"
    }
  }
};

export type Locale = 'en' | 'fr';
export type TranslationKey = keyof typeof translations.en;

export function getTranslation(locale: Locale, namespace: string, key: string): string {
  const translation = (translations[locale] as any)?.[namespace]?.[key];
  return translation || (translations.en as any)[namespace]?.[key] || key;
}


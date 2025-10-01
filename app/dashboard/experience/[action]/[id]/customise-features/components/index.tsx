"use client";
import { Sparkles } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import EmptyCatalogModal from "@/components/EmptyCatalogModal";
import ExperienceOverviewSection from "./ExperienceOverviewSection";
import ScrollToTop from "@/components/ScrollToTop";
import StepTwoActions from "./StepTwoActions";
import StepTwoFeatures from "./StepTwoFeatures";
import StepTwoModals from "./StepTwoModals";
import { useExperienceStore } from "@/store/brands/useExperienceStore";
import { useFeatureToggles } from "@/hooks/brands/useFeatureToggle";
import { useProducts } from "@/hooks/brands/useProductApi";
import { useTutorials } from "@/hooks/brands/useFeatureApi";
import type { FeatureSettings } from "@/types/productExperience";
import { showToast } from "@/utils/toast";
import { validateFeatures } from "@/utils/featureValidation";

interface CustomiseFeaturesStepProps {
  onNext: () => void;
  onBack: () => void;
}

const CustomiseFeaturesStep: React.FC<CustomiseFeaturesStepProps> = ({ onNext, onBack }) => {
  //console.log('CustomiseFeaturesStep: Component rendered with props:', { onNext, onBack });
  // Validation error state
  const params = useParams();
  const experienceId = params.id as string;

  const [featureErrors, setFeatureErrors] = useState<{ missingRequired: string[]; notEnoughSelected: boolean }>({ missingRequired: [], notEnoughSelected: false });

  // Scroll to first error feature if validation fails
  const scrollToFeatureError = (featureId: string) => {
    const el = document.getElementById(`feature-toggle-${featureId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-4", "ring-red-400");
      setTimeout(() => el.classList.remove("ring-4", "ring-red-400"), 2000);
    }
  };

  const router = useRouter();

  // Zustand store
  const { experienceData, setExperienceData, setFeaturesForExperience, getFeaturesForExperience } = useExperienceStore();

  // Get features for current experience from store
  const currentFeatureSettings = getFeaturesForExperience(experienceId);

  // Local state for overview section
  const [_overviewData, setOverviewData] = useState(experienceData);

  // Update overview data when experienceData changes
  useEffect(() => {
    setOverviewData(experienceData);
  }, [experienceData]);


  // Fetchers
  const { data: productsData = [] } = useProducts();
  const { data: tutorialsData = [] } = useTutorials();

  // Central feature hook (fallback to old logic if no store features)
  const { featureSettings, setFeatureSettings, onToggleCore } = useFeatureToggles(experienceId);

  // Modal state grouped
  const [modals, setModals] = useState({
    ingredient: false,
    digitalInstructions: false,
    customerSupport: false,
    recommendedProducts: false,
    tutorialContentManager: false,
    emptyCatalog: false,
    emptyTutorials: false,
  });
  
  const [emptyTutorialsMessage, setEmptyTutorialsMessage] = useState("");

  const openModal = useCallback((key: keyof typeof modals) => 
    setModals(m => ({ ...m, [key]: true })), []);
    
  const closeModal = useCallback((key: keyof typeof modals) => 
    setModals(m => ({ ...m, [key]: false })), []);

  // Handlers for saving modal data
  const handleSaveIngredients = useCallback(async (_productName: string, updatedIngredients: any[]) => {
    if (!Array.isArray(updatedIngredients) || updatedIngredients.length === 0) return;
    setFeatureSettings(prev => ({ ...prev, ingredientList: true }));
    closeModal("ingredient");
    await onToggleCore("ingredientList", true);
    // Also update global store
    setFeaturesForExperience(experienceId, {
      ...((currentFeatureSettings || featureSettings) as FeatureSettings),
      ingredientList: true,
    });
  }, [onToggleCore, setFeatureSettings, closeModal, experienceId, setFeaturesForExperience, currentFeatureSettings, featureSettings]);

  const handleSaveDigitalInstructions = useCallback(async (instructions: any[], onFeatureEnable?: () => void) => {
    if (!Array.isArray(instructions) || instructions.length === 0) return;
    setFeatureSettings(prev => ({ ...prev, productUsage: true }));
    if (onFeatureEnable) onFeatureEnable();
    closeModal("digitalInstructions");
    await onToggleCore("productUsage", true);
    // Also update global store
    setFeaturesForExperience(experienceId, {
      ...((currentFeatureSettings || featureSettings) as FeatureSettings),
      productUsage: true,
    });
  }, [onToggleCore, setFeatureSettings, closeModal, experienceId, setFeaturesForExperience, currentFeatureSettings, featureSettings]);

  const handleSaveCustomerSupport = useCallback(async (payload: any) => {
    if (!payload || Object.keys(payload).length === 0) return;
    setFeatureSettings(prev => ({ ...prev, customerService: true }));
    closeModal("customerSupport");
    await onToggleCore("customerService", true);
    // Also update global store
    setFeaturesForExperience(experienceId, {
      ...((currentFeatureSettings || featureSettings) as FeatureSettings),
      customerService: true,
    });
  }, [onToggleCore, setFeatureSettings, closeModal, experienceId, setFeaturesForExperience, currentFeatureSettings, featureSettings]);

  const handleAutoEnableCustomerService = useCallback(() => {
    setFeatureSettings(prev => ({ ...prev, customerService: true }));
  }, [setFeatureSettings]);

  // Wrapper for toggles
  const handleToggle = useCallback(async (featureId: string, enabled: boolean) => {
    // Helper to ensure all keys are present and boolean
    const buildFeatureSettings = (base: any, key: string, value: boolean): FeatureSettings => ({
      tutorialsRoutines: key === 'tutorialsRoutines' ? value : !!base.tutorialsRoutines,
      ingredientList: key === 'ingredientList' ? value : !!base.ingredientList,
      loyaltyPoints: key === 'loyaltyPoints' ? value : !!base.loyaltyPoints,
      skinRecommendations: key === 'skinRecommendations' ? value : !!base.skinRecommendations,
      chatbot: key === 'chatbot' ? value : !!base.chatbot,
      feedbackForm: key === 'feedbackForm' ? value : !!base.feedbackForm,
      customerService: key === 'customerService' ? value : !!base.customerService,
      productUsage: key === 'productUsage' ? value : !!base.productUsage,
    });

    if (featureId === "tutorialsRoutines") {
      if (enabled) {
        if (!Array.isArray(tutorialsData) || tutorialsData.length === 0) {
          setEmptyTutorialsMessage("Add tutorials and routines to your catalog to enable this feature. You can create them now and turn the feature on after.");
          openModal("emptyTutorials");
          return;
        }
      }
      await onToggleCore(featureId, enabled);
      setFeaturesForExperience(experienceId, buildFeatureSettings(currentFeatureSettings || featureSettings, featureId, enabled));
      return;
    }

    if (enabled) {
      const configNeeded = ["ingredientList", "productUsage", "customerService"];

      if (featureId === "skinRecommendations") {
        if (!Array.isArray(productsData) || productsData.length <= 1) {
          openModal("emptyCatalog");
          return;
        }
        openModal("recommendedProducts");
        await onToggleCore(featureId, true);
        setFeaturesForExperience(experienceId, buildFeatureSettings(currentFeatureSettings || featureSettings, featureId, true));
        return;
      }

      if (configNeeded.includes(featureId)) {
        if (featureId === "ingredientList") openModal("ingredient");
        if (featureId === "productUsage") openModal("digitalInstructions");
        if (featureId === "customerService") openModal("customerSupport");
        return;
      }

      await onToggleCore(featureId, true);
      setFeaturesForExperience(experienceId, buildFeatureSettings(currentFeatureSettings || featureSettings, featureId, true));
      return;
    }

    await onToggleCore(featureId, false);
    setFeaturesForExperience(experienceId, buildFeatureSettings(currentFeatureSettings || featureSettings, featureId, false));
  }, [tutorialsData, productsData, onToggleCore, openModal, experienceId, setFeaturesForExperience, currentFeatureSettings, featureSettings]);

  const experienceOverview = useMemo(() => ({
    experienceName: experienceData.productName,
    shortTagline: experienceData.tagline,
    category: experienceData.category,
    storeLink: experienceData.storeLink,
    logoFile: undefined, // Map if available
    features: {
      tutorialsRoutines: !!(currentFeatureSettings ? currentFeatureSettings.tutorialsRoutines : featureSettings.tutorialsRoutines),
      ingredientList: !!(currentFeatureSettings ? currentFeatureSettings.ingredientList : featureSettings.ingredientList),
      loyaltyPoints: !!(currentFeatureSettings ? currentFeatureSettings.loyaltyPoints : featureSettings.loyaltyPoints),
      skinRecommendations: !!(currentFeatureSettings ? currentFeatureSettings.skinRecommendations : featureSettings.skinRecommendations),
      chatbot: !!(currentFeatureSettings ? currentFeatureSettings.chatbot : featureSettings.chatbot),
      feedbackForm: !!(currentFeatureSettings ? currentFeatureSettings.feedbackForm : featureSettings.feedbackForm),
      customerService: !!(currentFeatureSettings ? currentFeatureSettings.customerService : featureSettings.customerService),
      productUsage: !!(currentFeatureSettings ? currentFeatureSettings.productUsage : featureSettings.productUsage),
    }
  }), [experienceData, featureSettings, currentFeatureSettings]);
  
  const selectedFeatures = useMemo(() => 
    Object.values(currentFeatureSettings || featureSettings).filter(Boolean).length, 
    [currentFeatureSettings, featureSettings]
  );

  // Helper to sanitize feature settings to all-boolean
  const sanitizeFeatureSettings = (settings: any): FeatureSettings => ({
    tutorialsRoutines: !!settings.tutorialsRoutines,
    ingredientList: !!settings.ingredientList,
    loyaltyPoints: !!settings.loyaltyPoints,
    skinRecommendations: !!settings.skinRecommendations,
    chatbot: !!settings.chatbot,
    feedbackForm: !!settings.feedbackForm,
    customerService: !!settings.customerService,
    productUsage: !!settings.productUsage,
  });

  // Custom Next handler with validation
  const handleNext = () => {
    const features = sanitizeFeatureSettings(currentFeatureSettings || featureSettings);
    const validation = validateFeatures(features);
    setFeatureErrors(validation.errors);
    if (!validation.valid) {
      // Scroll to first missing required, else highlight not enough selected
      const firstMissing = validation.errors.missingRequired.find((f) => typeof f === "string" && f.length > 0);
      if (firstMissing) {
        scrollToFeatureError(firstMissing);
      } else if (validation.errors.notEnoughSelected) {
        showToast.error("Please select at least 4 features to proceed.");
      }
      return;
    }
    onNext();
  };

  return (
    <>
      <ScrollToTop />

    <div className="px-4 mt-4 md:px-0 md:-mt-4 fade-in ">
      <ExperienceOverviewSection
        data={experienceOverview}
        onUpdate={setExperienceData}
        onNext={handleNext}
        onBack={onBack}
      />

      <StepTwoFeatures
        data={experienceOverview}
        onToggle={handleToggle}
        onEdit={(id: string) => {
          if (id === "ingredientList") openModal("ingredient");
          if (id === "productUsage") openModal("digitalInstructions");
          if (id === "customerService") openModal("customerSupport");
          if (id === "skinRecommendations") openModal("recommendedProducts");
        }}
        selectedFeatures={selectedFeatures}
        featureErrors={featureErrors}
        onOpenIngredientModal={() => openModal("ingredient")}
        onOpenDigitalInstructionsModal={() => openModal("digitalInstructions")}
        onOpenRecommendedProductsModal={() => openModal("recommendedProducts")}
        onOpenCustomerSupportModal={() => openModal("customerSupport")}
        onOpenTutorialContentManager={() => openModal("tutorialContentManager")}
      />

      <StepTwoActions onBack={onBack} onNext={handleNext} />

      <StepTwoModals
        experienceId={experienceId}
        isIngredientModalOpen={modals.ingredient}
        onCloseIngredient={() => closeModal("ingredient")}
        currentProductName={experienceData.productName}
        onSaveIngredients={handleSaveIngredients}
        isDigitalInstructionsModalOpen={modals.digitalInstructions}
        onCloseDigitalInstructions={() => closeModal("digitalInstructions")}
        onSaveDigitalInstructions={handleSaveDigitalInstructions}
        isCustomerSupportModalOpen={modals.customerSupport}
        onCloseCustomerSupport={() => closeModal("customerSupport")}
        onSaveCustomerSupport={handleSaveCustomerSupport}
        onAutoEnableCustomerService={handleAutoEnableCustomerService}
        onFeatureEnable={() => {
          setFeatureSettings(prev => ({ ...prev, productUsage: true }));
          setFeaturesForExperience(experienceId, {
            ...((currentFeatureSettings || featureSettings) as FeatureSettings),
            productUsage: true,
          });
          closeModal("digitalInstructions");
        }}
        ingredients={[]}
        digitalInstructions={[]}
        customerSupportLinks={{
          liveChatWidgetUrl: "",
          whatsAppNumber: "",
          supportEmail: "",
          faqPageUrl: "",
          automaticIntegration: false
        }}
      />

      <EmptyCatalogModal
        open={modals.emptyCatalog}
        onClose={() => closeModal("emptyCatalog")}
        icon={<FaBoxOpen />}
        message={"Add products to your catalog to enable skin recommendations. You can turn them to experiences later."}
        actionLabel={"Add Product"}
        onAction={() => router.push("/create-product?from=experience&step=2")}
      />

      <EmptyCatalogModal
        open={modals.emptyTutorials}
        onClose={() => closeModal("emptyTutorials")}
        icon={<Sparkles className="text-yellow-400" />}
        message={emptyTutorialsMessage}
        actionLabel={"Create Tutorial or Routine"}
        onAction={() => { 
          closeModal("emptyTutorials"); 
          router.push("/create-tutorial?from=experience&step=2"); 
        }}
      />
      </div>
    </>
  );
};

export default CustomiseFeaturesStep;
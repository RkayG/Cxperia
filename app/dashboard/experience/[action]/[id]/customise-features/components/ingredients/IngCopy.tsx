//import { useIngredients } from '../../../../../hooks/useFeatureApi';
//import React, { useState, useMemo } from "react";
//import Modal from "../../../../../components/common/Modal";
//import { X, Edit3, AlertTriangle, TestTubeIcon, TestTube2Icon } from "lucide-react";
//import QuickAddIngredients from "./QuickAddIngredients";
//
//interface IngredientModalProps {
//  isOpen: boolean;
//  onClose: () => void;
//  initialProductName?: string;
//  initialIngredients?: Ingredient[];
//  onSave: (productName: string, ingredients: Ingredient[]) => void;
//  experienceId?: string; // Added experienceId prop
//}
//
//import {
//  updateIngredient as apiUpdateIngredient,
//  deleteIngredient as apiDeleteIngredient,
//  addIngredients,
//} from "../../../../../services/featureService";
//
//const IngredientModal: React.FC<IngredientModalProps> = ({
//  isOpen,
//  onClose,
//  initialProductName = "",
//  initialIngredients = [],
//  onSave,
//}) => {
//  const [productName, _setProductName] = useState(initialProductName);
//  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
//  // Fetch ingredients for the experience and preset if found
//  const { data: fetchedIngredients } = useIngredients(experienceId || undefined);
//  React.useEffect(() => {
//    if (fetchedIngredients && Array.isArray(fetchedIngredients.data)) {
//      const mapped = fetchedIngredients.data.map((ing: any) => ({
//        id: String(ing.id || ing._id || ''),
//        inciName: ing.inci_name || ing.inciName || '',
//        commonName: ing.common_name || ing.commonName || '',
//        concentration: ing.concentration || '',
//        isAllergen: !!ing.is_allergen,
//        category: ing.category || '',
//        all_functions: ing.all_functions || [],
//        selectedFunction: ing.function || ing.func || undefined,
//      }));
//      setIngredients(mapped);
//    }
//  }, [fetchedIngredients]);
//  const [editingIngredientId, setEditingIngredientId] = useState<string | null>(
//    null
//  );
//  const [_showQuickAdd, setShowQuickAdd] = useState(false);
//  // ...existing code...
//  const [saving, setSaving] = useState(false);
//  // For delete confirmation modal
//  const [deleteId, setDeleteId] = useState<string | null>(null);
//
//  // Derived state for summary
//  const totalIngredients = ingredients.length;
//  const allergens = ingredients.filter((ing) => ing.isAllergen).length;
//  const withConcentration = ingredients.filter((ing) =>
//    ing.concentration.trim()
//  ).length;
//  const status =
//    totalIngredients > 0
//      ? ingredients.some((ing) => ing.inciName.trim() === "")
//        ? "Incomplete"
//        : "Complete"
//      : "Empty";
//
//  // Memoized value for the ingredient being edited
//  const editingIngredient = useMemo(() => {
//    return ingredients.find((ing) => ing.id === editingIngredientId);
//  }, [ingredients, editingIngredientId]);
//
//  const handleAddIngredient = (ingredient: any) => {
//    console.log("Full backend ingredient data:", ingredient);
//    // Map backend ingredient fields to local Ingredient type
//    const newIngredient = {
//      id:
//        ingredient.id ||
//        `tmp-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
//      inciName: ingredient.inci_name || "",
//      commonName: ingredient.common_name || "",
//      concentration: "",
//      isAllergen: ingredient.is_allergen || false,
//      category: ingredient.category || "",
//      all_functions: ingredient.all_functions || [],
//    };
//    console.log("Adding ingredient:", newIngredient);
//    // Always add locally; persistence to backend happens on Save
//    setIngredients((prev) => [...prev, newIngredient]);
//    setEditingIngredientId(null);
//    setShowQuickAdd(false);
//  };
//
//  const handleUpdateIngredient = (updatedIngredient: Ingredient) => {
//    (async () => {
//      if (experienceId && updatedIngredient.id) {
//        try {
//          const res: any = await apiUpdateIngredient(
//            String(experienceId),
//            String(updatedIngredient.id),
//            {
//              inci_name: updatedIngredient.inciName,
//              common_name: updatedIngredient.commonName,
//              category: updatedIngredient.category,
//              all_functions: updatedIngredient.all_functions,
//              is_allergen: updatedIngredient.isAllergen,
//              concentration: updatedIngredient.concentration || null,
//            }
//          );
//          if (res && res.data) {
//            const u = res.data;
//            const updatedServer: Ingredient = {
//              id: String(u.id || u._id || updatedIngredient.id),
//              inciName: u.inci_name || u.inciName || updatedIngredient.inciName,
//              commonName:
//                u.common_name || u.commonName || updatedIngredient.commonName,
//              concentration:
//                u.concentration || updatedIngredient.concentration || "",
//              isAllergen:
//                u.is_allergen ||
//                u.isAllergen ||
//                updatedIngredient.isAllergen ||
//                false,
//              category: u.category || updatedIngredient.category || "",
//              all_functions:
//                u.all_functions || updatedIngredient.all_functions || [],
//            };
//            setIngredients((prev) =>
//              prev.map((ing) =>
//                ing.id === updatedIngredient.id ? updatedServer : ing
//              )
//            );
//          } else {
//            setIngredients((prev) =>
//              prev.map((ing) =>
//                ing.id === updatedIngredient.id ? updatedIngredient : ing
//              )
//            );
//          }
//        } catch (e) {
//          console.warn(
//            "Failed to update ingredient via API, updating local state",
//            e
//          );
//          setIngredients((prev) =>
//            prev.map((ing) =>
//              ing.id === updatedIngredient.id ? updatedIngredient : ing
//            )
//          );
//        }
//      } else {
//        setIngredients((prev) =>
//          prev.map((ing) =>
//            ing.id === updatedIngredient.id ? updatedIngredient : ing
//          )
//        );
//      }
//    })();
//    setEditingIngredientId(null); // Exit editing mode after update
//  };
//
//  const handleDeleteIngredient = (id: string) => {
//    setDeleteId(id);
//  };
//
//  const confirmDeleteIngredient = async () => {
//    if (!deleteId) return;
//    const id = deleteId;
//    setDeleteId(null);
//    (async () => {
//      if (experienceId && id) {
//        try {
//          await apiDeleteIngredient(String(experienceId), String(id));
//          setIngredients((prev) => prev.filter((ing) => ing.id !== id));
//        } catch (e) {
//          console.warn(
//            "Failed to delete ingredient via API, falling back to local remove",
//            e
//          );
//          setIngredients((prev) => prev.filter((ing) => ing.id !== id));
//        }
//      } else {
//        setIngredients((prev) => prev.filter((ing) => ing.id !== id));
//      }
//    })();
//    setEditingIngredientId(null); // Exit editing mode after delete
//  };
//
//  type QuickAddIngredientType = {
//    inci_name?: string;
//    common_name?: string;
//    is_allergen?: boolean;
//    category?: string;
//    all_functions?: string[];
//    id?: string;
//  };
//
//  const handleQuickAddIngredient = (name: string | QuickAddIngredientType) => {
//    let ingredientObj;
//    if (typeof name === "string") {
//      ingredientObj = {
//        inci_name: name,
//        common_name: name,
//        is_allergen: false,
//        category: "",
//        all_functions: [],
//        id: "",
//      };
//    } else {
//      // Preserve all fields from the ingredient object if present
//      ingredientObj = {
//        ...name,
//        inci_name: name.inci_name || "",
//        common_name: name.common_name || "",
//        is_allergen: !!name.is_allergen,
//        category: name.category || "",
//        all_functions: name.all_functions || [],
//        id: name.id || "",
//      };
//    }
//    // Check if ingredient already exists to avoid duplicates
//    const existing = ingredients.find(
//      (ing) =>
//        ing.inciName.toLowerCase() === ingredientObj.inci_name.toLowerCase()
//    );
//    if (!existing) {
//      handleAddIngredient(ingredientObj);
//      setShowQuickAdd(false); // Always return to list view after quick add
//    }
//  };
//
//  const handleSave = async () => {
//    if (ingredients.length === 0) {
//      // Do not call onSave if no ingredients
//      setSaving(false);
//      onClose();
//      return;
//    }
//    const snapshot = ingredients;
//    // optimistic UI: mark saving and give temporary ids if missing
//    const optimistic = ingredients.map((ing, i) => ({
//      ...ing,
//      id: ing.id || `tmp-${Date.now()}-${i}`,
//    }));
//    setIngredients(optimistic);
//    setSaving(true);
//
//    if (experienceId) {
//      console.log("Saving ingredients for experience:", experienceId);
//      try {
//        const payload = optimistic.map((ing) => ({
//          // core associations
//          experience_id: experienceId,
//          product_id: productId || undefined,
//          // ingredient fields (send both INCI and UI fields)
//          inci_name: ing.inciName || undefined,
//          common_name: ing.commonName || undefined,
//          category: ing.category || undefined,
//          // selected function (single) and all_functions (array) - backend may use one
//          function:
//            ing.selectedFunction ||
//            (Array.isArray(ing.all_functions)
//              ? ing.all_functions[0]
//              : ing.all_functions || undefined),
//          all_functions: Array.isArray(ing.all_functions)
//            ? ing.all_functions
//            : ing.all_functions
//            ? [ing.all_functions]
//            : undefined,
//          selectedFunction: ing.selectedFunction || undefined,
//          concentration: ing.concentration || undefined,
//          is_allergen: !!ing.isAllergen,
//          // include client id if present (useful for correlation)
//          client_id: ing.id || undefined,
//          id: ing.id || undefined,
//        }));
//
//        // Use new bulk API
//        const res: any = await addIngredients(payload);
//        if (res && res.data) {
//          const rows = Array.isArray(res.data) ? res.data : res.data.data || [];
//          const mapped: Ingredient[] = (rows || []).map((r: any) => ({
//            id: String(r.id || r._id || ""),
//            inciName: r.inci_name || r.inciName || "",
//            commonName: r.common_name || r.commonName || "",
//            concentration: r.concentration || "",
//            isAllergen: !!r.is_allergen,
//            category: r.category || "",
//            all_functions: r.all_functions || [],
//            selectedFunction: r.function || r.func || undefined,
//          }));
//          setIngredients(mapped);
//          onSave(productName, mapped);
//          setSaving(false);
//          onClose();
//          return;
//        }
//      } catch (err) {
//        console.error(
//          "Bulk save failed, reverting optimistic ingredients",
//          err
//        );
//        setIngredients(snapshot);
//        setSaving(false);
//        // Optionally show a toast/error UI here
//        return;
//      }
//    }
//
//    // Fallback: save locally
//    setSaving(false);
//    onSave(productName, ingredients);
//    onClose();
//  };
//
//  // Disable background scrolling when modal is open (cross-browser reliable)
//  React.useEffect(() => {
//    if (isOpen) {
//      document.body.style.overflow = 'hidden';
//    } else {
//      document.body.style.overflow = '';
//    }
//    return () => {
//      document.body.style.overflow = '';
//    };
//  }, [isOpen]);
//  // Move the conditional return AFTER all hook calls
//  if (!isOpen) return null;
//
//  return (
//    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-2 lg:p-4">
//      {/* Delete Confirmation Modal */}
//      <Modal
//        open={!!deleteId}
//        title="Delete Ingredient"
//        description="Are you sure you want to delete this ingredient?"
//        confirmText="Delete"
//        color="#EF4444"
//        onConfirm={confirmDeleteIngredient}
//        onCancel={() => setDeleteId(null)}
//      />
//      <div className="relative bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full  sm:max-w-2xl lg:max-w-7xl max-h-[95vh] flex flex-col transform transition-all duration-300 scale-95 animate-scale-in">
//        {/* Header */}
//        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-100 rounded-t-xl lg:rounded-t-2xl">
//          <div className="flex items-center gap-2 lg:gap-3">
//            <div className=" p-1.5 lg:p-2 rounded-md lg:rounded-lg">
//              <TestTubeIcon size={20} className="text-purple-600" />
//            </div>
//            <div>
//              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 text-left">
//                HydraGlow
//              </h2>
//              <p className="text-xs lg:text-sm text-gray-600 hidden sm:block">
//                Manage your product's ingredient information
//              </p>
//            </div>
//          </div>
//          <button
//            onClick={onClose}
//            className="p-1.5 lg:p-2 rounded-full bg-white text-gray-600 hover:bg-purple-600 hover:text-white p-2 rounded-xl transition-all duration-200 group"
//            aria-label="Close modal"
//          >
//            <X
//              size={20}
//              className="group-hover:rotate-90 transition-transform duration-200"
//            />
//          </button>
//        </div>
//
//        {/* Content Area - Responsive Layout */}
//        <div className="flex overflow-hidden">
//          {/* Main Panel - Ingredients List (Full width on mobile, left panel on desktop) */}
//          <div className=" overflow-y-auto p-4 lg:p-6 lg:border-r lg:border-gray-100">
//            {/* Quick Actions */}
//            <div className="mb-4 lg:mb-6">
//              <QuickAddIngredients onAddIngredient={handleQuickAddIngredient} />
//            </div>
//
//            {/* Ingredients List */}
//            <div className="mb-4 lg:mb-6">
//              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
//                <h3 className="text-base lg:text-lg font-semibold text-gray-800 flex items-center gap-2">
//                  <TestTubeIcon size={18} className="text-gray-600" />
//                  <span className="hidden sm:inline">
//                    Ingredients List (INCI Format)
//                  </span>
//                  <span className="sm:hidden">Ingredients</span>
//                </h3>
//                {ingredients.length > 0 && (
//                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full self-start sm:self-center">
//                    {ingredients.length} ingredient
//                    {ingredients.length !== 1 ? "s" : ""}
//                  </span>
//                )}
//              </div>
//
//              {/* Empty State */}
//              {ingredients.length === 0 && (
//                <div className="text-center py-8 lg:py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
//                  <TestTube2Icon
//                    size={40}
//                    className="text-yellow-600 mx-auto mb-3 lg:mb-4"
//                  />
//                  <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">
//                    No ingredients added yet
//                  </h3>
//                  <p className="text-sm lg:text-base text-gray-600 px-4">
//                    Start by using the search bar above.
//                  </p>
//                </div>
//              )}
//
//              {/* Ingredients Grid */}
//           {ingredients.length > 0 && (
//  <div className="space-y-3 lg:space-y-4">
//    <div className="grid grid-cols-12 gap-2 px-4 text-xs font-semibold text-gray-500 uppercase">
//      <div className="col-span-1">#</div>
//      <div className="col-span-4">Ingredient</div>
//      <div className="col-span-3">Function</div>
//      <div className="col-span-2">Concentration</div>
//      <div className="col-span-2 text-right">Status</div>
//    </div>
//    
//    {ingredients.map((ing, index) => (
//      <div
//        key={ing.id || `${ing.inciName}-${ing.category}-${index}`}
//        className={`group relative grid grid-cols-12 gap-2 items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer
//          ${
//            editingIngredientId === ing.id
//              ? "border-purple-500 bg-purple-50 shadow-md"
//              : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm"
//          }
//        `}
//        onClick={() => setEditingIngredientId(ing.id)}
//      >
//        {/* Number */}
//        <div className="col-span-1">
//          <div className="bg-purple-100 text-purple-700 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
//            {index + 1}
//          </div>
//        </div>
//        
//        {/* Ingredient Info */}
//        <div className="col-span-4">
//          <div className="flex items-center gap-2 mb-1">
//            <h4 className="font-semibold text-gray-900 truncate">
//              {ing.inciName}
//            </h4>
//            {ing.isAllergen && (
//              <div className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 flex-shrink-0">
//                <AlertTriangle size={12} />
//                <span>Allergen</span>
//              </div>
//            )}
//          </div>
//          <p className="text-gray-600 text-sm truncate">
//            {ing.commonName}
//          </p>
//          {ing.category && (
//            <span className="inline-block mt-1 px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs">
//              {ing.category}
//            </span>
//          )}
//        </div>
//        
//        {/* Function */}
//        <div className="col-span-3">
//          <p className="text-sm text-gray-700 line-clamp-2">
//            {ing.selectedFunction
//              ? ing.selectedFunction
//              : ing.all_functions &&
//                (Array.isArray(ing.all_functions)
//                  ? ing.all_functions.join(", ")
//                  : ing.all_functions)}
//          </p>
//        </div>
//        
//        {/* Concentration */}
//        <div className="col-span-2">
//          {ing.concentration ? (
//            <div className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full text-center">
//              {ing.concentration}
//            </div>
//          ) : (
//            <span className="text-gray-400 text-sm">Not specified</span>
//          )}
//        </div>
//        
//        {/* Edit Action */}
//        <div className="col-span-2 flex justify-end">
//          <button 
//            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
//            onClick={(e) => {
//              e.stopPropagation();
//              setEditingIngredientId(ing.id);
//            }}
//          >
//            <Edit3 size={16} />
//            <span className="text-sm font-medium">Edit</span>
//          </button>
//        </div>
//      </div>
//    ))}
//  </div>
//)}
//            </div>
//          </div>
//
//          {/* Side Panel - Form and Summary (Hidden on mobile when not editing, side panel on desktop) */}
//          <div
//            className={`${
//              editingIngredientId === null ? "hidden lg:block" : "block"
//            } w-full lg:w-1/3 lg:min-w-[600px] overflow-y-auto p-4 lg:p-6 bg-gray-50 ${
//              editingIngredientId !== null
//                ? "border-t lg:border-t-0 lg:border-l border-gray-100"
//                : ""
//            }`}
//          >
//            {/* Mobile back button */}
//            {editingIngredientId !== null && (
//              <button
//                onClick={() => setEditingIngredientId(null)}
//                className="lg:hidden mb-4 flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
//              >
//                ← Back to ingredients
//              </button>
//            )}
//
//            {/* Form Section */}
//          {/*   <div className="mb-4 lg:mb-6">
//              <IngredientForm
//                key={editingIngredientId || "new"} // Key changes to force remount for new/edit
//                ingredient={editingIngredient}
//                onAdd={handleAddIngredient}
//                onUpdate={handleUpdateIngredient}
//                onDelete={handleDeleteIngredient}
//                isEditing={!!editingIngredientId}
//                onExitEdit={() => setEditingIngredientId(null)}
//              />
//            </div> */}
//
//            {/* Summary Section */}
//            {/* <div className="sticky top-0">
//              <IngredientSummary
//                totalIngredients={totalIngredients}
//                allergens={allergens}
//                withConcentration={withConcentration}
//                status={status}
//              />
//            </div> */}
//          </div>
//        </div>
//
//        {/* Footer */}
//        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 lg:p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl lg:rounded-b-2xl gap-3 sm:gap-0">
//          <div className="text-xs lg:text-sm text-gray-600 order-2 sm:order-1">
//            <p className="sm:mb-1">
//              • Required fields marked with text-left asterisk (*)
//            </p>
//            <p className="hidden sm:block">
//              • Ingredients will be displayed to customers in INCI format
//            </p>
//          </div>
//          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 order-1 sm:order-2">
//            <button
//              onClick={onClose}
//              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-700 font-medium rounded-lg sm:rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
//            >
//              Cancel
//            </button>
//            <button
//              onClick={handleSave}
//              disabled={ingredients.length === 0 || saving}
//              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600 text-white font-medium rounded-lg sm:rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-sm sm:text-base"
//            >
//              {saving ? "Saving..." : "Save Changes"}
//            </button>
//          </div>
//        </div>
//      </div>
//    </div>
//  );
//};
//
//export default IngredientModal;
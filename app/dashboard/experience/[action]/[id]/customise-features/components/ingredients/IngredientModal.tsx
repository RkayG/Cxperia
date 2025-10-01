import Modal from "@/components/Modal";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIngredients } from '@/hooks/brands/useFeatureApi';
import type { Ingredient } from "@/types/ingredientTypes";
import {
  Edit3,
  TestTube2Icon,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import IngredientSummary from "./IngredientSummary";
import QuickAddIngredients from "./QuickAddIngredients";
import { useAddIngredient, useDeleteIngredient } from '@/hooks/brands/useFeatureApi';
import { showToast } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductName?: string;
  initialIngredients?: Ingredient[];
  onSave: (productName: string, ingredients: Ingredient[]) => void;
  experienceId?: string;
  onFeatureEnable?: () => void;
}

const IngredientModal: React.FC<IngredientModalProps> = ({
  isOpen,
  onClose,
  initialProductName = "",
  initialIngredients = [],
  onSave,
  experienceId,
  onFeatureEnable,
}) => {
  const [productName, _setProductName] = useState(initialProductName);
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const { data: fetchedIngredients } = useIngredients(experienceId || undefined);
  const addIngredientsMutation = useAddIngredient(experienceId || '');
  const [editingIngredientId, setEditingIngredientId] = useState<string | null>(null);
  const [_showQuickAdd, setShowQuickAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [inlineEdit, setInlineEdit] = useState<{id: string, field: 'commonName'|'category'|'concentration'|null} | null>(null);
  const [inlineValue, setInlineValue] = useState<string>('');

  // Skeleton component for ingredient table
  const IngredientTableSkeleton = () => (
    <div className="mt-6 bg-white text-purple-700 rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-7 gap-4">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 border-b border-gray-100 last:border-b-0">
          <div className="grid grid-cols-7 gap-4 items-center">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (fetchedIngredients && Array.isArray(fetchedIngredients.data)) {
      const mapped = fetchedIngredients.data.map((ing: any) => ({
        id: String(ing.id || ing._id || ''),
        inciName: ing.inci_name || ing.inciName || '',
        commonName: ing.common_name || ing.commonName || '',
        concentration: ing.concentration || '',
        isAllergen: !!ing.is_allergen,
        category: ing.category || '',
        all_functions: Array.isArray(ing.all_functions)
          ? ing.all_functions
          : typeof ing.all_functions === 'string' && ing.all_functions.length > 0
            ? ing.all_functions.split(';').map((s: string) => s.trim()).filter(Boolean)
            : [],
        selectedFunction: ing.function || ing.func || undefined,
      }));
      setIngredients(mapped);
      console.log("Fetched and mapped ingredients:", mapped);
    }
  }, [fetchedIngredients]);
 console.log(ingredients)
  // Derived state for summary
  const totalIngredients = ingredients.length;
  const allergens = ingredients.filter((ing) => ing.isAllergen).length;
  const withConcentration = ingredients.filter((ing) =>
    ing.concentration.trim()
  ).length;
  const status =
    totalIngredients > 0
      ? ingredients.some((ing) => ing.inciName.trim() === "")
        ? "Incomplete"
        : "Complete"
      : "Empty";

  // Inline edit handlers
  const startInlineEdit = (id: string, field: 'commonName'|'category'|'concentration', value: string) => {
    setInlineEdit({id, field});
    setInlineValue(value);
  };

  const saveInlineEdit = () => {
    if (inlineEdit && inlineEdit.field) {
      const field = String(inlineEdit.field);
      setIngredients((prev) => prev.map((ing) => {
        if (ing.id === inlineEdit.id) {
          return {
            ...ing,
            [field]: inlineValue,
          };
        }
        return ing;
      }));
      setInlineEdit(null);
      setInlineValue('');
    }
  };

  const cancelInlineEdit = () => {
    setInlineEdit(null);
    setInlineValue('');
  };

  const handleAddIngredient = (ingredient: any) => {
    console.log("Full backend ingredient data:", ingredient);
    const newIngredient = {
      id:
        ingredient.id ||
        `tmp-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      inciName: ingredient.inci_name || "",
      commonName: ingredient.common_name || "",
      concentration: "",
      isAllergen: ingredient.is_allergen || false,
      category: ingredient.category || "",
      all_functions: ingredient.all_functions || [],
    };
    console.log("Adding ingredient:", newIngredient);
    setIngredients((prev) => [...prev, newIngredient]);
    setEditingIngredientId(null);
    setShowQuickAdd(false);
  };

  const handleDeleteIngredient = (id: string) => {
    setDeleteId(id);
  };

  const confirmDeleteIngredient = async () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    (async () => {
      if (experienceId && id) {
        try {
          await useDeleteIngredient(String(experienceId), String(id));
          setIngredients((prev) => prev.filter((ing) => ing.id !== id));
        } catch (e) {
          console.warn(
            "Failed to delete ingredient via API, falling back to local remove",
            e
          );
          setIngredients((prev) => prev.filter((ing) => ing.id !== id));
        }
      } else {
        setIngredients((prev) => prev.filter((ing) => ing.id !== id));
      }
    })();
    setEditingIngredientId(null);
  };

  type QuickAddIngredientType = {
    inci_name?: string;
    common_name?: string;
    is_allergen?: boolean;
    category?: string;
    all_functions?: string[];
    id?: string;
  };

  const handleQuickAddIngredient = (name: string | QuickAddIngredientType) => {
    let ingredientObj;
    if (typeof name === "string") {
      ingredientObj = {
        inci_name: name,
        common_name: name,
        is_allergen: false,
        category: "",
        all_functions: [],
        id: "",
      };
    } else {
      ingredientObj = {
        ...name,
        inci_name: name.inci_name || "",
        common_name: name.common_name || "",
        is_allergen: !!name.is_allergen,
        category: name.category || "",
        all_functions: name.all_functions || [],
        id: name.id || "",
      };
    }
    const existing = ingredients.find(
      (ing) =>
        ing.inciName.toLowerCase() === ingredientObj.inci_name.toLowerCase()
    );
    if (!existing) {
      handleAddIngredient(ingredientObj);
      setShowQuickAdd(false);
    }
  };

  const handleSave = async () => {
    if (ingredients.length === 0) {
      setSaving(false);
      // Enable the feature even if no ingredients (user opened modal)
      if (onFeatureEnable) {
        onFeatureEnable();
      }
      onClose();
      return;
    }
    const snapshot = ingredients;
    const optimistic = ingredients.map((ing, i) => ({
      ...ing,
      id: ing.id || `tmp-${Date.now()}-${i}`,
    }));
    setIngredients(optimistic);
    setSaving(true);

    if (experienceId) {
      console.log("Saving ingredients for experience:", experienceId);
      try {
        const payload = optimistic.map((ing) => ({
          experience_id: experienceId,
          inci_name: ing.inciName || undefined,
          common_name: ing.commonName || undefined,
          category: ing.category || undefined,
          function:
            ing.selectedFunction ||
            (Array.isArray(ing.all_functions)
              ? ing.all_functions[0]
              : ing.all_functions || undefined),
          all_functions: Array.isArray(ing.all_functions)
            ? ing.all_functions
            : ing.all_functions
            ? [ing.all_functions]
            : undefined,
          selectedFunction: ing.selectedFunction || undefined,
          concentration: ing.concentration || undefined,
          is_allergen: !!ing.isAllergen,
          client_id: ing.id || undefined,
          id: ing.id || undefined,
        }));

        const res: any = await addIngredientsMutation.mutateAsync({ experienceId, payload });
        if (res && res.data) {
          const rows = Array.isArray(res.data) ? res.data : res.data.data || [];
          const mapped: Ingredient[] = (rows || []).map((r: any) => ({
            id: String(r.id || r._id || ""),
            inciName: r.inci_name || r.inciName || "",
            commonName: r.common_name || r.commonName || "",
            concentration: r.concentration || "",
            isAllergen: !!r.is_allergen,
            category: r.category || "",
            all_functions: r.all_functions || [],
            selectedFunction: r.function || r.func || undefined,
          }));
          setIngredients(mapped);
          onSave(productName, mapped);
          // Enable the feature after successful save
          if (onFeatureEnable) {
            onFeatureEnable();
          }
          showToast.success("Ingredients saved successfully! 🎉");
          setSaving(false);
          onClose();
          return;
        }
      } catch (err) {
        console.error(
          "Bulk save failed, reverting optimistic ingredients",
          err
        );
        showToast.error("Failed to save ingredients. Please try again.");
        setIngredients(snapshot);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    onSave(productName, ingredients);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteId}
        title="Delete Ingredient"
        description="Are you sure you want to delete this ingredient?"
        confirmText="Delete"
        color="#EF4444"
        onConfirm={confirmDeleteIngredient}
        onCancel={() => setDeleteId(null)}
      />
      
      <Drawer open={isOpen} onOpenChange={onClose} shouldScaleBackground>
        <DrawerContent className="bg-gray-50 max-w-screen-lg min-h-[95vh] max-h-[90vh]  mx-auto">
          <DrawerHeader>
            <div className="flex -mt-4 items-center gap-2 lg:gap-3 pl-2">
              
              <div>
                <DrawerTitle className='text-xl font-semibold text-left text-black'>{productName} Ingredients</DrawerTitle>
                <DrawerDescription>Manage your product's ingredient information</DrawerDescription>
              </div>
            </div>
             <DrawerClose asChild>
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 rounded-xl text-gray-600 hover:bg-purple-600 hover:text-white hover:rotate-90 transition-all duration-200 group"
                aria-label="Close modal"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </DrawerClose>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto lg:px-6">
            <QuickAddIngredients onAddIngredient={handleQuickAddIngredient} />
            {fetchedIngredients ? (
              <div className="mt-6 bg-white text-purple-700 rounded-xl border border-gray-200 overflow-hidden">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-8 text-purple-800">#</TableHead>
                    <TableHead className="text-purple-800">INCI Name</TableHead>
                    <TableHead className="text-purple-800">Common Name</TableHead>
                    <TableHead className="text-purple-800">Category</TableHead>
                    <TableHead className="text-purple-800">Function</TableHead>
                    <TableHead className="text-center text-purple-800">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="cursor-help">Conc.</span>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <div className="text-sm font-semibold mb-1">Concentration</div>
                          <div className="text-xs text-muted-foreground">The percentage or amount of this ingredient in the product. You can edit this value inline.</div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableHead>
                    <TableHead className="text-center text-purple-800">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="cursor-help">Allergen</span>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <div className="text-sm font-semibold mb-1">Allergen</div>
                          <div className="text-xs text-muted-foreground ">Indicates if this ingredient is a known allergen. This is set based on ingredient data.</div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 lg:py-12 bg-gray-50 rounded-xl mt-4">
                        <TestTube2Icon size={40} className="text-yellow-600 mx-auto mb-3 lg:mb-4" />
                        <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No ingredients added yet</h3>
                        <p className="text-sm lg:text-base text-gray-600 px-4">Start by using the search bar above.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    ingredients.map((ing, index) => (
                      <TableRow 
                        key={ing.id || `${ing.inciName}-${ing.category}-${index}`}
                        className={editingIngredientId === ing.id ? "bg-purple-50" : "bg-white hover:bg-gray-50"}
                      >
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {ing.inciName}
                          </div>
                        </TableCell>
                        <TableCell>{ing.commonName}</TableCell>
                        <TableCell>{ing.category}</TableCell>
                        <TableCell>
                          {Array.isArray(ing.all_functions) && ing.all_functions.length > 0
                            ? ing.all_functions.join(", ")
                            : (typeof ing.all_functions === 'string' && ing.all_functions)
                              ? ing.all_functions
                              : ing.selectedFunction || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {inlineEdit && inlineEdit.id === ing.id && inlineEdit.field === 'concentration' ? (
                            <div className="flex items-center gap-2 justify-center">
                              <input
                                type="text"
                                value={inlineValue}
                                onChange={e => setInlineValue(e.target.value)}
                                className="border rounded px-2 py-1 w-20 text-center"
                                autoFocus
                              />
                              <button onClick={saveInlineEdit} className="text-green-600 px-1">Save</button>
                              <button onClick={cancelInlineEdit} className="text-gray-400 px-1">Cancel</button>
                              <button onClick={() => handleDeleteIngredient(ing.id)} className="text-red-600 px-1" title="Delete ingredient">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 justify-center">
                              <span>{ing.concentration}</span>
                              <button
                                onClick={() => startInlineEdit(ing.id, 'concentration', ing.concentration)}
                                className="text-purple-600 px-1"
                                title="Edit concentration"
                              >
                                <Edit3 size={16} />
                              </button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {ing.isAllergen ? (
                            <span className="text-red-600 font-bold">Yes</span>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              </div>
            ) : (
              <IngredientTableSkeleton />
            )}
          </div>

          <DrawerFooter className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-t border-gray-100 bg-gray-50 rounded-b-xl lg:rounded-b-2xl gap-3 sm:gap-0">
            <IngredientSummary 
              totalIngredients={totalIngredients}
              allergens={allergens}
              withConcentration={withConcentration}
              status={status}
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 order-1 sm:order-2">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-4 sm:px-6 py-2 bg-white text-gray-700 font-medium rounded-lg sm:rounded-xl border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={ingredients.length === 0 || saving}
                className="px-4 sm:px-6 py-2 bg-purple-800 text-white font-medium rounded-lg sm:rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-sm sm:text-base flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default IngredientModal;
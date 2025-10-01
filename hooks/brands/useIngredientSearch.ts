import { useState, useEffect, useRef, useCallback } from 'react';

const commonIngredients = [
  'Aqua', 'Glycerin', 'Cetyl Alcohol', 'Sodium Hyaluronate', 'Tocopherol',
  'Retinol', 'Niacinamide', 'Linalool', 'Limonene'
];

// Global cache for ingredient search results
const ingredientCache = new Map<string, { ingredients: string[], timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Debounce utility
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useIngredientSearch(searchTerm: string) {
  const [ingredients, setIngredients] = useState<string[]>(commonIngredients);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Debounce search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const searchIngredients = useCallback(async (term: string) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check cache first
    const cacheKey = term.toLowerCase();
    const cached = ingredientCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      setIngredients(cached.ingredients);
      setLoading(false);
      setError(null);
      return;
    }

    if (!term) {
      setIngredients(commonIngredients);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `/api/inci-ingredients?search=${encodeURIComponent(term)}&limit=20`,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch ingredients');
      }

      const data = await response.json();
      
      if (Array.isArray(data.ingredients)) {
        const ingredientNames = data.ingredients.map((ing: any) => ing.inci_name || ing.common_name || '');
        
        // Cache the results
        ingredientCache.set(cacheKey, {
          ingredients: ingredientNames,
          timestamp: Date.now()
        });
        
        setIngredients(ingredientNames);
      } else {
        setIngredients([]);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }
      setError('Error fetching ingredients');
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    searchIngredients(debouncedSearchTerm);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearchTerm, searchIngredients]);

  return { ingredients, loading, error };
}

import { useState, useEffect } from 'react';

const commonIngredients = [
  'Aqua', 'Glycerin', 'Cetyl Alcohol', 'Sodium Hyaluronate', 'Tocopherol',
  'Retinol', 'Niacinamide', 'Linalool', 'Limonene'
];

export function useIngredientSearch(searchTerm: string) {
  const [ingredients, setIngredients] = useState<string[]>(commonIngredients);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchTerm) {
      setIngredients(commonIngredients);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/inci-ingredients?search=${encodeURIComponent(searchTerm)}&limit=10`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch ingredients');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data.ingredients)) {
          setIngredients(data.ingredients.map((ing: any) => ing.inci_name || ing.common_name || ''));
        } else {
          setIngredients([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching ingredients');
        setIngredients([]);
        setLoading(false);
      });
  }, [searchTerm]);

  return { ingredients, loading, error };
}

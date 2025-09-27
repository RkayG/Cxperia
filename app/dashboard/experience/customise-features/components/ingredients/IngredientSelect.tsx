import axios from 'axios';
import React, { useState, useEffect } from 'react';

interface Ingredient {
  id: string;
  inci_name: string;
  common_name: string;
  category: string;
}

interface IngredientSelectProps {
  onSelect: (ingredient: Ingredient) => void;
  category?: string;
}

const IngredientSelect: React.FC<IngredientSelectProps> = ({ onSelect, category }) => {
  const [search, setSearch] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let cancel: any;
    setLoading(true);
    axios.get('/ingredients', {
      params: {
        search,
        category,
        page,
        limit: 20
      },
      cancelToken: new axios.CancelToken(c => cancel = c)
    })
      .then(res => {
        if (page === 1) {
          setIngredients(res.data.ingredients);
        } else {
          setIngredients(prev => [...prev, ...res.data.ingredients]);
        }
        setHasMore(res.data.ingredients.length === 20);
        setLoading(false);
      })
      .catch(e => {
        if (axios.isCancel(e)) return;
        setLoading(false);
      });
    return () => cancel && cancel();
  }, [search, category, page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSelect = (ingredient: Ingredient) => {
    onSelect(ingredient);
  };

  const loadMore = () => {
    if (hasMore && !loading) setPage(p => p + 1);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search ingredients..."
        value={search}
        onChange={handleSearch}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <ul style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #eee', padding: 0 }}>
        {ingredients && ingredients.map(ing => (
          <li key={ing.id} style={{ padding: 8, cursor: 'pointer' }} onClick={() => handleSelect(ing)}>
            <strong>{ing.inci_name}</strong> {ing.common_name && <>({ing.common_name})</>} <span style={{ color: '#888' }}>{ing.category}</span>
          </li>
        ))}
        {hasMore && !loading && (
          <li style={{ textAlign: 'center', padding: 8 }}>
            <button onClick={loadMore}>Load More</button>
          </li>
        )}
        {loading && <li style={{ textAlign: 'center', padding: 8 }}>Loading...</li>}
      </ul>
    </div>
  );
};

export default IngredientSelect;

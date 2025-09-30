// src/components/ProductGrid.tsx
import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  image: string;
  title: string;
  description: string;
  tag?: string; // Optional tag like "Perfect Match!"
}

const products: Product[] = [
  {
    image: 'https://placehold.co/200x150/f0e68c/333?text=Pore+Mask',
    title: 'Pore Purify Mask',
    description: 'Minimizes pores and controls oil.',
  },
  {
    image: 'https://placehold.co/200x150/add8e6/333?text=HydraBoost+Serum',
    title: 'HydraBoost Serum',
    description: 'Deep hydration for sensitive skin.',
    tag: 'Perfect Match!',
  },
  {
    image: 'https://placehold.co/200x150/dda0dd/333?text=Radiance+C+Serum',
    title: 'Radiance C Serum',
    description: 'Boosts glow and evens tone.',
  },
  {
    image: 'https://placehold.co/200x150/d3d3d3/333?text=Age+Reverse+Cream',
    title: 'Age Reverse Cream',
    description: 'Reduces fine lines and wrinkles.',
  },
];

const ProductGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          image={product.image}
          title={product.title}
          description={product.description}
          tag={product.tag}
        />
      ))}
    </div>
  );
};

export default ProductGrid;

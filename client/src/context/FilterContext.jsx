import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [category, setCategory] = useState('All');
  const [subCategory, setSubCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState('newest');

  const resetFilters = () => {
    setCategory('All');
    setSubCategory('All');
    setSelectedSize('');
    setSearchQuery('');
    setPriceRange({ min: 0, max: 10000 });
    setSortBy('newest');
  };

  return (
    <FilterContext.Provider
      value={{
        category,
        setCategory,
        subCategory,
        setSubCategory,
        selectedSize,
        setSelectedSize,
        searchQuery,
        setSearchQuery,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

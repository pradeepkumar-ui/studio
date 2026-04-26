import { useState, useMemo } from "react";

export interface FilterConfig<T> {
  searchFields: (keyof T)[];          
  filterFields: Partial<Record<keyof T, string>>; 
}

export function useTableFilters<T>(data: T[], config: FilterConfig<T>) {
  const [searchText, setSearchText] = useState("");
  const [activeFilters, setActiveFilters] = useState<Partial<Record<keyof T, string>>>({});

  const filtered = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch =
        !searchText ||
        config.searchFields.some((field) => {
          const val = row[field];
          return String(val ?? "").toLowerCase().includes(searchText.toLowerCase());
        });

      const matchesFilters = Object.entries(activeFilters).every(([key, val]) => {
        if (!val || val === "All") return true;
        const rowVal = row[key as keyof T];
        if (Array.isArray(rowVal)) return rowVal.includes(val as never);
        return String(rowVal) === val;
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, searchText, activeFilters, config]);

  const setFilter = (key: keyof T, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const removeFilter = (key: keyof T) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearAll = () => {
    setSearchText("");
    setActiveFilters({});
  };

  const activeChips = Object.entries(activeFilters)
    .filter(([, v]) => v && v !== "All")
    .map(([k, v]) => ({ key: k as keyof T, label: `${k}: ${v}` }));

  return {
    searchText, setSearchText,
    activeFilters, setFilter, removeFilter, clearAll,
    activeChips, filtered,
  };
}
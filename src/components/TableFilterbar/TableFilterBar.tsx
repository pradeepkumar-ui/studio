import * as React from "react";
import {
  Card,
  CardContent,
} from "../ui/card"; // Adjust import path as needed

interface DropdownOption { label: string; value: string; }

interface FilterBarProps<T> {
  searchText: string;
  onSearchChange: (v: string) => void;
  dropdowns: {
    key: string;
    label: string;
    options: DropdownOption[];
    value: string;
    onChange: (v: string) => void;
  }[];
  activeChips: { key: string; label: string }[];
  onRemoveChip: (key: string) => void;
  onClearAll: () => void;
  searchPlaceholder?: string;
}

export function TableFilterBar<T>({
  searchText, onSearchChange,
  dropdowns, activeChips, onRemoveChip, onClearAll,
  searchPlaceholder = "Search...",
}: FilterBarProps<T>) {
  return (
    <Card className="mb-4 shadow-[0_2px_6px_rgba(0,0,0,0.06),0_-2px_6px_rgba(0,0,0,0.04)] bg-white border-none">
      <CardContent className="p-5">
        {/* ── Top row: search + dropdowns ── */}
        <div className="flex items-center gap-2.5">

          {/* Search input */}
          <div className="relative flex-1">
            {/* Search icon */}
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="14" height="14" viewBox="0 0 24 24" fill="none"
            >
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              className="
                w-full pl-9 pr-4 py-2 text-sm font-semibold
                border border-gray-200 rounded-xl bg-gray-50/60
                text-gray-700 placeholder:text-gray-400 placeholder:font-semibold
                focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300
                transition-all duration-150
              "
              placeholder={searchPlaceholder}
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Vertical divider */}
          <div className="w-px h-7 bg-gray-200 mx-0.5 flex-shrink-0" />

          {/* Dropdowns */}
          {dropdowns.map((dd) => (
            <div key={dd.key} className="relative">
              <select
                value={dd.value}
                onChange={(e) => dd.onChange(e.target.value)}
                className="
                  appearance-none
                  pl-3 pr-7 py-2
                  text-xs font-semibold text-gray-600
                  border border-gray-200 rounded-xl bg-gray-50/60
                  focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300
                  cursor-pointer transition-all duration-150
                  min-w-[110px]
                "
              >
                <option value="All">{dd.label}: All</option>
                {dd.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {/* Chevron */}
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          ))}
        </div>

        {/* ── Active filter chips ── */}
        {activeChips.length > 0 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Active:
            </span>

            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="
                  inline-flex items-center gap-1.5
                  pl-2.5 pr-1.5 py-0.5
                  rounded-full
                  bg-violet-50 border border-violet-200
                  text-xs font-semibold text-violet-700
                "
              >
                {chip.label}
                <button
                  onClick={() => onRemoveChip(chip.key)}
                  className="
                    w-4 h-4 rounded-full flex items-center justify-center
                    text-violet-400 hover:bg-violet-200 hover:text-violet-800
                    transition-colors leading-none text-sm
                  "
                  aria-label={`Remove ${chip.label}`}
                >
                  ×
                </button>
              </span>
            ))}

            <button
              onClick={onClearAll}
              className="
                text-[11px] font-semibold text-violet-600
                hover:text-violet-900 underline underline-offset-2
                hover:no-underline transition-colors ml-0.5
              "
            >
              Clear All
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
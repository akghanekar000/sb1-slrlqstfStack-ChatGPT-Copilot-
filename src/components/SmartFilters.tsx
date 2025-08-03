import React, { useState } from 'react';
import { Filter, Settings } from 'lucide-react';

interface FilterCriteria {
  ivThreshold: number;
  oiChangeThreshold: number;
  pcrThreshold: number;
  volumeSpikeMultiplier: number;
}

interface SmartFiltersProps {
  onFiltersChange: (filters: FilterCriteria) => void;
}

export default function SmartFilters({ onFiltersChange }: SmartFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria>({
    ivThreshold: 40,
    oiChangeThreshold: 20,
    pcrThreshold: 1.2,
    volumeSpikeMultiplier: 2
  });

  const handleFilterChange = (key: keyof FilterCriteria, value: number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const presetFilters = [
    {
      name: 'Conservative',
      filters: { ivThreshold: 30, oiChangeThreshold: 15, pcrThreshold: 1.0, volumeSpikeMultiplier: 1.5 }
    },
    {
      name: 'Moderate',
      filters: { ivThreshold: 40, oiChangeThreshold: 20, pcrThreshold: 1.2, volumeSpikeMultiplier: 2 }
    },
    {
      name: 'Aggressive',
      filters: { ivThreshold: 50, oiChangeThreshold: 30, pcrThreshold: 1.5, volumeSpikeMultiplier: 3 }
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Filter size={16} />
        Smart Filters
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Settings size={18} />
              Filter Options
            </h3>
          </div>

          <div className="p-4 space-y-4">
            {/* Preset Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
              <div className="flex gap-2">
                {presetFilters.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setFilters(preset.filters);
                      onFiltersChange(preset.filters);
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* IV Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IV Threshold: {filters.ivThreshold}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={filters.ivThreshold}
                onChange={(e) => handleFilterChange('ivThreshold', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10%</span>
                <span>100%</span>
              </div>
            </div>

            {/* OI Change Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OI Change Threshold: {filters.oiChangeThreshold}%
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={filters.oiChangeThreshold}
                onChange={(e) => handleFilterChange('oiChangeThreshold', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5%</span>
                <span>50%</span>
              </div>
            </div>

            {/* PCR Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PCR Threshold: {filters.pcrThreshold}
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={filters.pcrThreshold}
                onChange={(e) => handleFilterChange('pcrThreshold', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5</span>
                <span>2.0</span>
              </div>
            </div>

            {/* Volume Spike Multiplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume Spike: {filters.volumeSpikeMultiplier}x Average
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={filters.volumeSpikeMultiplier}
                onChange={(e) => handleFilterChange('volumeSpikeMultiplier', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1x</span>
                <span>5x</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
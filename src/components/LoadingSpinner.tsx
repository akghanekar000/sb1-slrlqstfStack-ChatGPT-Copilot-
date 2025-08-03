import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3 text-gray-500">
        <Loader2 size={24} className="animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );
}
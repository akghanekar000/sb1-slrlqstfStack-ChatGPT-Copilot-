import React from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Trade, TradeStats } from '../types/Trade';
import { exportToPDF, exportToExcel } from '../utils/export';

interface ExportManagerProps {
  trades: Trade[];
  stats: TradeStats;
}

export default function ExportManager({ trades, stats }: ExportManagerProps) {
  const handleExportPDF = () => {
    exportToPDF(trades, stats);
  };

  const handleExportExcel = () => {
    exportToExcel(trades, stats);
  };

  if (trades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <Download size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data to export</h3>
          <p className="text-gray-500">Add some trades to generate reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Export Trade Reports</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleExportPDF}
          className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors group"
        >
          <FileText size={32} className="text-red-600 group-hover:text-red-700" />
          <div className="text-left">
            <h4 className="font-medium text-gray-900 group-hover:text-red-700">Export PDF Report</h4>
            <p className="text-sm text-gray-500">Complete trading report with statistics</p>
          </div>
        </button>

        <button
          onClick={handleExportExcel}
          className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group"
        >
          <FileSpreadsheet size={32} className="text-green-600 group-hover:text-green-700" />
          <div className="text-left">
            <h4 className="font-medium text-gray-900 group-hover:text-green-700">Export Excel File</h4>
            <p className="text-sm text-gray-500">Detailed spreadsheet with all trade data</p>
          </div>
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Export Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Trades:</span>
            <div className="font-medium">{stats.totalTrades}</div>
          </div>
          <div>
            <span className="text-gray-500">Open Positions:</span>
            <div className="font-medium">{stats.openTrades}</div>
          </div>
          <div>
            <span className="text-gray-500">Closed Positions:</span>
            <div className="font-medium">{stats.closedTrades}</div>
          </div>
          <div>
            <span className="text-gray-500">Total P&L:</span>
            <div className={`font-medium ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stats.totalPnL.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
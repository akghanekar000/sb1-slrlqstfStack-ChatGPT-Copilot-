import React, { useState } from 'react';
import { BookOpen, Plus, Calendar, TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  symbol: string;
  strategy: string;
  entry: string;
  exit: string;
  pnl: number;
  notes: string;
  emotions: string;
  lessons: string;
  tags: string[];
}

export default function TradeJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      symbol: 'NIFTY 20000 CE',
      strategy: 'Bullish Breakout',
      entry: 'Entered at 125.50 after breakout above 19950 resistance',
      exit: 'Exited at 145.75 at target level',
      pnl: 2025,
      notes: 'Clean breakout with good volume. Market sentiment was bullish.',
      emotions: 'Confident entry, slight anxiety during pullback, satisfied with exit',
      lessons: 'Patience paid off. Should have added more quantity.',
      tags: ['breakout', 'bullish', 'nifty']
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    symbol: '',
    strategy: '',
    entry: '',
    exit: '',
    pnl: 0,
    notes: '',
    emotions: '',
    lessons: '',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newEntry,
      tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    setEntries([entry, ...entries]);
    setNewEntry({
      symbol: '',
      strategy: '',
      entry: '',
      exit: '',
      pnl: 0,
      notes: '',
      emotions: '',
      lessons: '',
      tags: ''
    });
    setShowForm(false);
  };

  const totalPnL = entries.reduce((sum, entry) => sum + entry.pnl, 0);
  const winRate = entries.length > 0 ? (entries.filter(e => e.pnl > 0).length / entries.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trade Journal</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Entry
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-green-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total P&L</span>
          </div>
          <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{totalPnL.toFixed(2)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-blue-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {winRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-purple-600" size={20} />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Entries</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {entries.length}
          </div>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{entry.symbol}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{entry.date} • {entry.strategy}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                entry.pnl >= 0 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {entry.pnl >= 0 ? '+' : ''}₹{entry.pnl}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Entry Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{entry.entry}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Exit Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{entry.exit}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{entry.notes}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Emotions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{entry.emotions}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Lessons Learned</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{entry.lessons}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {entry.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Journal Entry</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Symbol</label>
                  <input
                    type="text"
                    required
                    value={newEntry.symbol}
                    onChange={(e) => setNewEntry({...newEntry, symbol: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="NIFTY 20000 CE"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Strategy</label>
                  <input
                    type="text"
                    required
                    value={newEntry.strategy}
                    onChange={(e) => setNewEntry({...newEntry, strategy: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Bullish Breakout"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Entry Analysis</label>
                <textarea
                  required
                  value={newEntry.entry}
                  onChange={(e) => setNewEntry({...newEntry, entry: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Why did you enter this trade?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exit Analysis</label>
                <textarea
                  required
                  value={newEntry.exit}
                  onChange={(e) => setNewEntry({...newEntry, exit: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Why did you exit this trade?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">P&L (₹)</label>
                <input
                  type="number"
                  required
                  value={newEntry.pnl}
                  onChange={(e) => setNewEntry({...newEntry, pnl: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="2025"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Emotions</label>
                  <textarea
                    value={newEntry.emotions}
                    onChange={(e) => setNewEntry({...newEntry, emotions: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="How did you feel during the trade?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lessons Learned</label>
                  <textarea
                    value={newEntry.lessons}
                    onChange={(e) => setNewEntry({...newEntry, lessons: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="What did you learn from this trade?"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="breakout, bullish, nifty"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
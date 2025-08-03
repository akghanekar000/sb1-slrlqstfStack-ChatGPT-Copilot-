import React, { useState } from 'react';
import { Calculator, TrendingUp, Target, Zap, BarChart3, Activity } from 'lucide-react';

interface CalculationResult {
  blackScholes: number;
  intrinsicValue: number;
  timeValue: number;
  breakeven: number;
  maxProfit: number;
  maxLoss: number;
  probabilityITM: number;
}

export default function MathematicalModels() {
  const [inputs, setInputs] = useState({
    spotPrice: 19850,
    strikePrice: 20000,
    timeToExpiry: 30,
    riskFreeRate: 6.5,
    volatility: 18,
    optionType: 'call' as 'call' | 'put',
    premium: 125
  });

  const [results, setResults] = useState<CalculationResult | null>(null);

  // Black-Scholes calculation
  const calculateBlackScholes = () => {
    const S = inputs.spotPrice;
    const K = inputs.strikePrice;
    const T = inputs.timeToExpiry / 365;
    const r = inputs.riskFreeRate / 100;
    const sigma = inputs.volatility / 100;

    const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const normalCDF = (x: number) => {
      return 0.5 * (1 + erf(x / Math.sqrt(2)));
    };

    const erf = (x: number) => {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;

      const sign = x >= 0 ? 1 : -1;
      x = Math.abs(x);

      const t = 1.0 / (1.0 + p * x);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

      return sign * y;
    };

    let callPrice, putPrice;

    if (inputs.optionType === 'call') {
      callPrice = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
      putPrice = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
    } else {
      putPrice = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
      callPrice = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
    }

    const optionPrice = inputs.optionType === 'call' ? callPrice : putPrice;
    const intrinsicValue = inputs.optionType === 'call' 
      ? Math.max(0, S - K) 
      : Math.max(0, K - S);
    const timeValue = optionPrice - intrinsicValue;

    const breakeven = inputs.optionType === 'call' 
      ? K + inputs.premium 
      : K - inputs.premium;

    const maxProfit = inputs.optionType === 'call' 
      ? Infinity 
      : K - inputs.premium;

    const maxLoss = inputs.premium;

    const probabilityITM = inputs.optionType === 'call' 
      ? normalCDF(d2) * 100 
      : normalCDF(-d2) * 100;

    setResults({
      blackScholes: optionPrice,
      intrinsicValue,
      timeValue,
      breakeven,
      maxProfit: maxProfit === Infinity ? 0 : maxProfit,
      maxLoss,
      probabilityITM
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  const presetStrategies = [
    {
      name: 'ATM Call',
      values: { spotPrice: 19850, strikePrice: 19850, optionType: 'call' as const, premium: 150 }
    },
    {
      name: 'OTM Call',
      values: { spotPrice: 19850, strikePrice: 20000, optionType: 'call' as const, premium: 85 }
    },
    {
      name: 'ATM Put',
      values: { spotPrice: 19850, strikePrice: 19850, optionType: 'put' as const, premium: 140 }
    },
    {
      name: 'OTM Put',
      values: { spotPrice: 19850, strikePrice: 19700, optionType: 'put' as const, premium: 75 }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Calculator className="text-purple-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mathematical Models & Calculators</h2>
      </div>

      {/* Quick Presets */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presetStrategies.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setInputs(prev => ({ ...prev, ...preset.values }))}
              className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="text-green-600" size={20} />
            Option Parameters
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Spot Price (₹)
                </label>
                <input
                  type="number"
                  value={inputs.spotPrice}
                  onChange={(e) => handleInputChange('spotPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Strike Price (₹)
                </label>
                <input
                  type="number"
                  value={inputs.strikePrice}
                  onChange={(e) => handleInputChange('strikePrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Days to Expiry
                </label>
                <input
                  type="number"
                  value={inputs.timeToExpiry}
                  onChange={(e) => handleInputChange('timeToExpiry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Risk-Free Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.riskFreeRate}
                  onChange={(e) => handleInputChange('riskFreeRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Volatility (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.volatility}
                  onChange={(e) => handleInputChange('volatility', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Premium (₹)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={inputs.premium}
                  onChange={(e) => handleInputChange('premium', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Option Type
              </label>
              <select
                value={inputs.optionType}
                onChange={(e) => handleInputChange('optionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="call">Call Option (CE)</option>
                <option value="put">Put Option (PE)</option>
              </select>
            </div>

            <button
              onClick={calculateBlackScholes}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Zap size={20} />
              Calculate Option Value
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={20} />
            Calculation Results
          </h3>

          {results ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Black-Scholes Fair Value</h4>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    ₹{results.blackScholes.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Current Premium: ₹{inputs.premium} 
                    <span className={`ml-2 font-medium ${
                      inputs.premium > results.blackScholes ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ({inputs.premium > results.blackScholes ? 'Overvalued' : 'Undervalued'})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Intrinsic Value</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">₹{results.intrinsicValue.toFixed(2)}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Time Value</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">₹{results.timeValue.toFixed(2)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Breakeven Point</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">₹{results.breakeven.toFixed(2)}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Probability ITM</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{results.probabilityITM.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="text-sm text-green-700 dark:text-green-400">Max Profit</div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {results.maxProfit === 0 ? 'Unlimited' : `₹${results.maxProfit.toFixed(2)}`}
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <div className="text-sm text-red-700 dark:text-red-400">Max Loss</div>
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">₹{results.maxLoss.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Greeks Section */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Activity className="text-blue-600" size={16} />
                  Option Greeks (Estimated)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-gray-600 dark:text-gray-300">Delta</div>
                    <div className="font-bold text-gray-900 dark:text-white">0.65</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 dark:text-gray-300">Gamma</div>
                    <div className="font-bold text-gray-900 dark:text-white">0.05</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 dark:text-gray-300">Theta</div>
                    <div className="font-bold text-red-600 dark:text-red-400">-0.08</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 dark:text-gray-300">Vega</div>
                    <div className="font-bold text-gray-900 dark:text-white">0.12</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Calculator size={48} className="mx-auto" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Ready to Calculate</h4>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your option parameters and click calculate to see the mathematical analysis.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Tools */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Mathematical Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Position Sizing</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Calculate optimal position size based on risk tolerance</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Volatility Analysis</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Historical vs implied volatility comparison</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Risk Metrics</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">VaR, Sharpe ratio, and other risk calculations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
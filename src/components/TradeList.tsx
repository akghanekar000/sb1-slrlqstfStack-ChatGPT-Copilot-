import React from 'react';
import VirtualizedTradeList from './VirtualizedTradeList';
import { Trade, Alert } from '../types/Trade';

interface TradeListProps {
  trades: Trade[];
  alerts: Alert[];
  onUpdateTrade: (id: string, updates: Partial<Trade>) => void;
  onDeleteTrade: (id: string) => void;
  onCreateAlert: (tradeId: string, type: 'target' | 'stopLoss', targetPrice: number) => void;
  onToggleAlert: (alertId: string) => void;
  onUpdateCurrentPrice: (tradeId: string, price: number) => void;
}

export default function TradeList(props: TradeListProps) {
  return <VirtualizedTradeList {...props} />;
}
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Trade } from '../types/Trade';
import { calculatePnL, formatCurrency, formatPercent } from './calculations';

export function exportToPDF(trades: Trade[], stats: any) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Options Trading Report', 20, 20);
  
  // Date
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Stats
  doc.setFontSize(14);
  doc.text('Trading Statistics', 20, 45);
  doc.setFontSize(10);
  doc.text(`Total Trades: ${stats.totalTrades}`, 20, 55);
  doc.text(`Open Trades: ${stats.openTrades}`, 20, 62);
  doc.text(`Closed Trades: ${stats.closedTrades}`, 20, 69);
  doc.text(`Total P&L: ${formatCurrency(stats.totalPnL)}`, 20, 76);
  doc.text(`Win Rate: ${stats.winRate.toFixed(2)}%`, 20, 83);
  
  // Trades table
  const tableData = trades.map(trade => {
    const { pnl, pnlPercent } = calculatePnL(trade);
    return [
      trade.symbol,
      `${trade.type.toUpperCase()} ${trade.strike}`,
      trade.action.toUpperCase(),
      trade.quantity.toString(),
      formatCurrency(trade.entryPrice),
      trade.exitPrice ? formatCurrency(trade.exitPrice) : 'Open',
      formatCurrency(pnl),
      formatPercent(pnlPercent),
      trade.status.toUpperCase(),
      trade.entryDate,
      trade.notes || ''
    ];
  });
  
  autoTable(doc, {
    head: [['Symbol', 'Option', 'Action', 'Qty', 'Entry', 'Exit', 'P&L', 'P&L %', 'Status', 'Date', 'Notes']],
    body: tableData,
    startY: 95,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] }
  });
  
  doc.save(`options-report-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportToExcel(trades: Trade[], stats: any) {
  const workbook = XLSX.utils.book_new();
  
  // Stats worksheet
  const statsData = [
    ['Metric', 'Value'],
    ['Total Trades', stats.totalTrades],
    ['Open Trades', stats.openTrades],
    ['Closed Trades', stats.closedTrades],
    ['Total P&L', stats.totalPnL],
    ['Win Rate (%)', stats.winRate.toFixed(2)],
    ['Average Win', stats.avgWin],
    ['Average Loss', stats.avgLoss]
  ];
  
  const statsWS = XLSX.utils.aoa_to_sheet(statsData);
  XLSX.utils.book_append_sheet(workbook, statsWS, 'Statistics');
  
  // Trades worksheet
  const tradesData = trades.map(trade => {
    const { pnl, pnlPercent } = calculatePnL(trade);
    return {
      Symbol: trade.symbol,
      Type: trade.type.toUpperCase(),
      Action: trade.action.toUpperCase(),
      Strike: trade.strike,
      Expiry: trade.expiry,
      Quantity: trade.quantity,
      'Entry Price': trade.entryPrice,
      'Exit Price': trade.exitPrice || '',
      'Current Price': trade.currentPrice || '',
      'P&L': pnl,
      'P&L %': pnlPercent,
      Status: trade.status.toUpperCase(),
      'Entry Date': trade.entryDate,
      'Exit Date': trade.exitDate || '',
      Delta: trade.delta || '',
      Gamma: trade.gamma || '',
      Theta: trade.theta || '',
      Vega: trade.vega || '',
      Notes: trade.notes || ''
    };
  });
  
  const tradesWS = XLSX.utils.json_to_sheet(tradesData);
  XLSX.utils.book_append_sheet(workbook, tradesWS, 'Trades');
  
  XLSX.writeFile(workbook, `options-report-${new Date().toISOString().split('T')[0]}.xlsx`);
}
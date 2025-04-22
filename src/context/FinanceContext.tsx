
import React, { createContext, useState, useContext, useEffect } from 'react';

export type Transaction = {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  month: string; // Format: YYYY-MM
};

type MonthData = {
  month: string; // Format: YYYY-MM
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
};

type FinanceContextType = {
  transactions: Transaction[];
  monthlyData: MonthData[];
  currentMonth: string;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'month'>, month?: string) => void;
  deleteTransaction: (id: string) => void;
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  getMonthName: (monthStr: string) => string;
  formatCurrency: (amount: number) => string;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

// Helper to get current month in YYYY-MM format
const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Helper to get month name from YYYY-MM
const getMonthNameHelper = (monthStr: string): string => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

// Helper to format currency in INR
const formatCurrencyHelper = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentMonth = getCurrentMonth();
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Add month field to existing transactions if missing
      return parsed.map((t: any) => ({
        ...t,
        month: t.month || currentMonth
      }));
    }
    return [];
  });

  const [monthlyData, setMonthlyData] = useState<MonthData[]>(() => {
    const saved = localStorage.getItem('monthlyData');
    return saved ? JSON.parse(saved) : [];
  });

  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // Calculate monthly data whenever transactions change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Group transactions by month
    const months: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      const month = transaction.month || currentMonth;
      if (!months[month]) {
        months[month] = [];
      }
      months[month].push(transaction);
    });

    // Create monthly data
    const monthlyDataArr: MonthData[] = Object.keys(months).map(month => {
      const monthTransactions = months[month];
      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);
      
      const monthExpense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
      
      return {
        month,
        transactions: monthTransactions,
        totalIncome: monthIncome,
        totalExpense: monthExpense,
        totalBalance: monthIncome - monthExpense
      };
    });

    // Sort by most recent month first
    monthlyDataArr.sort((a, b) => b.month.localeCompare(a.month));
    
    setMonthlyData(monthlyDataArr);
    localStorage.setItem('monthlyData', JSON.stringify(monthlyDataArr));
    
    // Calculate current month totals
    const currentMonthData = monthlyDataArr.find(m => m.month === currentMonth) || {
      totalIncome: 0,
      totalExpense: 0,
      totalBalance: 0
    };
    
    setTotalIncome(currentMonthData.totalIncome);
    setTotalExpense(currentMonthData.totalExpense);
    setTotalBalance(currentMonthData.totalBalance);
  }, [transactions, currentMonth]);

  const addTransaction = (
    transaction: Omit<Transaction, 'id' | 'date' | 'month'>, 
    month: string = currentMonth
  ) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      month,
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      monthlyData,
      currentMonth,
      addTransaction,
      deleteTransaction,
      totalBalance,
      totalIncome,
      totalExpense,
      getMonthName: getMonthNameHelper,
      formatCurrency: formatCurrencyHelper
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

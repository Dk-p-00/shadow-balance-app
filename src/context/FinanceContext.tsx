
import React, { createContext, useState, useContext, useEffect } from 'react';

export type Transaction = {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
};

type FinanceContextType = {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  deleteTransaction: (id: string) => void;
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    setTotalIncome(income);
    setTotalExpense(expense);
    setTotalBalance(income - expense);
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      addTransaction,
      deleteTransaction,
      totalBalance,
      totalIncome,
      totalExpense
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

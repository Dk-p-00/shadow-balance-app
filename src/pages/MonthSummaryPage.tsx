
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, CalendarCheck } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import NavBar from '@/components/NavBar';
import { cn } from '@/lib/utils';

const MonthSummaryPage: React.FC = () => {
  const { monthlyData, formatCurrency, getMonthName } = useFinance();

  return (
    <motion.div 
      className="min-h-screen bg-gradient-premium pb-20 pt-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gradient">Monthly Summary</h1>
          <p className="text-white/60 mt-1">Track your finances month by month</p>
        </motion.div>
        
        <div className="space-y-4">
          <AnimatePresence>
            {monthlyData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10"
              >
                <p className="text-white/60">No data available</p>
                <p className="text-white/40 text-sm mt-1">Start tracking your finances by adding transactions</p>
              </motion.div>
            ) : (
              monthlyData.map((month, index) => (
                <motion.div
                  key={month.month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl glass-morphism border border-white/5 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CalendarCheck className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">{getMonthName(month.month)}</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="text-xs text-white/60">Income</p>
                      <div className="flex items-center mt-1">
                        <ArrowUp className="w-3 h-3 text-income mr-1" />
                        <p className="text-income font-medium text-sm">
                          {formatCurrency(month.totalIncome)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="text-xs text-white/60">Expense</p>
                      <div className="flex items-center mt-1">
                        <ArrowDown className="w-3 h-3 text-expense mr-1" />
                        <p className="text-expense font-medium text-sm">
                          {formatCurrency(month.totalExpense)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="text-xs text-white/60">Balance</p>
                      <p className={cn(
                        "font-medium text-sm mt-1",
                        month.totalBalance >= 0 ? "text-income" : "text-expense"
                      )}>
                        {formatCurrency(month.totalBalance)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      {month.totalIncome > 0 && (
                        <div 
                          className="h-full bg-income"
                          style={{ 
                            width: `${Math.min(100, (month.totalBalance / month.totalIncome) * 100)}%`,
                            opacity: month.totalBalance >= 0 ? 1 : 0.5
                          }}
                        />
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-1">
                      {month.totalIncome > 0 
                        ? `${Math.round((month.totalBalance / month.totalIncome) * 100)}% of income saved`
                        : 'No income data'
                      }
                    </p>
                  </div>
                  
                  <div className="mt-3 text-xs text-white/60">
                    <p>{month.transactions.length} transactions</p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <NavBar />
    </motion.div>
  );
};

export default MonthSummaryPage;

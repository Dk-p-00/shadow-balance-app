
import React from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '@/context/FinanceContext';
import { cn } from '@/lib/utils';

const BalanceCircle = () => {
  const { totalBalance, totalIncome, totalExpense, formatCurrency } = useFinance();
  const formattedBalance = formatCurrency(totalBalance);

  // Calculate percentage for the circle fill
  const calculatePercentage = () => {
    if (totalIncome === 0 && totalExpense === 0) return 0;
    if (totalExpense === 0) return 100;
    
    // Calculate what percentage of income is left as balance
    const percentage = (totalBalance / totalIncome) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const percentage = calculatePercentage();
  const circumference = 2 * Math.PI * 120; // Circle radius is 120
  const strokeDashoffset = circumference - (circumference * percentage) / 100;
  const isPositive = totalBalance >= 0;

  return (
    <div className="relative flex flex-col items-center justify-center w-72 h-72 mx-auto">
      {/* Background glow */}
      <div className={cn(
        "absolute w-full h-full rounded-full opacity-20 filter blur-xl",
        isPositive ? "bg-income" : "bg-expense"
      )} />
      
      {/* Static outer circle */}
      <motion.div 
        className="absolute w-full h-full rounded-full"
        style={{ 
          background: 'radial-gradient(circle, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      
      {/* SVG progress circle */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 300 300">
        {/* Background circle */}
        <circle
          cx="150"
          cy="150"
          r="120"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="150"
          cy="150"
          r="120"
          stroke={isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          fill="none"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
        />
      </svg>
      
      {/* Rotating dots on circle */}
      <motion.div 
        className="absolute w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute w-2 h-2 rounded-full",
              isPositive ? "bg-income" : "bg-expense"
            )}
            style={{
              top: `${150 + 120 * Math.sin(2 * Math.PI * (i / 12))}px`,
              left: `${150 + 120 * Math.cos(2 * Math.PI * (i / 12))}px`,
              opacity: 0.3 + (i % 3) * 0.2,
            }}
          />
        ))}
      </motion.div>
      
      {/* Middle circle with balance info */}
      <motion.div 
        className="relative flex flex-col items-center justify-center z-10 w-48 h-48 rounded-full neo-blur"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.p
          className="text-sm font-medium text-white/60"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          CURRENT BALANCE
        </motion.p>
        
        <motion.h1
          className={cn(
            "text-3xl font-bold my-2",
            isPositive ? "text-income" : "text-expense"
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
        >
          {formattedBalance}
        </motion.h1>
        
        <div className="flex text-xs gap-4 mt-1">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <p className="text-white/60">Income</p>
            <p className="text-income font-medium">
              {formatCurrency(totalIncome)}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <p className="text-white/60">Expenses</p>
            <p className="text-expense font-medium">
              {formatCurrency(totalExpense)}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BalanceCircle;

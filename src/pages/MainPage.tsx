
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, MinusCircle, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import BalanceCircle from '@/components/BalanceCircle';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  
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
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-gradient">Finance Tracker</h1>
          <p className="text-white/60 mt-1">Track your income and expenses</p>
        </motion.div>
        
        <BalanceCircle />
        
        <motion.div 
          className="mt-10 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={() => navigate('/add-income')}
            className="w-full py-6 bg-gradient-income hover:opacity-90 border border-income/10 shadow-glow-income hover:shadow-glow-lg group transition-all duration-300"
          >
            <PlusCircle className="mr-2 w-5 h-5 text-income group-hover:scale-110 transition-transform" />
            <span className="text-income font-medium">Add Income</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/add-expense')}
            className="w-full py-6 bg-gradient-expense hover:opacity-90 border border-expense/10 shadow-glow-expense hover:shadow-glow-lg group transition-all duration-300"
          >
            <MinusCircle className="mr-2 w-5 h-5 text-expense group-hover:scale-110 transition-transform" />
            <span className="text-expense font-medium">Add Expense</span>
          </Button>
          
          <Button
            onClick={() => navigate('/history')}
            variant="outline"
            className="w-full py-6 glass-morphism hover:bg-white/5 group transition-all duration-300"
          >
            <History className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Transaction History</span>
          </Button>
        </motion.div>
      </div>
      
      <NavBar />
    </motion.div>
  );
};

export default MainPage;

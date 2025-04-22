
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFinance } from '@/context/FinanceContext';
import NavBar from '@/components/NavBar';
import CategoryGrid from '@/components/CategoryGrid';

const AddExpensePage: React.FC = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const { addTransaction } = useFinance();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Expense name is required",
        variant: "destructive"
      });
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    addTransaction({
      name: name.trim(),
      amount: amountValue,
      type: 'expense',
      category
    });
    
    toast({
      title: "Expense added successfully",
      description: `$${amountValue.toFixed(2)} has been recorded as an expense`,
      className: "bg-expense/10 border-expense/20"
    });
    
    navigate('/');
  };

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
          <h1 className="text-3xl font-bold text-gradient">Add Expense</h1>
          <p className="text-white/60 mt-1">Record your expense transaction</p>
        </motion.div>
        
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Expense Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Groceries, Rent, etc."
              className="glass-morphism border-white/10 focus:border-expense/30 bg-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Amount ($)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className="glass-morphism border-white/10 focus:border-expense/30 bg-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Category
            </label>
            <CategoryGrid
              type="expense"
              selectedCategory={category}
              onSelectCategory={setCategory}
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full py-6 mt-8 bg-gradient-expense hover:opacity-90 border border-expense/10 shadow-glow-expense hover:shadow-glow-lg text-expense font-medium"
          >
            Add Expense
          </Button>
        </motion.form>
      </div>
      
      <NavBar />
    </motion.div>
  );
};

export default AddExpensePage;

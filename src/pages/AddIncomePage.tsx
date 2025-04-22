
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFinance } from '@/context/FinanceContext';
import NavBar from '@/components/NavBar';
import CategoryGrid from '@/components/CategoryGrid';

const AddIncomePage: React.FC = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('salary');
  const [selectedMonth, setSelectedMonth] = useState('');
  const { addTransaction, currentMonth, monthlyData, getMonthName } = useFinance();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Set current month as default
  useEffect(() => {
    setSelectedMonth(currentMonth);
  }, [currentMonth]);

  // Get list of months (current and previous 6 months)
  const getMonthOptions = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.push(monthStr);
    }
    
    return months;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Income name is required",
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
      type: 'income',
      category
    }, selectedMonth);
    
    toast({
      title: "Income added successfully",
      description: `Income of ₹${amountValue.toFixed(2)} has been added to ${getMonthName(selectedMonth)}`,
      className: "bg-income/10 border-income/20"
    });
    
    navigate('/');
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-premium pb-20 pt-10 px-4 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gradient">Add Income</h1>
          <p className="text-white/60 mt-1">Record your income transaction</p>
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
              Income Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Salary, Freelance, etc."
              className="glass-morphism border-white/10 focus:border-income/30 bg-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Amount (₹)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className="glass-morphism border-white/10 focus:border-income/30 bg-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Month
            </label>
            <Select
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger className="glass-morphism border-white/10 focus:border-income/30 bg-transparent">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {getMonthOptions().map(month => (
                  <SelectItem key={month} value={month}>
                    {getMonthName(month)}
                    {month === currentMonth ? ' (Current)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Category
            </label>
            <CategoryGrid
              type="income"
              selectedCategory={category}
              onSelectCategory={setCategory}
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full py-6 mt-8 bg-gradient-income hover:opacity-90 border border-income/10 shadow-glow-income hover:shadow-glow-lg text-income font-medium"
          >
            Add Income
          </Button>
        </motion.form>
      </div>
      
      <NavBar />
    </motion.div>
  );
};

export default AddIncomePage;

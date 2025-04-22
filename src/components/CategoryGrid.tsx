
import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Define all the category options
export const incomeCategories = [
  { id: 'salary', name: 'Salary', icon: '💰' },
  { id: 'freelance', name: 'Freelance', icon: '💻' },
  { id: 'investments', name: 'Investments', icon: '📈' },
  { id: 'gift', name: 'Gift', icon: '🎁' },
  { id: 'cashback', name: 'Cashback', icon: '💸' },
  { id: 'other', name: 'Other', icon: '✨' },
];

export const expenseCategories = [
  { id: 'food', name: 'Food', icon: '🍔' },
  { id: 'transport', name: 'Transport', icon: '🚗' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'utilities', name: 'Utilities', icon: '🔌' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'home', name: 'Home', icon: '🏠' },
  { id: 'other', name: 'Other', icon: '📦' },
];

type CategoryGridProps = {
  type: 'income' | 'expense';
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

const CategoryGrid: React.FC<CategoryGridProps> = ({
  type,
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = type === 'income' ? incomeCategories : expenseCategories;
  const bgGradient = type === 'income' ? 'bg-gradient-income' : 'bg-gradient-expense';
  const textColor = type === 'income' ? 'text-income' : 'text-expense';
  const hoverClass = type === 'income' ? 'hover:shadow-glow-income' : 'hover:shadow-glow-expense';
  
  return (
    <div className="grid grid-cols-3 gap-3 mt-6">
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category.id;
        
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "relative py-5 px-3 rounded-xl glass-morphism transition-all cursor-pointer",
              isSelected ? (type === 'income' ? "border-income/30" : "border-expense/30") : "border-white/5",
              hoverClass
            )}
          >
            {isSelected && (
              <div className="absolute top-2 right-2">
                <Check className={cn("w-4 h-4", textColor)} />
              </div>
            )}
            
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">{category.icon}</span>
              <p className="text-sm font-medium text-white">
                {category.name}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CategoryGrid;

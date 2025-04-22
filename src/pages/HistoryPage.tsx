
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  ArrowUp, 
  ArrowDown, 
  Filter, 
  X,
  Trash2
} from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useFinance } from '@/context/FinanceContext';
import NavBar from '@/components/NavBar';
import { 
  incomeCategories, 
  expenseCategories 
} from '@/components/CategoryGrid';
import { cn } from '@/lib/utils';

interface FilterOptions {
  types: {
    income: boolean;
    expense: boolean;
  };
  categories: string[];
}

const HistoryPage: React.FC = () => {
  const { transactions, deleteTransaction } = useFinance();
  const { toast } = useToast();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    types: { income: true, expense: true },
    categories: [],
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const allCategories = [...incomeCategories, ...expenseCategories];
  
  const findCategoryIcon = (categoryId: string, type: 'income' | 'expense') => {
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    return categories.find(c => c.id === categoryId)?.icon || '📦';
  };

  const toggleType = (type: 'income' | 'expense') => {
    setFilters(prev => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: !prev.types[type]
      }
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setFilters(prev => {
      const categories = [...prev.categories];
      const index = categories.indexOf(categoryId);
      
      if (index === -1) {
        categories.push(categoryId);
      } else {
        categories.splice(index, 1);
      }
      
      return {
        ...prev,
        categories
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      types: { income: true, expense: true },
      categories: []
    });
  };

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
      
      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed from your history"
      });
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Check transaction type
    if (!filters.types[transaction.type]) return false;
    
    // Check transaction category (if categories selected)
    if (filters.categories.length > 0 && !filters.categories.includes(transaction.category)) {
      return false;
    }
    
    return true;
  });

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
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gradient">History</h1>
            <p className="text-white/60 mt-1">Your transaction records</p>
          </div>
          
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className={cn(
                  "rounded-full glass-morphism hover:bg-white/10",
                  (filters.categories.length > 0 || !filters.types.income || !filters.types.expense) && "border-primary"
                )}
              >
                <Filter className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 glass-morphism border-white/10">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Transactions</h4>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-white/70">Transaction Type</h5>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="income-filter" 
                        checked={filters.types.income}
                        onCheckedChange={() => toggleType('income')}
                        className="data-[state=checked]:bg-income data-[state=checked]:border-income"
                      />
                      <Label htmlFor="income-filter" className="text-sm cursor-pointer">Income</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="expense-filter" 
                        checked={filters.types.expense}
                        onCheckedChange={() => toggleType('expense')}
                        className="data-[state=checked]:bg-expense data-[state=checked]:border-expense"
                      />
                      <Label htmlFor="expense-filter" className="text-sm cursor-pointer">Expense</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-white/70">Categories</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {allCategories.map(category => (
                      <div key={category.id} className="flex items-center gap-2">
                        <Checkbox 
                          id={`cat-${category.id}`} 
                          checked={filters.categories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor={`cat-${category.id}`} className="text-sm cursor-pointer">
                          {category.icon} {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetFilters}
                    className="text-xs"
                  >
                    Reset
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setFilterOpen(false)}
                    className="text-xs"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </motion.div>
        
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <p className="text-white/60">No transactions found</p>
              <p className="text-white/40 text-sm mt-1">
                {transactions.length > 0 
                  ? "Try adjusting your filters"
                  : "Start tracking your finances by adding transactions"}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredTransactions.map((transaction, index) => {
                const isIncome = transaction.type === 'income';
                const date = new Date(transaction.date);
                const formattedDate = format(date, 'MMM d, yyyy');
                const formattedTime = format(date, 'h:mm a');
                const categoryIcon = findCategoryIcon(transaction.category, transaction.type);
                
                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-4 rounded-xl glass-morphism border border-white/5 relative",
                      isIncome ? "hover:border-income/20" : "hover:border-expense/20"
                    )}
                  >
                    <div className="absolute top-4 right-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10"
                        onClick={() => handleDeleteClick(transaction.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        isIncome ? "bg-income/10" : "bg-expense/10"
                      )}>
                        <span className="text-xl">{categoryIcon}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{transaction.name}</h3>
                        <p className="text-xs text-white/60">
                          {formattedDate} • {formattedTime}
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        {isIncome ? (
                          <ArrowUp className="w-3 h-3 text-income mr-1" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-expense mr-1" />
                        )}
                        <span className={cn(
                          "font-medium",
                          isIncome ? "text-income" : "text-expense"
                        )}>
                          ${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="glass-morphism border-white/10">
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="bg-transparent hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="bg-expense text-white hover:bg-expense/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <NavBar />
    </motion.div>
  );
};

export default HistoryPage;

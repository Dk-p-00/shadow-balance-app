
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  PlusCircle, 
  MinusCircle, 
  History, 
  ArrowLeft 
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const NavBar = () => {
  const location = useLocation();
  const showBackButton = location.pathname !== '/';

  return (
    <div className="fixed bottom-0 left-0 right-0 pb-5 px-4 z-10 animate-fade-in">
      <div className="max-w-md mx-auto glass-morphism rounded-full p-2 flex justify-between items-center">
        {showBackButton ? (
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full transition-all hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        ) : (
          <span></span>
        )}

        <div className="flex space-x-2">
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-all hover:bg-white/10",
                location.pathname === '/' && "bg-white/10"
              )}
            >
              <Home className="w-5 h-5" />
            </Button>
          </Link>
          
          <Link to="/add-income">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-all hover:bg-white/10",
                location.pathname === '/add-income' && "bg-white/10"
              )}
            >
              <PlusCircle className="w-5 h-5 text-income" />
            </Button>
          </Link>
          
          <Link to="/add-expense">
            <Button
              variant="ghost"
              size="icon"  
              className={cn(
                "rounded-full transition-all hover:bg-white/10",
                location.pathname === '/add-expense' && "bg-white/10"
              )}
            >
              <MinusCircle className="w-5 h-5 text-expense" />
            </Button>
          </Link>
          
          <Link to="/history">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-all hover:bg-white/10",
                location.pathname === '/history' && "bg-white/10"
              )}
            >
              <History className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        
        <span></span>
      </div>
    </div>
  );
};

export default NavBar;

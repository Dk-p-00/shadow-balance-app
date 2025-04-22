
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { FinanceProvider } from "@/context/FinanceContext";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { App as CapApp } from "@capacitor/app";

import MainPage from "./pages/MainPage";
import AddIncomePage from "./pages/AddIncomePage";
import AddExpensePage from "./pages/AddExpensePage";
import HistoryPage from "./pages/HistoryPage";
import MonthSummaryPage from "./pages/MonthSummaryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Handle back button for Android
const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = () => {
      if (location.pathname === "/") {
        CapApp.exitApp();
      } else {
        navigate("/");
      }
    };

    const backButtonListener = CapApp.addListener('backButton', handleBackButton);

    return () => {
      backButtonListener.remove();
    };
  }, [navigate, location]);

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/add-income" element={<AddIncomePage />} />
        <Route path="/add-expense" element={<AddExpensePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/month-summary" element={<MonthSummaryPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" closeButton richColors toastOptions={{ duration: 2000 }} />
      <FinanceProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </FinanceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

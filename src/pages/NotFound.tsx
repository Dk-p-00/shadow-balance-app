
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="min-h-screen bg-gradient-premium flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center max-w-md w-full glass-morphism rounded-xl p-8">
        <motion.h1 
          className="text-6xl font-bold text-gradient mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          404
        </motion.h1>
        
        <motion.p 
          className="text-xl text-white mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Page not found
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            onClick={() => navigate("/")} 
            className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary group"
          >
            <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Return to Home
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;

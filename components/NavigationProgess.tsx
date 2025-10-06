import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigationProgressContext } from "@/contexts/NavigationProgressContext";

const NavigationProgressBar: React.FC = () => {
  const pathname = usePathname();
  const { isLoading, progress, startLoading, finishLoading } = useNavigationProgressContext();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger progress bar when pathname changes
    startLoading();
    setIsAnimating(true);

    // Simulate progress (you can tie this to actual API/loading states if needed)
    const interval = setInterval(() => {
      if (progress >= 90) {
        clearInterval(interval);
        finishLoading();
        return;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [pathname, startLoading, finishLoading, progress]);

  // Once "loaded" → finish the bar
  useEffect(() => {
    if (isAnimating && !isLoading) {
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // small delay before hiding
      return () => clearTimeout(timeout);
    }
  }, [isAnimating, isLoading]);

  return (
    <AnimatePresence>
      {(isAnimating || isLoading) && (
        <motion.div
          key="progress-bar"
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 z-50 shadow-lg"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          exit={{ opacity: 0, scaleX: 1 }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
          style={{
            background: "linear-gradient(90deg, #8b5cf6 0%, #3b82f6 50%, #8b5cf6 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default NavigationProgressBar;

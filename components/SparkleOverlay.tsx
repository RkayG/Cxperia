import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "✨ Applying a touch of glam...",
  "💄 Putting everything together...",
  "🌟 Your experience is almost ready..."
];

const SparkleOverlay: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showFinalBlast, setShowFinalBlast] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        clearInterval(interval);
        setTimeout(() => {
          setShowFinalBlast(true);
          setTimeout(() => {
            onComplete?.();
          }, 1500); // fade out after final blast
        }, 1200);
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[9999]">
      {/* Sparkles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0,
              scale: 0
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Center message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="text-white text-2xl font-semibold text-center"
        >
          {messages[currentMessage]}
        </motion.div>
      </AnimatePresence>

      {/* Final blast of sparkles */}
      {showFinalBlast &&
        Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={`blast-${i}`}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            initial={{
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              scale: 0,
              opacity: 1
            }}
            animate={{
              x: `${(Math.random() - 0.5) * 600}px`,
              y: `${(Math.random() - 0.5) * 600}px`,
              scale: 1,
              opacity: 0
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut"
            }}
          />
        ))}
    </div>
  );
};

export default SparkleOverlay;

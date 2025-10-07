'use client'
import { motion } from "framer-motion";
import { GiComb, GiLipstick, GiPerfumeBottle, GiPowder } from "react-icons/gi"; 
import GradientText from "@/components/GradientText";
// Gi* are from react-icons/gi (Game Icons), but perfect for cosmetics

const icons = [
  { Icon: GiLipstick, color: "text-rose-500" },
  { Icon: GiPerfumeBottle, color: "text-purple-500" },
  { Icon: GiComb, color: "text-amber-600" },
  { Icon: GiPowder, color: "text-pink-400" },
];

const UnpackingLoader = () => (
  <motion.div
    initial={{ opacity: 0 }}  
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-pink-50 to-white"
  >
    {/* Animated Box */}
    <motion.div
        layoutId="productBox"
      className="w-32 h-32 bg-gradient-to-r from-[#b168df] to-[#170bbb] rounded-xl shadow-2xl mb-8 relative overflow-visible"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      {/* Box Lid */}
      <motion.div
      layoutId="boxLid"
        className="absolute bg-gradient-to-r from-[#b168df] to-[#170bbb] -top-4 left-0 w-32 h-4 rounded-t-xl"
        initial={{ y: 0 }}
        animate={{ y: -20 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
        
      />
    </motion.div>

    {/* Floating Beauty Items */}
    <div className="flex space-x-6">
      {icons.map(({ Icon, color }, index) => (
        <motion.div
          key={index}
          initial={{ y: 100, opacity: 0, scale: 0 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            delay: 1 + index * 0.25,
            type: "spring",
            stiffness: 200,
          }}
          className={`text-4xl ${color}`}
        >
          <Icon />
        </motion.div>
      ))}
    </div>

    {/* Loading Text */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="mt-8"
    >
      <GradientText
        colors={["#f472b6", "#a78bfa", "#38bdf8", "#f472b6"]}
        animationSpeed={6}
        className="font-medium text-lg"
      >
        Unpacking something lush...
      </GradientText>
    </motion.div>

    {/* Progress Bar */}
    <motion.div
      className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.7 }}
    >
      <motion.div
        className="h-full 0 bg-gradient-to-r from-[#b168df] to-[#170bbb]"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 3, ease: "easeInOut" }}
        onAnimationComplete={() => {
        // This will complete right when we transition
        }}
      />
    </motion.div>
  </motion.div>
);
export default UnpackingLoader;
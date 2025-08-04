import React, { useState } from "react";
import {
  Info,
  Sparkles,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Zap,
  MousePointer,
  Database,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InfoPanelProps {
  glassStyle: string;
  onDismiss: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ glassStyle, onDismiss }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "Welcome to Data Enrichment",
      icon: <Database className="w-5 h-5" />,
      color: "blue",
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
            <p className="text-gray-700 text-sm leading-relaxed">
              Transform your spreadsheet data with{" "}
              <span className="font-semibold text-blue-600">AI-powered enrichment</span>. 
              This demo showcases how Bright Data's real-time intelligence can automatically 
              enhance your data with contextual information.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Real-time data</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>AI enhancement</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Instant results</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "How to Get Started",
      icon: <Lightbulb className="w-5 h-5" />,
      color: "purple",
      content: (
        <div className="space-y-3">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg border border-purple-200">
              <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                1
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-medium">Enter your data</span> by clicking on any cell in the spreadsheet
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-medium">Fill in information</span> you want to enhance or expand
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200">
              <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                3
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-medium">Click the sparkles</span>{" "}
                  <Sparkles className="w-4 h-4 text-blue-500 inline mx-1" /> 
                  to enrich with AI-powered data
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Spreadsheet Features",
      icon: <MousePointer className="w-5 h-5" />,
      color: "green",
      content: (
        <div className="space-y-3">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200">
              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                <Pencil className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-medium">Edit column headers</span> by clicking the pencil icon
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <MousePointer className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-medium">Edit cell content</span> by clicking on any cell
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg border border-purple-200">
              <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-medium">AI enrichment</span> adds contextual data automatically
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-500",
          text: "text-blue-600",
          border: "border-blue-200",
          gradient: "from-blue-500/10 to-blue-600/5",
        };
      case "purple":
        return {
          bg: "bg-purple-500",
          text: "text-purple-600",
          border: "border-purple-200",
          gradient: "from-purple-500/10 to-purple-600/5",
        };
      case "green":
        return {
          bg: "bg-green-500",
          text: "text-green-600",
          border: "border-green-200",
          gradient: "from-green-500/10 to-green-600/5",
        };
      default:
        return {
          bg: "bg-blue-500",
          text: "text-blue-600",
          border: "border-blue-200",
          gradient: "from-blue-500/10 to-blue-600/5",
        };
    }
  };

  const currentColors = getColorClasses(pages[currentPage].color);

  return (
    <motion.div
      className={`${glassStyle} mb-6 overflow-hidden relative`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${currentColors.gradient} pointer-events-none`} />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-4 right-8 w-2 h-2 rounded-full bg-blue-300/30"
          animate={{
            y: [0, -8, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-4 left-12 w-1.5 h-1.5 rounded-full bg-purple-300/30"
          animate={{
            y: [0, 6, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className={`p-2 ${currentColors.bg} rounded-xl shadow-lg`}>
              <div className="text-white">
                {pages[currentPage].icon}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 font-['DM_Sans']">
                {pages[currentPage].title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Step {currentPage + 1} of {pages.length}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center space-x-2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Page indicators */}
            <div className="flex items-center space-x-1 mr-3">
              {pages.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentPage
                      ? currentColors.bg
                      : "bg-gray-300"
                  }`}
                  animate={{
                    scale: index === currentPage ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-1">
              <motion.button
                onClick={prevPage}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </motion.button>
              
              <motion.button
                onClick={nextPage}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>

            {/* Close button */}
            <motion.button
              onClick={onDismiss}
              className="ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Dismiss"
            >
              <X size={16} />
            </motion.button>
          </motion.div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {pages[currentPage].content}
          </motion.div>
        </AnimatePresence>

        {/* Bottom navigation */}
        <motion.div
          className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="text-xs text-gray-500">
            {currentPage === 0 && "Get started with data enrichment"}
            {currentPage === 1 && "Follow these simple steps"}
            {currentPage === 2 && "Explore all available features"}
          </div>
          
          <div className="flex items-center space-x-2">
            {currentPage < pages.length - 1 ? (
              <motion.button
                onClick={nextPage}
                className={`px-4 py-2 ${currentColors.bg} text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center space-x-1`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Next</span>
                <ArrowRight size={14} />
              </motion.button>
            ) : (
              <motion.button
                onClick={onDismiss}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center space-x-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Get Started</span>
                <CheckCircle size={14} />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Subtle bottom accent */}
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 ${currentColors.bg} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
    </motion.div>
  );
};

export default InfoPanel;
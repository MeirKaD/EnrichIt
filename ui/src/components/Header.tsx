import React from "react";
import { Github, Download, Sparkles, Database, Zap } from "lucide-react";
import { exportToCSV } from "../utils";
import { SpreadsheetData } from "../types";
import { motion } from "framer-motion";

interface HeaderProps {
  glassStyle: string;
  data: SpreadsheetData;
}

const Header: React.FC<HeaderProps> = ({ glassStyle, data }) => {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.error("Failed to load logo");
    console.log("Image path:", e.currentTarget.src);
    e.currentTarget.style.display = "none";
  };

  return (
    <div className="relative mb-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-300/20 to-purple-300/10 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -top-5 -left-5 w-20 h-20 rounded-full bg-gradient-to-tr from-green-300/15 to-blue-300/20 blur-lg"
          animate={{
            y: [0, -10, 0],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Main header container */}
      <motion.div
        className={`${glassStyle} relative overflow-hidden`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 via-transparent to-purple-50/10 pointer-events-none" />
        
        {/* Header content */}
        <div className="relative flex items-center justify-between p-8">
          {/* Left side - Logo and title */}
          <div className="flex items-center space-x-6">
            {/* Animated logo section */}
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex items-center justify-center">
                <Database className="w-8 h-8 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/30 to-transparent"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </div>
              {/* Pulse effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-blue-400/30"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </motion.div>

            {/* Title section */}
            <div className="space-y-2">
              <motion.div
                className="flex items-center space-x-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-gray-800 font-['DM_Sans'] tracking-tight">
                  Data Enrichment Agent
                </h1>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </motion.div>
              </motion.div>
              
              <motion.p
                className="text-gray-600 font-['DM_Sans'] flex items-center space-x-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <span>Enrich tabular data using</span>
                <span className="inline-flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full text-sm font-medium text-blue-700">
                  <Zap className="w-3 h-3" />
                  <span>Bright Data</span>
                </span>
                <span>&</span>
                <span className="inline-flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-purple-50 rounded-full text-sm font-medium text-purple-700">
                  <span>Gemini</span>
                </span>
              </motion.p>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <motion.div
            className="flex items-center space-x-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Export button */}
            <motion.button
              onClick={() => exportToCSV(data)}
              className="relative group px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Export to CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-300" />

            {/* Social/External links */}
            <div className="flex items-center space-x-2">
              {/* Bright Data */}
              <motion.a
                href="https://brightdata.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 rounded-xl bg-white/50 hover:bg-white/80 border border-gray-200 hover:border-blue-300 transition-all duration-300 flex items-center justify-center hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Bright Data Website"
              >
                <img
                  src="/brightdataicon.svg"
                  alt="Bright Data Logo"
                  className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-110"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>

              {/* GitHub */}
              <motion.a
                href="https://github.com/brightdata/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 rounded-xl bg-white/50 hover:bg-white/80 border border-gray-200 hover:border-gray-400 transition-all duration-300 flex items-center justify-center hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="GitHub Profile"
              >
                <Github className="w-6 h-6 text-gray-600 transition-all duration-300 group-hover:text-gray-800 group-hover:scale-110" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>

              {/* Gemini */}
              <motion.a
                href="https://gemini.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 rounded-xl bg-white/50 hover:bg-white/80 border border-gray-200 hover:border-purple-300 transition-all duration-300 flex items-center justify-center hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Gemini"
              >
                <img
                  src="/gemini.svg"
                  alt="Gemini Logo"
                  className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-110"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.8 }}
        />
      </motion.div>
    </div>
  );
};

export default Header;
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import Vite from "./Icons/Vite";
import TailwindCSS from "./Icons/Tailwind";
import ShadCNUI from "./Icons/ShadCN";

const TECH_ICONS = [
  {
    type: "Vite",
    position: "left-0",
    link: "https://vitejs.dev",
    name: "Vite",
    icon: <Vite/>,
    zIndex: 10,
  },
  {
    type: "shadcn",
    position: "left-[15px]",
    link: "https://ui.shadcn.com",
    name: "shadcn/ui",
    icon: <ShadCNUI />,
    zIndex: 20,
  },
  {
    type: "tailwind",
    position: "left-[30px]",
    link: "https://tailwindcss.com",
    name: "Tailwind CSS",
    icon: <TailwindCSS />,
    zIndex: 30,
  },
];



const EmptyState: React.FC = () => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  // Animation variants for the icon
  const iconVariants: Variants = {
    initial: { y: 0 },
    hover: {
      y: -8,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 10,
        mass: 0.5,
      },
    },
    exit: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        mass: 0.6,
      },
    },
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="text-4xl font-bold mb-4 flex items-center">
        Open-source{" "}
        <div className="bg-red-600 text-white p-2 py-1 rounded mx-2">Agno</div>{" "}
        Agent Chat UI, built with <span className="ml-2">
        <div className="flex gap-6">
        {TECH_ICONS.map((tech) => (
          <motion.div
            key={tech.type}
            className="relative flex flex-col items-center"
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
            onMouseEnter={() => setHoveredIcon(tech.type)}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <a
              href={tech.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              {tech.icon}
            </a>
            {hoveredIcon === tech.type && (
              <motion.div
                className="absolute top-12 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {tech.name}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
        </span>
      </div>
      <p className="text-xl text-gray-400 mb-10">
        For the full experience, visit the Agent Playground.
      </p>
      <div className="flex gap-4 mb-10">
        <a
          href="http://localhost:8000/"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-700 hover:bg-gray-800 px-6 py-2 rounded-md transition-colors"
        >
          Backend
        </a>
        <a
          href="#"
          className="border border-gray-700 hover:bg-gray-800 px-6 py-2 rounded-md transition-colors"
        >
          DOCS
        </a>
      </div>

      {/* Tech Icons Section */}
    </div>
  );
};

export default EmptyState;

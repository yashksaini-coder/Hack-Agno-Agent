
import React from "react";

const EmptyState: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="text-4xl font-bold mb-4 flex items-center">
        This is an open-source <div className="bg-red-600 text-white p-2 py-1 rounded mx-2">Agno</div> Agent Chat UI, built with <span className="ml-2">⚡</span>
      </div>
      <p className="text-xl text-gray-400 mb-10">
        For the full experience, visit the Agent Playground.
      </p>
      <div className="flex gap-4">
        <a 
          href="#" 
          className="border border-gray-700 hover:bg-gray-800 px-6 py-2 rounded-md transition-colors"
        >
          GO TO DOCS
        </a>
        <a 
          href="#" 
          className="border border-gray-700 hover:bg-gray-800 px-6 py-2 rounded-md transition-colors"
        >
          VISIT AGENT PLAYGROUND
        </a>
      </div>
    </div>
  );
};

export default EmptyState;

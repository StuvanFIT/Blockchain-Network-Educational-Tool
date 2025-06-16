import React, { useState } from 'react';
import { Info } from 'lucide-react';


const InfoTooltip = ({ content, id }:any) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <Info 
        id={id}
        className="w-4 h-4 mb-2 text-slate-500 hover:text-blue-600 cursor-help transition-colors duration-200"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-slate-800 text-white text-sm rounded-lg px-9 py-6 shadow-lg w-96 whitespace-normal">
            <div className="font-medium mb-2">{content.title}</div>
            <div className="text-slate-200">{content.description}</div>
            
            {/* Speech bubble arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Tooltip content configuration
const tooltipContent = {
  'data-tool-tip': {
    title: 'Transaction Data',
    description: 'This contains the actual data being stored in the block, such as transaction details, sender/receiver addresses, amounts, and timestamps. This data gets hashed along with the nonce to create the block hash. Note: we do not use any transaction data here for simplicity.'
  },
  'index-tool-tip': {
    title: 'Block Index',
    description: 'The position of this block in the blockchain. Starting from 0 for the genesis block, each new block increments this number by 1.'
  },
  'prev-hash-tool-tip': {
    title: 'Previous Hash',
    description: 'The hash of the previous block in the chain. This creates the "chain" in blockchain by linking blocks together cryptographically.'
  },
  'timestamp-tool-tip': {
    title: 'Timestamp',
    description: 'The exact time when this block was created, typically in Unix timestamp format or ISO date string. This prevents replay attacks.'
  },
  'difficulty-tool-tip': {
    title: 'Mining Difficulty',
    description: `The number of leading zeros required in the hash.

    Difficulty Levels:
    (0–5) → EASY,
    (6–8) → MEDIUM,
    (9–12) → HARD,
    (13+) → VERY HARD`
  },
  'nonce-tool-tip': {
    title: 'Nonce (Number Once)',
    description: 'A random number that miners increment to try different hash outputs until they find one that meets the difficulty requirement.'
  }
};

export {InfoTooltip, tooltipContent}
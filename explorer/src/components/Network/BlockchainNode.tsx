import React from 'react';
import  ReactFlow, {Handle, Position, NodeProps, XYPosition} from '@xyflow/react';


import { Peer } from '../PeerToPeerNetwork';
import { Database, Pickaxe, Wifi, WifiOff, Zap } from 'lucide-react';

interface BlockchainNodeData {
  peer: Peer;
  selected: boolean;
  onNodeClick: NodeClickHandler;
  onToggleConnection: ToggleConnectionHandler;
  onMineBlock: MineBlockHandler;
}

// Callback function types for node interactions
type NodeClickHandler = (peerId: string) => void;
type ToggleConnectionHandler = (peerId: string) => void;
type MineBlockHandler = (peerId: string) => void;

// Props interface for the BlockchainNode component
interface BlockchainNodeProps {
  data: BlockchainNodeData;
  selected: boolean;
  // Optional: React Flow also passes these props automatically
  id?: string;
  xPos?: number;
  yPos?: number;
  dragging?: boolean;
  targetPosition?: Position;
  sourcePosition?: Position;
}

const BlockchainNode: React.FC<BlockchainNodeProps> = ({data}) => {
  const { peer } = data;
  const isOnline = peer.connected;
  const {selected} = data;

  return (
    <div className="relative group">
      {/* Mining indicator */}
      {selected && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-bounce">
            <Pickaxe size={12} />
            Selected
          </div>
        </div>
      )}

      {/* Main node */}
      <div
        className={`
          relative w-24 h-24 rounded-full transition-all duration-300 transform
          
          ${isOnline ? 'shadow-lg shadow-blue-500/50' : 'shadow-lg shadow-red-500/50'}
          flex flex-col items-center justify-center text-white text-xs font-bold
          ${peer.color || 'bg-slate-600'}
          ${selected ? 'animate-pulse' : ''}
        `}
      >
        {/* Connection status indicator */}
        <div className="absolute -top-2 -right-2 z-10">
          {isOnline ? (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Wifi size={14} className="text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <WifiOff size={14} className="text-white" />
            </div>
          )}
        </div>

        {/* Peer name */}
        <div className="font-bold">{peer.name}</div>
        
        {/* Block count */}
        <div className="flex items-center gap-1 mt-1 text-xs opacity-90">
          <Database size={10} />
          {peer.blockchain.length}
        </div>

        {/* Activity pulse */}
        {isOnline && (
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-30"></div>
        )}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
          <div className="font-semibold">{peer.name}</div>
          <div className="text-xs opacity-75">
            Status: {isOnline ? 'Online' : 'Offline'}
          </div>
          <div className="text-xs opacity-75">
            Blocks: {peer.blockchain.length}
          </div>
          {selected && (
            <div className="text-xs text-yellow-400">
              ⚡ Current Selected Node
            </div>
          )}
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !opacity-0 hover:!opacity-100 !transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !opacity-0 hover:!opacity-100 !transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !opacity-0 hover:!opacity-100 !transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !opacity-0 hover:!opacity-100 !transition-opacity"
      />
    </div>
  );
};

export { BlockchainNode };
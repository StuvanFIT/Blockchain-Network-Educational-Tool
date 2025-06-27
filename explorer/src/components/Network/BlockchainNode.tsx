import React from 'react';
import  ReactFlow, {Handle, Position} from '@xyflow/react';


import { Peer } from '../PeerToPeerNetwork';




interface BlockchainNodeData {
  peer: Peer;
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
const BlockchainNode: React.FC<BlockchainNodeProps> = ({ data }) => {
  const { peer } = data;
  const isOnline = peer.connected;
  const peerColour = peer.color;

  return (
    <div
      className={`
        relative
        w-20 h-20
        rounded-full
        text-white text-sm font-bold
        shadow-lg
        flex items-center justify-center
        ${peerColour || 'bg-gray-400'}
      `}
    >
      {/* Peer name */}
      {peer.name}

      {/* Top handle (incoming connections) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!absolute top-[-6px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rounded-full border border-white z-10"
      />

      {/* Bottom handle (outgoing connections) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rounded-full border border-white z-10"
      />
    </div>
  );
};

export { BlockchainNode };
import { BaseEdge, BezierEdge, EdgeProps, getBezierPath } from '@xyflow/react';

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (

    <>
      <BaseEdge
        id = {id}
        path={edgePath}
        style= {{
          stroke: '#64748b',
          strokeWidth: 2,
          opacity: 0.8
        }}
      />


      {/* Forward motion */}
      <circle r="4" fill="#3b82f6" className="animate-pulse">
        <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
          <mpath href={`#${id}`} />
        </animateMotion>
      </circle>

      {/* Reverse motion */}
      <circle r="4" fill="#f97316" className="animate-pulse">
        <animateMotion dur="3s" repeatCount="indefinite" rotate="auto" keyPoints="1;0" keyTimes="0;1">
          <mpath href={`#${id}`} />
        </animateMotion>
      </circle>




    </>




  )
  
}

interface CrimpPreviewProps {
  widths: {
    lillefinger: number
    ringfinger: number
    langfinger: number
    pekefinger: number
  }
  calculatedHeights: {
    lillefinger: number
    ringfinger: number
    langfinger: number
    pekefinger: number
  }
  depth: number
  totalWidth: number
}

const FINGER_NAMES = ['lillefinger', 'ringfinger', 'langfinger', 'pekefinger'] as const

export default function CrimpPreview({ widths, calculatedHeights, depth, totalWidth }: CrimpPreviewProps) {
  const scale = 3.5
  const padding = 40
  const gap = 2
  const baseHeight = 6
  const angle = 0.5
  
  const fingers = {
    lillefinger: { width: widths.lillefinger, height: calculatedHeights.lillefinger },
    ringfinger: { width: widths.ringfinger, height: calculatedHeights.ringfinger },
    langfinger: { width: widths.langfinger, height: calculatedHeights.langfinger },
    pekefinger: { width: widths.pekefinger, height: calculatedHeights.pekefinger }
  }
  
  const maxHeight = Math.max(...Object.values(fingers).map(f => f.height))
  const depthOffset = depth * scale * angle
  
  const svgWidth = totalWidth * scale + padding * 2 + depthOffset + 20
  const svgHeight = (maxHeight + baseHeight + 5) * scale + padding + 30
  
  let currentX = padding + 5 * scale
  
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="max-h-64">
      <defs>
        <linearGradient id="topGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a0aec0" />
          <stop offset="100%" stopColor="#8b9bb4" />
        </linearGradient>
        <linearGradient id="frontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b9bb4" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="sideGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#718096" />
          <stop offset="100%" stopColor="#8b9bb4" />
        </linearGradient>
        <linearGradient id="baseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b9bb4" />
          <stop offset="100%" stopColor="#718096" />
        </linearGradient>
      </defs>
      
      {/* Base top surface */}
      <polygon
        points={`
          ${padding},${padding + maxHeight * scale}
          ${padding + depthOffset},${padding + maxHeight * scale - depthOffset}
          ${padding + totalWidth * scale + depthOffset},${padding + maxHeight * scale - depthOffset}
          ${padding + totalWidth * scale},${padding + maxHeight * scale}
        `}
        fill="url(#baseGrad)"
        stroke="#5a6a7a"
        strokeWidth={1}
      />
      
      {/* Base front */}
      <rect
        x={padding}
        y={padding + maxHeight * scale}
        width={totalWidth * scale}
        height={baseHeight * scale}
        fill="#64748b"
        stroke="#475569"
        strokeWidth={2}
      />
      
      {/* Finger blocks */}
      {FINGER_NAMES.map((finger) => {
        const f = fingers[finger]
        const blockX = currentX
        const blockWidth = f.width * scale
        const blockHeight = f.height * scale
        const blockY = padding + (maxHeight - f.height) * scale
        
        currentX += f.width * scale + gap * scale
        
        return (
          <g key={finger}>
            {/* Top face */}
            <polygon
              points={`
                ${blockX},${blockY}
                ${blockX + depthOffset},${blockY - depthOffset}
                ${blockX + blockWidth + depthOffset},${blockY - depthOffset}
                ${blockX + blockWidth},${blockY}
              `}
              fill="url(#topGrad)"
              stroke="#5a6a7a"
              strokeWidth={1}
            />
            {/* Right side face */}
            <polygon
              points={`
                ${blockX + blockWidth},${blockY}
                ${blockX + blockWidth + depthOffset},${blockY - depthOffset}
                ${blockX + blockWidth + depthOffset},${blockY + blockHeight - depthOffset}
                ${blockX + blockWidth},${blockY + blockHeight}
              `}
              fill="url(#sideGrad)"
              stroke="#5a6a7a"
              strokeWidth={1}
            />
            {/* Front face */}
            <rect
              x={blockX}
              y={blockY}
              width={blockWidth}
              height={blockHeight}
              fill="url(#frontGrad)"
              stroke="#475569"
              strokeWidth={2}
            />
            {/* Dimensions label */}
            <text
              x={blockX + blockWidth / 2}
              y={blockY + blockHeight / 2}
              fill="#f1f5f9"
              fontSize="10"
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="600"
            >
              {f.width}×{f.height}
            </text>
          </g>
        )
      })}
      
      {/* Depth label */}
      <text 
        x={padding + totalWidth * scale + depthOffset + 8} 
        y={padding + maxHeight * scale / 2}
        fill="#475569"
        fontSize="11"
        fontWeight="500"
      >
        {depth}mm
      </text>
      
      {/* Total width label */}
      <text 
        x={padding + totalWidth * scale / 2} 
        y={padding + maxHeight * scale + baseHeight * scale + 18}
        fill="#475569"
        fontSize="11"
        textAnchor="middle"
        fontWeight="500"
      >
        Totalbredde: {totalWidth}mm
      </text>
    </svg>
  )
}

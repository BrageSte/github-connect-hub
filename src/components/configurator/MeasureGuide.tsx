export default function MeasureGuide() {
  return (
    <svg viewBox="0 0 200 170" className="w-full h-auto max-w-xs mx-auto">
      {/* Four finger rectangles */}
      {/* Lillefinger */}
      <rect x="20" y="80" width="30" height="60" rx="8" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
      <text x="35" y="155" fill="#6b7280" fontSize="10" textAnchor="middle">Lille</text>
      
      {/* Ringfinger */}
      <rect x="58" y="55" width="30" height="85" rx="8" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
      <text x="73" y="155" fill="#6b7280" fontSize="10" textAnchor="middle">Ring</text>
      
      {/* Langfinger */}
      <rect x="96" y="30" width="30" height="110" rx="8" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
      <text x="111" y="155" fill="#6b7280" fontSize="10" textAnchor="middle">Lang</text>
      
      {/* Pekefinger */}
      <rect x="134" y="45" width="30" height="95" rx="8" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
      <text x="149" y="155" fill="#6b7280" fontSize="10" textAnchor="middle">Peke</text>
      
      {/* Joint lines (where to measure) */}
      <line x1="15" y1="80" x2="55" y2="80" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />
      <line x1="53" y1="55" x2="93" y2="55" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />
      <line x1="91" y1="30" x2="131" y2="30" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />
      <line x1="129" y1="45" x2="169" y2="45" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />
      
      {/* Arrow A: between Lille and Ring */}
      <line x1="50" y1="80" x2="50" y2="55" stroke="#1e40af" strokeWidth="2" />
      <polygon points="50,55 47,62 53,62" fill="#1e40af" />
      <circle cx="73" cy="165" r="8" fill="#1e40af" />
      <text x="73" y="168" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">A</text>
      
      {/* Arrow B: between Ring and Lang */}
      <line x1="88" y1="55" x2="88" y2="30" stroke="#1e40af" strokeWidth="2" />
      <polygon points="88,30 85,37 91,37" fill="#1e40af" />
      <circle cx="111" cy="165" r="8" fill="#1e40af" />
      <text x="111" y="168" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">B</text>
      
      {/* Arrow C: between Lang and Peke (down) */}
      <line x1="126" y1="30" x2="126" y2="45" stroke="#dc2626" strokeWidth="2" />
      <polygon points="126,45 123,38 129,38" fill="#dc2626" />
      <circle cx="149" cy="165" r="8" fill="#dc2626" />
      <text x="149" y="168" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">C</text>
    </svg>
  )
}

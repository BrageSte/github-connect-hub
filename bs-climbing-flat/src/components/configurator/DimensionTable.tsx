'use client'

import type { Grip } from '@/types'

interface DimensionTableProps {
  grips: Grip[]
  activeGripId: number | null
  onSelectGrip: (id: number) => void
}

export default function DimensionTable({ grips, activeGripId, onSelectGrip }: DimensionTableProps) {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
        Mål-oversikt
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-text-muted py-2 pr-4">Grep</th>
              <th className="text-right text-xs font-medium text-text-muted py-2 px-4">Høyde</th>
              <th className="text-right text-xs font-medium text-text-muted py-2 pl-4">Bredde</th>
            </tr>
          </thead>
          <tbody>
            {grips.map((grip) => (
              <tr 
                key={grip.id}
                onClick={() => onSelectGrip(grip.id)}
                className={`border-b border-border last:border-b-0 cursor-pointer transition-colors ${
                  activeGripId === grip.id 
                    ? 'bg-primary/10' 
                    : 'hover:bg-surface-light'
                }`}
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        activeGripId === grip.id ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                    <span className="font-medium">Grep {grip.id}</span>
                  </div>
                </td>
                <td className="text-right py-3 px-4 font-mono text-sm">
                  {grip.height}
                  <span className="text-text-muted">mm</span>
                </td>
                <td className="text-right py-3 pl-4 font-mono text-sm">
                  {grip.width}
                  <span className="text-text-muted">mm</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Høyderange</span>
          <span className="font-mono">
            {Math.min(...grips.map(g => g.height))}–{Math.max(...grips.map(g => g.height))}
            <span className="text-text-muted">mm</span>
          </span>
        </div>
      </div>
    </div>
  )
}

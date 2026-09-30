import React, { useState, useRef, useEffect } from 'react';
import { AlertOctagon } from 'lucide-react';

interface PenaltyIconTooltipProps {
  penaltyText: string;
  label?: string;
  className?: string;
  align?: 'right' | 'left';
}

export const PenaltyIconTooltip: React.FC<PenaltyIconTooltipProps> = ({
  penaltyText,
  label = 'Penalti / Hukuman',
  className = '',
  align = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const showDetail = isOpen || isHovered;

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* SVG Icon Only Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
          showDetail
            ? 'bg-rose-600 text-white ring-2 ring-rose-400/60 shadow-md scale-105'
            : 'bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 shadow-2xs hover:scale-105'
        }`}
        title={`${label}: Tekan atau hover untuk lihat perincian`}
        aria-label={`${label}: ${penaltyText}`}
      >
        <AlertOctagon className="w-4 h-4 shrink-0" />
      </button>

      {/* Floating Detail Popover (Appears on hover or click/tap) */}
      {showDetail && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute z-50 bottom-full mb-2 w-64 sm:w-80 bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-rose-500/40 text-xs animate-fadeIn ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          role="tooltip"
        >
          <div className="flex items-start gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="font-extrabold text-[10px] text-rose-300 uppercase tracking-wider block">
                  {label}:
                </span>
                <span className="text-[9px] text-slate-400 font-medium hidden sm:inline">
                  (Tekan untuk tutup)
                </span>
              </div>
              <p className="text-[11px] text-slate-100 leading-relaxed font-normal">
                {penaltyText}
              </p>
            </div>
          </div>
          {/* Triangular notch pointer */}
          <div
            className={`absolute top-full -mt-1 border-4 border-transparent border-t-slate-900/95 ${
              align === 'right' ? 'right-3' : 'left-3'
            }`}
          />
        </div>
      )}
    </div>
  );
};

import { type ReactNode, useState, useEffect, type MouseEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal, Scaling } from 'lucide-react';

interface SortableWidgetProps {
  id: string;
  children: ReactNode;
}

const SPAN_CONFIGS = [
  { css: 'col-span-1 row-span-1' },
  { css: 'md:col-span-2 col-span-1 row-span-1' },
  { css: 'md:col-span-2 col-span-1 row-span-2' },
  { css: 'lg:col-span-3 md:col-span-2 col-span-1 row-span-2' },
];

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1/productivity` : '/api/v1/productivity';

export function SortableWidget({ id, children }: SortableWidgetProps) {
  const [sizeIdx, setSizeIdx] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/layout`)
      .then(res => {
         if (!res.ok) throw new Error();
         return res.json();
      })
      .then(data => {
         if (data?.sizes?.[id] !== undefined) {
            setSizeIdx(data.sizes[id].spanIndex || 0);
         }
      })
      .catch(() => {
         // Fallback mode
         const saved = localStorage.getItem(`widget-sizeIndex-${id}`);
         if (saved) setSizeIdx(parseInt(saved));
      });
  }, [id]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const cycleSize = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const nextIdx = sizeIdx >= SPAN_CONFIGS.length - 1 ? 0 : sizeIdx + 1;
    setSizeIdx(nextIdx);
    
    fetch(`${API_BASE}/layout`)
      .then(res => res.ok ? res.json() : {})
      .then((data: any) => {
         const payload = { ...data, sizes: { ...(data.sizes || {}), [id]: { spanIndex: nextIdx } } };
         fetch(`${API_BASE}/layout`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      })
      .catch(() => {
         localStorage.setItem(`widget-sizeIndex-${id}`, nextIdx.toString());
      });
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.2, 0, 0, 1)',
    zIndex: isDragging ? 50 : 1,
    boxShadow: isDragging ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : undefined,
  };

  const activeSpan = SPAN_CONFIGS[sizeIdx].css;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative group flex flex-col h-full rounded-2xl overflow-hidden border border-slate-800 bg-[#0B1015] shadow-sm hover:shadow-md transition-all duration-300 min-h-[350px] ${activeSpan} ${isDragging ? 'opacity-80 scale-[1.02]' : 'opacity-100'}`}
    >
      <div 
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 z-20"
      >
        <div
           title="Scale Layout Limits"
           onClick={cycleSize}
           onPointerDown={(e) => e.stopPropagation()}
           className="p-1.5 bg-[#0B1015]/80 backdrop-blur-sm rounded-md text-slate-500 hover:text-blue-400 border border-slate-700 cursor-pointer transition-colors"
        >
           <Scaling className="h-4 w-4" />
        </div>
        <div 
          {...attributes} 
          {...listeners}
          className="p-1.5 bg-[#0B1015]/80 backdrop-blur-sm rounded-md text-slate-500 hover:text-emerald-500 border border-slate-700 cursor-grab active:cursor-grabbing transition-colors"
          title="Drag to reposition"
        >
          <GripHorizontal className="h-4 w-4" />
        </div>
      </div>
      <div className="flex-1 flex flex-col w-full h-full p-0">
        {children}
      </div>
    </div>
  );
}

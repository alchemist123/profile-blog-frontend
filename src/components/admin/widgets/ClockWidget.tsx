import { useState, useEffect } from 'react';
import { Cpu } from "lucide-react";

export default function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex flex-col h-full bg-[#0B1015] text-slate-300 border border-slate-800 shadow-2xl rounded-lg relative overflow-hidden">
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/50 flex justify-between items-center relative z-10">
        <h3 className="font-mono text-sm tracking-widest font-semibold text-slate-100 uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-500" /> SYS.Clock
        </h3>
      </div>
      
      <div className="p-6 flex-1 flex flex-col items-center justify-center relative z-10">
         <div className="flex items-end gap-3 mb-2">
            <span className="text-[4.5rem] font-bold font-mono tracking-tighter text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] leading-none text-shadow-glow">
               {displayHours}:{pad(minutes)}
            </span>
            <div className="flex flex-col text-left justify-end pb-2">
               <span className="text-2xl font-bold font-mono text-slate-500 leading-none">{ampm}</span>
               <span className="text-xl font-mono text-blue-400 mt-1.5 leading-none bg-blue-500/10 px-1 py-0.5 rounded border border-blue-500/20 block text-center shadow-inner">{pad(seconds)}</span>
            </div>
         </div>
         <p className="mt-8 border border-slate-700 bg-slate-900/80 px-5 py-2 rounded-sm text-slate-400 font-mono text-xs tracking-[0.2em] uppercase shadow-inner">
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }).replace(/,/g, '')}
         </p>
      </div>
      
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
    </div>
  );
}

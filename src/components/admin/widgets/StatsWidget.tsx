import { Activity, Database, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function StatsWidget() {
  const [stats, setStats] = useState({ tasksExecuted: 0, tasksGoal: 10, deepWorkHours: 0, efficiencyRatio: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/productivity/stats?period=today')
      .then(res => res.json())
      .then(data => {
         if (data) setStats({
            tasksExecuted: data.tasksExecuted || 0,
            tasksGoal: data.tasksGoal || 10,
            deepWorkHours: data.deepWorkHours || 0,
            efficiencyRatio: data.efficiencyRatio || 0,
         });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const ProgressRing = ({ progress, color, stroke }: { progress: number, color: string, stroke: string }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    return (
      <div className="relative flex items-center justify-center">
        <svg className="w-12 h-12 transform -rotate-90 drop-shadow-sm">
          <circle cx="24" cy="24" r={radius} className="fill-transparent stroke-slate-800/80" strokeWidth="4" />
          <circle 
            cx="24" cy="24" r={radius} 
            className={`fill-transparent ${stroke} transition-all duration-1000 ease-in-out`} 
            strokeWidth="4" 
            strokeDasharray={circumference} 
            strokeDashoffset={circumference - (Math.min(progress, 100) / 100) * circumference} 
            strokeLinecap="round" 
          />
        </svg>
        <div className={`absolute flex items-center justify-center ${color} opacity-90`}>
          <Zap className="w-4 h-4 fill-current" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1015] text-slate-300 border border-slate-800 shadow-2xl rounded-lg">
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/50 flex justify-between items-center">
        <div>
          <h3 className="font-mono text-sm tracking-widest font-semibold text-slate-100 uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" /> SYS.Telemetry
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
           <Database className="w-3 h-3" />
           <span className="text-[9px] font-mono uppercase tracking-widest font-bold">{loading ? 'SYNCING...' : 'ONLINE'}</span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-center space-y-6">
        <div className="flex items-center justify-between group p-3 rounded-md bg-slate-900/30 border border-slate-800/50 hover:bg-slate-800/40 transition-colors">
          <div className="flex items-center gap-4">
            <ProgressRing progress={(stats.tasksExecuted/Math.max(stats.tasksGoal, 1))*100} color="text-emerald-500" stroke="stroke-emerald-500" />
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-0.5">Tasks Executed</p>
              <p className="text-2xl font-bold font-mono text-slate-100 leading-none">{stats.tasksExecuted}<span className="text-sm text-slate-600 block inline-block ml-0.5">/{stats.tasksGoal}</span></p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between group p-3 rounded-md bg-slate-900/30 border border-slate-800/50 hover:bg-slate-800/40 transition-colors">
          <div className="flex items-center gap-4">
            <ProgressRing progress={(stats.deepWorkHours/8)*100} color="text-blue-400" stroke="stroke-blue-500" />
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-0.5">Deep Work</p>
              <p className="text-2xl font-bold font-mono text-slate-100 leading-none">{stats.deepWorkHours}<span className="text-sm text-slate-600 block inline-block ml-0.5">h</span></p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between group p-3 rounded-md bg-slate-900/30 border border-slate-800/50 hover:bg-slate-800/40 transition-colors">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400">
                   <Activity className="w-5 h-5" />
                </div>
             </div>
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-0.5">Efficiency Ratio</p>
              <p className="text-2xl font-bold font-mono text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] leading-none">{stats.efficiencyRatio}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

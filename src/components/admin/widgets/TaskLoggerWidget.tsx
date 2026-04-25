import { useState, useEffect, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Square, Terminal } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1/productivity` : '/api/v1/productivity';

export default function TaskLoggerWidget() {
  const [taskName, setTaskName] = useState("");
  const [jiraId, setJiraId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [workType, setWorkType] = useState("office");
  
  const [isLogging, setIsLogging] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/tasks/active`)
      .then(res => {
         if (res.status === 200) return res.json();
         return null;
      })
      .then(activeTask => {
         if (activeTask) {
             setTaskName(activeTask.taskName || "");
             setJiraId(activeTask.jiraId || "");
             setProjectName(activeTask.projectKey || "");
             setWorkType(activeTask.workType || "office");
             setIsLogging(true);
             setStartTime(new Date(activeTask.startTime).getTime());
             setActiveTaskId(activeTask.id);
             setElapsed(Date.now() - new Date(activeTask.startTime).getTime());
         }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLogging && startTime) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLogging, startTime]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = (e: FormEvent) => {
    e.preventDefault();
    if (!taskName || !jiraId || !projectName) return;
    
    fetch(`${API_BASE}/tasks/start`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ taskName, jiraId, projectKey: projectName, workType })
    })
    .then(res => res.json())
    .then(data => {
       setIsLogging(true);
       setStartTime(new Date(data.startTime || new Date()).getTime());
       setActiveTaskId(data.id || "temp");
       setElapsed(0);
    })
    .catch(console.error);
  };

  const handleStop = () => {
    if (activeTaskId) {
       fetch(`${API_BASE}/tasks/${activeTaskId}/stop`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
       }).catch(console.error);
    }

    setIsLogging(false);
    setStartTime(null);
    setActiveTaskId(null);
    setTaskName("");
    setJiraId("");
    setProjectName("");
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1015] text-slate-300 border border-slate-800 shadow-2xl rounded-lg">
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/50 flex justify-between items-center">
        <div>
          <h3 className="font-mono text-sm tracking-widest font-semibold text-slate-100 uppercase flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-500" /> SYS.Tracker
          </h3>
        </div>
        {isLogging && (
          <div className="flex items-center gap-2 text-emerald-500 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-sm h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase animate-pulse">Running</span>
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col justify-center">
        {isLogging ? (
          <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in zoom-in duration-300">
            <div className="w-full text-center space-y-2 mb-2 p-4 border border-slate-800 bg-slate-900/40 rounded-sm">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Target Process</p>
              <p className="font-bold font-mono text-lg text-emerald-100 line-clamp-2 leading-tight">{taskName}</p>
              <div className="flex items-center justify-center gap-3 mt-1">
                 <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">{jiraId}</span>
                 <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">{projectName}</span>
              </div>
            </div>
            
            <div className="font-mono text-5xl font-bold tracking-tighter text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)] py-4">
              {formatTime(elapsed)}
            </div>

            <Button onClick={handleStop} variant="destructive" className="w-full h-11 text-[13px] uppercase tracking-widest font-bold font-mono rounded-sm bg-red-900/30 hover:bg-red-600/90 border border-red-500/50 text-red-100 flex items-center justify-center gap-2 transition-all">
              <Square className="w-4 h-4 fill-current" /> Terminate
            </Button>
          </div>
        ) : (
          <form onSubmit={handleStart} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Process Name</Label>
              <Input 
                placeholder="Initialize task..." 
                value={taskName} 
                onChange={(e) => setTaskName(e.target.value)} 
                className="bg-[#0f172a] shadow-inner border-slate-700 text-slate-200 placeholder:text-slate-600 focus-visible:ring-emerald-500/50 font-mono text-sm h-10 rounded-sm"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex-1">
                  <Label className="text-[10px] font-mono uppercase tracking-widest text-emerald-500/80">Jira Reference *</Label>
                  <Input 
                      placeholder="Required" 
                      value={jiraId} 
                      onChange={(e) => setJiraId(e.target.value)} 
                      className="bg-[#0f172a] shadow-inner border-slate-700 text-slate-200 placeholder:text-slate-600 focus-visible:ring-emerald-500/50 font-mono text-sm h-10 rounded-sm uppercase"
                      required
                  />
                </div>
                
                <div className="space-y-1.5 flex-1">
                  <Label className="text-[10px] font-mono uppercase tracking-widest text-emerald-500/80">Project Key *</Label>
                  <Input 
                      placeholder="Required" 
                      value={projectName} 
                      onChange={(e) => setProjectName(e.target.value)} 
                      className="bg-[#0f172a] shadow-inner border-slate-700 text-slate-200 placeholder:text-slate-600 focus-visible:ring-emerald-500/50 font-mono text-sm h-10 rounded-sm uppercase"
                      required
                  />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Environment</Label>
                <div className="flex gap-2 h-10">
                    <Button 
                    type="button" 
                    variant="default"
                    onClick={() => setWorkType('office')}
                    className={`flex-1 rounded-sm border h-full text-[11px] font-mono font-bold tracking-widest uppercase transition-all ${workType === 'office' ? 'bg-slate-700 border-slate-500 text-white shadow-inner' : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600'}`}
                    >
                    Office
                    </Button>
                    <Button 
                    type="button" 
                    variant="default"
                    onClick={() => setWorkType('personal')}
                    className={`flex-1 rounded-sm border h-full text-[11px] font-mono font-bold tracking-widest uppercase transition-all ${workType === 'personal' ? 'bg-slate-700 border-slate-500 text-white shadow-inner' : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600'}`}
                    >
                    Personal
                    </Button>
                </div>
            </div>

            <Button type="submit" disabled={!taskName || !jiraId || !projectName} className="w-full mt-2 h-12 text-[13px] tracking-[0.2em] uppercase font-mono font-bold rounded-sm flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-[#0B1015] border border-emerald-500/30 transition-all group">
              <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" /> execute_task()
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

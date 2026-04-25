import { useState, useEffect, type FormEvent } from 'react';
import { Calendar as CalendarIcon, MapPin, Video, Plus, Terminal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1/productivity` : '/api/v1/productivity';

export default function CalendarWidget() {
  const defaultDate = new Date().toISOString().split('T')[0];
  const [meetings, setMeetings] = useState<{id:string, title:string, time:string, date:string, type:string}[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newDate, setNewDate] = useState(defaultDate);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/schedule?date=${defaultDate}`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setMeetings(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [defaultDate]);

  const formatShortDate = (dString: string) => {
    const d = new Date(dString);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTime || !newDate) return;

    const [h, m] = newTime.split(':');
    const hh = parseInt(h);
    const formattedTime = `${hh % 12 || 12}:${m} ${hh >= 12 ? 'PM' : 'AM'}`;

    fetch(`${API_BASE}/schedule`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ title: newTitle, date: newDate, time: formattedTime })
    }).then(res => res.json()).then(newMeeting => {
       setMeetings([...meetings, newMeeting.id ? newMeeting : { id: Date.now().toString(), title: newTitle, time: formattedTime, date: newDate, type: 'Meeting' }]);
       setNewTitle("");
       setNewTime("");
    }).catch(console.error);
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1015] text-slate-300 border border-slate-800 shadow-2xl rounded-lg">
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
        <h3 className="font-mono text-sm tracking-widest font-semibold text-slate-100 uppercase flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-500" /> SYS.Schedule
        </h3>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-500 bg-emerald-500/10">
           <Terminal className="w-3 h-3" />
           <span className="text-[9px] font-mono uppercase tracking-widest font-bold">{loading ? "SYNC..." : `${meetings.length} Nodes`}</span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
         <form onSubmit={handleAdd} className="mb-4 flex flex-col gap-2 p-3 bg-slate-900/60 border border-slate-800/80 rounded-md">
            <div className="flex items-center gap-2">
                <Input 
                  placeholder="Insert Agenda..." 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  className="bg-[#0f172a] shadow-inner border-slate-700 text-slate-200 placeholder:text-slate-600 focus-visible:ring-emerald-500/50 font-mono text-[11px] h-8 rounded-sm transition-all flex-1"
                  required
                />
                <Button type="submit" size="icon" disabled={!newTitle || !newTime || !newDate} className="shrink-0 rounded-sm h-8 w-8 bg-emerald-500/10 hover:bg-emerald-500/80 border border-emerald-500/20 text-emerald-400 hover:text-[#0B1015] transition-all">
                  <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <Input 
                  type="date" 
                  value={newDate} 
                  onChange={(e) => setNewDate(e.target.value)} 
                  className="bg-[#0f172a] shadow-inner border-slate-700 text-slate-200 focus-visible:ring-emerald-500/50 font-mono text-[11px] h-8 px-2 cursor-text shrink-0 flex-1 uppercase rounded-sm"
                  required
                />
                <Input 
                  type="time" 
                  value={newTime} 
                  onChange={(e) => setNewTime(e.target.value)} 
                  className="bg-[#0f172a] shadow-inner border-slate-700 text-slate-200 focus-visible:ring-emerald-500/50 font-mono text-[11px] h-8 px-2 cursor-text shrink-0 flex-1 rounded-sm"
                  required
                />
            </div>
         </form>

         <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1 max-h-[200px]">
            {meetings.map((meeting) => (
               <div key={meeting.id} className={`flex flex-col gap-2 p-3 rounded-sm border border-l-[3px] bg-slate-900/40 hover:bg-slate-800/60 transition-colors border-slate-800 border-l-blue-500`}>
                  <div className="flex items-center justify-between">
                     <span className="font-mono font-bold tracking-tight text-[13px] text-slate-100">{meeting.title}</span>
                     <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-mono font-bold tracking-widest">{formatShortDate(meeting.date)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                     <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-slate-500">
                        {meeting.type === 'Video' ? <Video className="w-3 h-3 text-blue-500" /> : <MapPin className="w-3 h-3 text-emerald-500" />} {meeting.type || 'Meeting'}
                     </div>
                     <span className="text-[11px] font-mono text-emerald-400 font-bold">{meeting.time}</span>
                  </div>
               </div>
            ))}
            
            {meetings.length === 0 && !loading && (
               <div className="text-center py-8 text-slate-600 text-xs font-mono tracking-widest uppercase">
                 No parameters set.
               </div>
            )}
         </div>
      </div>
    </div>
  );
}

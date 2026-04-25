import { useState, useEffect, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, CheckSquare, Square, Code } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1/productivity` : '/api/v1/productivity';

export default function PlanningWidget() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<{id: string, text: string, done: boolean}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/queue`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setTodos(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!task) return;
    
    fetch(`${API_BASE}/queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: task })
    })
    .then(res => res.json())
    .then(newTodo => {
       setTodos([{ id: newTodo.id || Date.now().toString(), text: task, done: false }, ...todos]);
       setTask("");
    }).catch(console.error);
  };

  const toggleDone = (id: string, currentDone: boolean) => {
    fetch(`${API_BASE}/queue/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !currentDone })
    }).catch(console.error);
    
    setTodos(todos.map(t => t.id === id ? { ...t, done: !currentDone } : t));
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1015] text-slate-300 border border-slate-800 shadow-2xl rounded-lg">
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/50 flex justify-between items-center">
        <h3 className="font-mono text-sm tracking-widest font-semibold text-slate-100 uppercase flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-500" /> SYS.Queue
        </h3>
        {loading && <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-slate-500">Syncing...</span>}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <form onSubmit={handleAdd} className="mb-4 flex gap-2">
           <Input 
             placeholder="Enqueue script..." 
             value={task} 
             onChange={(e) => setTask(e.target.value)} 
             className="bg-[#0f172a] shadow-inner border-slate-700 text-slate-200 placeholder:text-slate-600 focus-visible:ring-emerald-500/50 font-mono text-[11px] h-9 rounded-sm transition-all flex-1"
           />
           <Button type="submit" size="icon" disabled={!task} className="shrink-0 rounded-sm h-9 w-9 bg-emerald-500/10 hover:bg-emerald-500/80 border border-emerald-500/20 text-emerald-400 hover:text-[#0B1015] transition-all">
             <Plus className="h-4 w-4" />
           </Button>
        </form>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[196px]">
           {todos.map(todo => (
             <div 
               key={todo.id} 
               onClick={() => toggleDone(todo.id, todo.done)}
               className={`flex items-start gap-3 p-3 rounded-sm cursor-pointer transition-all border ${todo.done ? 'bg-[#0f172a]/50 border-transparent opacity-50' : 'bg-[#0f172a] border-slate-700 shadow-sm hover:border-emerald-500/40 hover:shadow-inner'}`}
             >
               <div className="mt-0.5 shrink-0 transition-colors">
                 {todo.done ? (
                   <CheckSquare className="h-4 w-4 text-emerald-500" />
                 ) : (
                   <Square className="h-4 w-4 text-slate-500" />
                 )}
               </div>
               <span className={`text-[12px] font-mono leading-tight tracking-tight select-none transition-all ${todo.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                 {todo.text}
               </span>
             </div>
           ))}
           {todos.length === 0 && !loading && (
             <div className="text-center py-8 text-slate-600 text-[10px] tracking-widest font-mono uppercase">
               Queue is empty. State: IDLE.
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

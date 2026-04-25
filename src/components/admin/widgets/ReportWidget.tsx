import { useState, type FormEvent } from 'react';
import { Download, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1/productivity` : '/api/v1/productivity';

export default function ReportWidget() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async (e: FormEvent) => {
     e.preventDefault();
     if (!startDate || !endDate) return;
     
     setLoading(true);
     try {
         const response = await fetch(`${API_BASE}/report?startDate=${startDate}&endDate=${endDate}`);
         if (!response.ok) throw new Error("Report fetch failed");
         
         const contentType = response.headers.get("content-type");
         if (contentType && contentType.includes("application/json")) {
             const data = await response.json();
             const header = "Task Name,Jira ID,Duration,Date\n";
             const rows = Array.isArray(data) ? data.map((r: any) => `${r.taskName || ''},${r.jiraId || ''},${r.durationMs ? Math.round(r.durationMs/360000) / 10 + 'h' : '0h'},${r.date || ''}`).join("\n") : "";
             const csvContent = `data:text/csv;charset=utf-8,${header}${rows}`;
             const encodedUri = encodeURI(csvContent);
             const link = document.createElement("a");
             link.setAttribute("href", encodedUri);
             link.setAttribute("download", `productivity_report_${startDate}_to_${endDate}.csv`);
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
         } else {
             const blob = await response.blob();
             const url = window.URL.createObjectURL(blob);
             const link = document.createElement("a");
             link.href = url;
             link.setAttribute("download", `productivity_report_${startDate}_to_${endDate}.csv`);
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
             window.URL.revokeObjectURL(url);
         }
     } catch (err) {
         console.error(err);
     } finally {
         setLoading(false);
     }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1015] text-slate-300 border border-slate-800 shadow-2xl rounded-lg">
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/50 flex justify-between items-center">
        <h3 className="font-mono text-sm tracking-widest font-semibold text-slate-100 uppercase flex items-center gap-2">
            <FileDown className="w-4 h-4 text-emerald-500" /> SYS.Export
        </h3>
      </div>
      
      <div className="p-6 flex-1 flex flex-col justify-center">
         <form onSubmit={handleDownload} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">T_START</Label>
                  <Input 
                     type="date"
                     required
                     value={startDate}
                     onChange={e => setStartDate(e.target.value)}
                     className="bg-[#0f172a] shadow-inner border-slate-700 text-slate-200 focus-visible:ring-emerald-500/50 font-mono text-[11px] h-10 rounded-sm uppercase tracking-widest w-full"
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">T_END</Label>
                  <Input 
                     type="date"
                     required
                     value={endDate}
                     onChange={e => setEndDate(e.target.value)}
                     className="bg-[#0f172a] shadow-inner border-slate-700 text-slate-200 focus-visible:ring-emerald-500/50 font-mono text-[11px] h-10 rounded-sm uppercase tracking-widest w-full"
                  />
               </div>
            </div>

            <Button type="submit" disabled={!startDate || !endDate || loading} className="w-full mt-2 h-12 text-[12px] tracking-[0.2em] font-bold uppercase font-mono rounded-sm flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 shadow-inner border border-slate-600 transition-all group">
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 text-emerald-500 transition-transform" /> {loading ? "BUILDING..." : "Dump _ CSV"}
            </Button>
         </form>
      </div>
    </div>
  );
}

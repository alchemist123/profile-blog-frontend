import { useState, type FormEvent } from 'react';
import { Download, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ReportWidget() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDownload = (e: FormEvent) => {
     e.preventDefault();
     if (!startDate || !endDate) return;
     
     const csvContent = "data:text/csv;charset=utf-8,Task Name,Jira ID,Duration,Date\nFix Header,ALPHA-101,2h,2026-04-23\nDeploy Product,BETA-9,4h,2026-04-23";
     const encodedUri = encodeURI(csvContent);
     const link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", `productivity_report_${startDate}_to_${endDate}.csv`);
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
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

            <Button type="submit" disabled={!startDate || !endDate} className="w-full mt-2 h-12 text-[12px] tracking-[0.2em] font-bold uppercase font-mono rounded-sm flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 shadow-inner border border-slate-600 transition-all group">
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 text-emerald-500 transition-transform" /> Dump _ CSV
            </Button>
         </form>
      </div>
    </div>
  );
}

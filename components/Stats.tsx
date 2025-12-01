import React from 'react';
import { DayStats } from '../types';

export const Stats: React.FC<{ stats: DayStats }> = ({ stats }) => {
  return (
    <div className="flex flex-col gap-3 mt-6">
      {/* Total Work Days - Separate Card */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/60 flex items-center justify-between shadow-sm">
          <span className="text-slate-600 font-medium text-sm uppercase tracking-wide">Всего рабочих смен</span>
          <span className="text-2xl font-bold text-slate-800">{stats.workDays}</span>
      </div>

      {/* Breakdown Grid serving as Legend */}
      <div className="grid grid-cols-3 gap-3">
        {/* Tastak */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3 border border-white/60 flex flex-col items-center justify-center gap-3 shadow-sm group hover:bg-white/80 transition-colors">
            {/* Visual Color Indicator matching Calendar */}
            <div className="w-full h-6 rounded-lg bg-gradient-to-br from-tastak-from to-tastak-to shadow-sm shadow-emerald-200/50" />
            
            <div className="text-center">
                <div className="text-xl font-bold text-slate-800 leading-none mb-1">{stats.tastakDays}</div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Тастак</div>
            </div>
        </div>

        {/* Saryarka */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3 border border-white/60 flex flex-col items-center justify-center gap-3 shadow-sm group hover:bg-white/80 transition-colors">
             <div className="w-full h-6 rounded-lg bg-gradient-to-br from-saryarka-from to-saryarka-to shadow-sm shadow-indigo-200/50" />
             
             <div className="text-center">
                <div className="text-xl font-bold text-slate-800 leading-none mb-1">{stats.saryarkaDays}</div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Сарыарка</div>
            </div>
        </div>

        {/* Off */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3 border border-white/60 flex flex-col items-center justify-center gap-3 shadow-sm group hover:bg-white/80 transition-colors">
             <div className="w-full h-6 rounded-lg bg-gradient-to-br from-off-from to-off-to shadow-sm shadow-rose-200/50" />
             
             <div className="text-center">
                <div className="text-xl font-bold text-slate-800 leading-none mb-1">{stats.offDays}</div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Выходные</div>
            </div>
        </div>
      </div>
    </div>
  );
};
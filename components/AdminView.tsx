import React, { useState } from 'react';
import { ScheduleItem, DayStats } from '../types';
import { WEEKDAYS } from '../constants';
import { DayCell } from './DayCell';
import { Stats } from './Stats';
import { EditModal } from './EditModal';
import { Save, Loader2, RefreshCcw } from 'lucide-react';
import { cn, getDaysInMonth, getFirstDayOfMonth, isToday as checkIsToday } from '../utils';

interface AdminViewProps {
  schedule: ScheduleItem[];
  scheduleMap: Record<string, ScheduleItem>;
  stats: DayStats;
  currentYear: number;
  currentMonth: number;
  onUpdateSchedule: (newSchedule: ScheduleItem[]) => void;
  onSaveToCloud: () => Promise<void>;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

export const AdminView: React.FC<AdminViewProps> = ({ 
    schedule, 
    scheduleMap, 
    stats, 
    currentYear,
    currentMonth,
    onUpdateSchedule, 
    onSaveToCloud, 
    isSaving, 
    hasUnsavedChanges 
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const startEmptyDays = getFirstDayOfMonth(currentYear, currentMonth);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setIsEditModalOpen(true);
  };

  const handleSaveDay = (updatedItem: ScheduleItem) => {
    // Replace or add item in schedule array
    const newSchedule = schedule.filter(item => item.date !== updatedItem.date);
    newSchedule.push(updatedItem);
    // Sort by date just in case
    newSchedule.sort((a, b) => a.date.localeCompare(b.date));
    
    onUpdateSchedule(newSchedule);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Режим редактора</h2>
        <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
                 <span className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full animate-pulse">
                    Есть несохраненные изменения
                 </span>
            )}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-indigo-100 relative overflow-hidden">
        {/* Striped pattern for admin feel */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />

        <div className="grid grid-cols-7 gap-2 mb-4">
            {WEEKDAYS.map(day => (
                <div key={day} className="text-center">
                    <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
                        {day}
                    </span>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {Array.from({ length: startEmptyDays }).map((_, i) => (
                <div key={`empty-${i}`} className="w-full aspect-square" />
            ))}

            {Array.from({ length: totalDays }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const item = scheduleMap[dateStr];
                const isToday = checkIsToday(currentYear, currentMonth, day);
                
                return (
                    <div key={day} className="relative group">
                        <DayCell 
                            day={day}
                            data={item}
                            isToday={isToday}
                            onClick={() => handleDayClick(day)}
                        />
                        {/* Edit Hint Overlay */}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
                            <div className="bg-white/90 p-1 rounded-full shadow-sm">
                                <RefreshCcw size={14} className="text-slate-700" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      <Stats stats={stats} />

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
            onClick={onSaveToCloud}
            disabled={isSaving || !hasUnsavedChanges}
            className={cn(
                "h-14 px-6 rounded-full font-bold shadow-2xl flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95",
                hasUnsavedChanges 
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-300"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
            )}
        >
            {isSaving ? (
                <Loader2 className="animate-spin" size={24} />
            ) : (
                <Save size={24} />
            )}
            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>

      <EditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveDay}
        day={selectedDay}
        currentYear={currentYear}
        currentMonth={currentMonth}
        data={selectedDay ? scheduleMap[`${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`] : null}
      />
    </div>
  );
};
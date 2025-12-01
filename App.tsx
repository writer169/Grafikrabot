
import React, { useState, useEffect, useMemo } from 'react';
import { SCHEDULE_DATA as DEFAULT_SCHEDULE, WEEKDAYS } from './constants';
import { ScheduleItem } from './types';
import { DayCell } from './components/DayCell';
import { DetailsModal } from './components/DetailsModal';
import { Stats } from './components/Stats';
import { AdminView } from './components/AdminView';
import { getMonthStats } from './utils';
import { Calendar as CalendarIcon, Lock, Loader2 } from 'lucide-react';

// Fallback logic for when API is not available or local dev without Mongo
const getInitialSchedule = () => DEFAULT_SCHEDULE;

const App: React.FC = () => {
  // Routing & Auth State
  const [accessKey, setAccessKey] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data State
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // UI State
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedData, setSelectedData] = useState<ScheduleItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Check URL for key and Fetch Data
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key') || params.get('k');
    
    if (!key) {
      setError("Отсутствует ключ доступа");
      setIsLoading(false);
      return;
    }

    setAccessKey(key);

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/schedule?key=${key}`);
        
        if (res.status === 401 || res.status === 403) {
           setError("Неверный ключ доступа");
           setIsLoading(false);
           return;
        }

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setUserRole(data.role);
        // If DB has data, use it; otherwise fallback to constants (or empty)
        setSchedule(data.schedule || getInitialSchedule());
      } catch (err) {
        console.error("API Fetch Error:", err);
        // Fallback for demo/dev if API fails
        console.warn("Using local fallback data");
        setSchedule(getInitialSchedule());
        // For testing admin interface locally, uncomment below:
        // setUserRole('admin'); 
        // setError(null);
        setError("Ошибка подключения к серверу");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Derived State
  const scheduleMap = useMemo(() => {
    const map: Record<string, ScheduleItem> = {};
    schedule.forEach(item => {
      map[item.date] = item;
    });
    return map;
  }, [schedule]);

  const stats = useMemo(() => getMonthStats(schedule), [schedule]);

  const totalDays = 31;
  const startEmptyDays = 0;
  const todayStr = new Date().toISOString().split('T')[0];

  // Logic Helpers
  const handleDayClick = (day: number, data?: ScheduleItem) => {
    setSelectedDay(day);
    setSelectedData(data || null);
    setIsModalOpen(true);
  };

  const handleUpdateSchedule = (newSchedule: ScheduleItem[]) => {
    setSchedule(newSchedule);
    setHasUnsavedChanges(true);
  };

  const handleSaveToCloud = async () => {
    if (!accessKey) return;
    setIsSaving(true);
    try {
        const res = await fetch(`/api/schedule?key=${accessKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ schedule })
        });
        
        if (!res.ok) throw new Error("Failed to save");
        
        setHasUnsavedChanges(false);
        // Optional: Show success toast
    } catch (e) {
        alert("Ошибка при сохранении!");
        console.error(e);
    } finally {
        setIsSaving(false);
    }
  };

  // Render Logic
  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-indigo-600 gap-4">
            <Loader2 className="animate-spin w-10 h-10" />
            <p className="font-medium">Загрузка данных...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm text-center">
                <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lock size={32} />
                </div>
                <h1 className="text-xl font-bold text-slate-800 mb-2">Доступ запрещен</h1>
                <p className="text-slate-500">{error}</p>
                <p className="text-xs text-slate-400 mt-6">Проверьте ссылку или обратитесь к администратору</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-200/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <CalendarIcon size={20} />
                    <span className="text-sm font-semibold uppercase tracking-widest">Рабочий график</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Декабрь <span className="text-indigo-600">2025</span>
                </h1>
            </div>
            {userRole === 'admin' && (
                <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                    Administrator
                </div>
            )}
        </header>

        {/* ADMIN VIEW */}
        {userRole === 'admin' ? (
            <AdminView 
                schedule={schedule}
                scheduleMap={scheduleMap}
                stats={stats}
                onUpdateSchedule={handleUpdateSchedule}
                onSaveToCloud={handleSaveToCloud}
                isSaving={isSaving}
                hasUnsavedChanges={hasUnsavedChanges}
            />
        ) : (
        /* USER VIEW */
        <>
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl shadow-slate-200/50 border border-white/50">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {WEEKDAYS.map(day => (
                        <div key={day} className="text-center">
                            <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
                                {day}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                    {Array.from({ length: startEmptyDays }).map((_, i) => (
                        <div key={`empty-${i}`} className="w-full aspect-square" />
                    ))}

                    {Array.from({ length: totalDays }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `2025-12-${String(day).padStart(2, '0')}`;
                        const item = scheduleMap[dateStr];
                        const isToday = dateStr === todayStr;

                        return (
                            <DayCell 
                                key={day}
                                day={day}
                                data={item}
                                isToday={isToday}
                                onClick={handleDayClick}
                            />
                        );
                    })}
                </div>
            </div>

            <Stats stats={stats} />
        </>
        )}

        {/* Details Modal (Read Only for everyone) */}
        {/* Note: Admin edits via a different modal inside AdminView */}
        <DetailsModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            day={selectedDay}
            data={selectedData}
        />

      </div>
    </div>
  );
};

export default App;
